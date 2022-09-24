import moment from 'moment';
import {RateLimit} from 'async-sema';

const AllowedLimit = RateLimit(100); // 100 execution per second
import {Booking, ScheduleBooking} from "../../../data/models";
// Helpers
import {
    getBookingData,
    getNearestDrivers,
    createBookingHistory
} from '../../../helpers/booking/bookingHelpers';
import {
    updateDriverActiveStatus,
    getUserProfileData,
    getVehicleData,
    getPromoCodeData
} from '../../../helpers/booking/commonHelpers';
import {
    updateBookingDetails,
    updateScheduleBookingStatus,
    createScheduleBookingHistory
} from '../../../helpers/booking/scheduleBookingHelpers';
import {
    generateRideRequestPushNotificationLookup
} from '../../../helpers/booking/bookingLookupUtils';
import {sendNotifications} from '../../../helpers/push-notification/sendNotifications';
import {sendSocketNotification} from '../../../helpers/socketNotification/sendSocketNotification';
import {distance as maxDistance} from '../../../config';

const scheduleBookingAction = async () => {
    let i, assignedDriversData = [];
    let scheduleTriggerDuration = 15; // 15 Minutes - Find future booking upto 15 minutes
    let currentTimeStamp = moment().unix();
    let expectedScheduleTriggerAt = moment.unix(currentTimeStamp).add(scheduleTriggerDuration, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    expectedScheduleTriggerAt = moment(expectedScheduleTriggerAt).format('YYYY-MM-DD HH:mm');

    // Booking Attibutes
    let bookingAttributes = [
        'id', 'pickUpLat', 'pickUpLng', 'pickUpLocation', 'riderLocation', 'riderLocationLat', 'riderLocationLng',
        'dropOffLocation', 'dropOffLat', 'dropOffLng', 'riderId', 'vehicleType', 'vehicleId', 'vehicleNumber', 'vehicleModel', 'vehicleColor',
        'promoCodeId', 'isSpecialTrip', 'specialTripPrice', 'specialTripTotalFare', 'riderPayableFare', 'bookingType'
    ];
    // User Attributes
    let userAttributes = ['phoneDialCode', 'phoneNumber', 'overallRating']

    const scheduleBookingList = await ScheduleBooking.findAll({ // Finding the scheduled bookings
        attributes: ['id', 'bookingId', 'scheduleFrom', 'scheduleTo'],
        where: {
            tripStatus: 'scheduled',
            scheduleFrom: {
                $lte: expectedScheduleTriggerAt
            }
        },
        order: [['scheduleFrom', 'ASC']],
        raw: true
    });

    if (scheduleBookingList && scheduleBookingList.length > 0) {

        for (i in scheduleBookingList) {
            await AllowedLimit();
            let scheduleBookingData = scheduleBookingList[i];
            let scheduleId = scheduleBookingData && scheduleBookingData.id;
            let bookingId = scheduleBookingData && scheduleBookingData.bookingId;
            let driverId = null, assignedDriversQuery = ''; // For Driver
            let riderPreferredLang, driverPreferredLang;
            let pushNotificationContent = {}, requestLocationData;
            let formattedScheduleFrom, formattedScheduleTo;

            if (scheduleBookingData && scheduleBookingData.scheduleFrom) {
                formattedScheduleFrom = moment(scheduleBookingData.scheduleFrom).utc().set({s: 0}).format('YYYY-MM-DD HH:mm:ss');
                formattedScheduleTo = moment(scheduleBookingData.scheduleTo).utc().set({s: 0}).format('YYYY-MM-DD HH:mm:ss');
            }

            assignedDriversData = [...new Set(assignedDriversData)]; // Prepare the assigned drivers look up
            assignedDriversData && assignedDriversData.length > 0 && assignedDriversData.map((o, i) => {
                // Prepare the already assigned drivers where IN query
                assignedDriversQuery = assignedDriversQuery + (i !== 0 ? `, "${o}"` : `"${o}"`);
            });

            const { // Fetch the booking details
                pickUpLat, pickUpLng, pickUpLocation, riderLocation, riderLocationLat, riderLocationLng,
                dropOffLocation, dropOffLat, dropOffLng, riderId, vehicleType: category, promoCodeId,
                isSpecialTrip, specialTripPrice, specialTripTotalFare, riderPayableFare, bookingType
            } = await getBookingData(bookingId, null, null, bookingAttributes);

            const promoCodeData = await getPromoCodeData(promoCodeId, riderId, bookingId); // get promo code data

            const riderProfileData = await getUserProfileData(riderId, null, userAttributes); // Fetch rider data
            riderPreferredLang = riderProfileData && riderProfileData.preferredLanguage;

            requestLocationData = {
                riderLocation, riderLocationLat, riderLocationLng, pickUpLocation, pickUpLat, pickUpLng,
                dropOffLocation, dropOffLat, dropOffLng
            };
            // Generate push notification
            pushNotificationContent = generateRideRequestPushNotificationLookup(
                requestLocationData, riderProfileData, null, promoCodeData, riderId, driverId, bookingId, category,
                isSpecialTrip, specialTripPrice, specialTripTotalFare, riderPayableFare, scheduleId, bookingType
            );

            const isRiderActiveBooking = await Booking.findOne({
                attributes: ['id'],
                where: {
                    riderId,
                    tripStatus: {
                        $in: ['created', 'started', 'approved']
                    }
                },
                raw: true
            });

            // Check Active booking and cancel the scheduled booking
            if (isRiderActiveBooking) {
                await createScheduleBookingHistory(bookingId, scheduleId, formattedScheduleFrom, formattedScheduleTo, 'failed');
                await updateScheduleBookingStatus(
                    bookingId, 'failed', 'expired',
                    'Schedule Booking auto trip request CRON - Already in a active ride.'
                ); // ScheduleBooking => failed & Booking => expired

                [pushNotificationContent['title'], pushNotificationContent['message'], pushNotificationContent['notificationType']] = [undefined, undefined, undefined];
                pushNotificationContent['isTryAgain'] = false;
                // Send push notification to driver
                sendNotifications('scheduleCancelled', pushNotificationContent, riderId, riderPreferredLang);
            } else {
                // Send push notification to rider for schedule ride initiate
                sendNotifications('scheduleInitiate', pushNotificationContent, riderId, riderPreferredLang);

                // Find the nearest drivers
                const nearestDrivers = await getNearestDrivers(riderId, pickUpLat, pickUpLng, category, bookingId, maxDistance, assignedDriversQuery);

                if (nearestDrivers && nearestDrivers.length > 0) { // Drivers Available
                    driverId = nearestDrivers[0].id;
                    assignedDriversData.push(driverId);
                    const driverProfileData = await getUserProfileData(driverId, null, userAttributes); // Fetch driver data
                    driverPreferredLang = driverProfileData && driverProfileData.preferredLanguage;
                    const vehicleData = await getVehicleData(driverId); // get driver vehicle data

                    await createBookingHistory(bookingId, riderId, driverId);
                    await createScheduleBookingHistory(bookingId, scheduleId, formattedScheduleFrom, formattedScheduleTo, 'completed');
                    await updateScheduleBookingStatus(bookingId, 'completed', 'created', null);
                    await updateDriverActiveStatus(driverId, 'inactive');
                    await updateBookingDetails(bookingId, driverId, vehicleData && vehicleData.id, vehicleData && vehicleData.vehicleNumber, vehicleData && vehicleData.vehicleModel, vehicleData && vehicleData.vehicleColor);

                    // Generate push notification
                    pushNotificationContent = generateRideRequestPushNotificationLookup(
                        requestLocationData, riderProfileData, driverId, promoCodeData, riderId, driverId, bookingId, category,
                        isSpecialTrip, specialTripPrice, specialTripTotalFare, riderPayableFare, scheduleId, bookingType
                    );
                    // Send push notification to driver
                    sendNotifications('tripRequest', pushNotificationContent, driverId, driverPreferredLang);
                    // Send socket notification to driver
                    sendSocketNotification('tripRequest-' + driverId, pushNotificationContent);
                } else { // No Drivers
                    await createScheduleBookingHistory(bookingId, scheduleId, formattedScheduleFrom, formattedScheduleTo, 'failed');
                    await updateScheduleBookingStatus(bookingId); // ScheduleBooking => failed & Booking => expired
                    [pushNotificationContent['title'], pushNotificationContent['message'], pushNotificationContent['notificationType']] = [undefined, undefined, undefined];
                    pushNotificationContent['isTryAgain'] = false;
                    // Send push notification to driver
                    sendNotifications('scheduleFailed', pushNotificationContent, riderId, riderPreferredLang);
                    // Send socket notification to driver
                    sendSocketNotification('tripRequest-' + riderId, pushNotificationContent, 'Sorry! no drivers available for your ride.');
                }
            }
        }
    }
}

export default scheduleBookingAction;