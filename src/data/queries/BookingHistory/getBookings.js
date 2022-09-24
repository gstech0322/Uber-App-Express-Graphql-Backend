import {
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';
import { Booking, User } from '../../models';
import TripsHistoryType from '../../types/TripsHistoryType'; 
import { getUserBanStatus } from '../../../helpers/booking/commonHelpers'; 

const getBookings = {

    type: TripsHistoryType, 
    
    args: { 
        currentPage: { type: IntType },
        requestType: { type: StringType } // previous / upcoming
    },

    async resolve({ request }, { currentPage, requestType }) {
        try { 
            if (request.user) {
                let userId = request.user.id;
                let userType = 1, where = {};
                let limit = 5, offset = 0;
                let tripStatus = requestType !== 'previous' ? ['created', 'approved', 'started', 'scheduled'] : ['declined', 'cancelledByRider', 'cancelledByDriver', 'completed'];
                let order = requestType === 'previous' ? [['id', 'DESC']] : [['tripStart', 'ASC']];
                const { userStatusErrorMessage } = await getUserBanStatus(userId); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: 400,
                        errorMessage: userStatusErrorMessage
                    };
                }

                const userData = await User.findOne({
                    attributes: ['userType'],
                    where: {
                        id: userId
                    },
                    raw: true
                });
                userType = userData && userData.userType; // Find the user type

                if (userType === 1) {
                    where['riderId'] = userId;
                    requestType === 'previous' ? tripStatus.push('expired') : null;
                } else {
                    where['driverId'] = userId;
                }

                // Filter
                where['tripStatus'] = {
                    $in: tripStatus
                };

                if (currentPage) { // Pagination
                    offset = (currentPage - 1) * limit;
                }

                const count = await Booking.count({
                    where
                });

                const bookings = await Booking.findAll({
                    where,
                    limit,
                    offset,
                    order
                });

                return await {
                    status: 200,
                    results: {
                        bookings,
                        count
                    }
                };
            } else {
                return await {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged in with your account. Please login and continue.'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }

    },
};

export default getBookings;

/*

query getBookings($currentPage: Int!, $requestType: String!) {
  getBookings(currentPage: $currentPage, requestType: $requestType) {
    status
    errorMessage
    results {
      bookings {
        id
        riderLocation
        riderLocationLat
        riderLocationLng
        pickUpLocation
        pickUpLat
        pickUpLng
        dropOffLocation
        dropOffLat
        dropOffLng
        riderId
        driverId
        tripStatus
        vehicleType
        totalRideDistance
        baseFare
        baseMinute
        baseUnit
        riderServiceFee
        driverServiceFee
        estimatedTotalFare
        totalFare
        totalDuration
        paymentType
        paymentStatus
        transactionId
        startDate
        startTime
        endDate
        endTime
        tripStart
        tripEnd
        currency
        riderTotalFare
        driverTotalFare
        vehicleId
        vehicleNumber
        isSpecialTrip
        specialTripPrice
        specialTripTotalFare
        isTipGiven
        tipsAmount
        tipsTotalFare
        tipsDriverTotalFare
        tollFee
        riderPayableFare
        bookingType
        scheduleBookingDetails {
          id
          bookingId
          tripStatus
          scheduleFrom
          scheduleTo
        }
        riderDetails {
          userId
          userData {
            lat
            lng
            phoneNumber
          }
          firstName
          lastName
          picture
          location
        }
        driverDetails {
          userId
          userData {
            lat
            lng
            phoneNumber
          }
          firstName
          lastName
          picture
          location
          vehicleDetails {
            id
            vehicleName
            vehicleNumber
            vehicleType
            vehicleStatus
            vehicleRC
            vehicleInsurance
            vehicleRCName
            vehicleInsuranceName
            vehicleCategoryDetails {
              id
              categoryName
              categoryImage
              categoryMarkerImage
              unitPrice
              basePrice
              isActive
              currency
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
}

*/
