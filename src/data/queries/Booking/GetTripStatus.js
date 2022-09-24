import { Booking, User } from '../../models';
import GetTripStatusType from '../../types/GetTripStatusType';

const GetTripStatus = {

    type: GetTripStatusType,

    async resolve({ request }) {
        try { 
            if (request.user) {
                let userId = request.user.id; 
                let UserBookingDetails;
                let userIdFilter = {}, statusFilter = {};

                let userData = await User.findOne({
                    attributes: ['userType'],
                    where: {
                        id: userId,
                        deletedAt: null
                    },
                    raw: true
                });

                if(userData && userData.userType === 1) { // Rider
                    userIdFilter = {
                        riderId: userId
                    };
                } else if(userData && userData.userType === 2) { // Driver
                    userIdFilter = {
                        driverId: userId
                    };
                }

                statusFilter = {
                    tripStatus: {
                        $in: ['created', 'started', 'approved']
                    }
                };
                
                UserBookingDetails = await Booking.findOne({
                    where: {
                        $and: [
                            userIdFilter,
                            statusFilter
                        ]
                    },
                    order: [
                        ['tripStart', 'ASC'],
                        [`id`, `DESC`],
                    ], 
                    raw: true
                });

                if (UserBookingDetails) {
                    return await {
                        result: UserBookingDetails,
                        status: 200 
                    }
                } else {
                    return await {
                        status: 400,
                        errorMessage: 'Sorry, no trips found!'
                    } 
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'You are not LoggedIn'
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

export default GetTripStatus;

/**
query GetTripStatus{
  GetTripStatus{
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
      riderDetails {
        userId
        userData {
          lat
          lng 
        }
        firstName
        lastName
        picture
        location
        phoneNumber
      }
      driverDetails {
        userId
        userData {
          lat
          lng 
        }
        firstName
        lastName
        picture
        location
        phoneNumber
      }
    }
    status
    errorMessage
  }
}


 */
