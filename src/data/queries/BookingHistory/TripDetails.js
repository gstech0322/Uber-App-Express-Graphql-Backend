import { GraphQLInt as IntType } from 'graphql';
import { Booking } from '../../models';
import GetTripStatusType from '../../types/GetTripStatusType';
import { getUserBanStatus } from '../../../helpers/booking/commonHelpers'; 

const TripDetails = {

    type: GetTripStatusType, 
    
    args: { 
        bookingId: { type: IntType }, 
    },

    async resolve({ request }, { bookingId }) {
        try { 
            if (request.user) {
                let userId = request.user.id;

                const { userStatusErrorMessage } = await getUserBanStatus(userId); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: 400,
                        errorMessage: userStatusErrorMessage
                    };
                }

                const result = await Booking.findOne({
                    where: {
                        id: bookingId,
                        $or: [{
                          riderId: userId
                        }, {
                          driverId: userId
                        }]
                    },
                    raw: true
                });

                if(result) {
                    return {
                        status: 200, 
                        result
                    };
                } else {
                    return {
                        status: 400,
                        errorMessage: 'No trips found'
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! Please login with your account and try again.'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }
    }
};

export default TripDetails;

/*

query TripDetails($bookingId: Int) {
  TripDetails(bookingId: $bookingId) {
    result {
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
      }
      categoryDetails {
        categoryName
        categoryMarkerImage
        categoryImage
      }
    }
    status
    errorMessage
  }
}

*/
