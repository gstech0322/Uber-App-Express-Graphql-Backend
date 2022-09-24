import {
    GraphQLObjectType as ObjectType,
    GraphQLInt as IntType,
    GraphQLString as StringType,
    GraphQLFloat as FloatType,
    GraphQLBoolean as BooleanType
} from 'graphql';


const BookingResponseType = new ObjectType({
    name: 'BookingResponseType',
    fields: {
        id: {
            type: StringType
        },
        name: {
            type: StringType
        },
        userId: {
            type: StringType
        },
        riderId: {
            type: StringType
        },
        driverId: {
            type: StringType
        },
        picture: {
            type: StringType
        },
        phoneNumber: {
            type: StringType
        },
        riderLocation: {
            type: StringType
        },
        riderLocationLat: {
            type: FloatType
        },
        riderLocationLng: {
            type: FloatType
        },
        pickUpLocation: {
            type: StringType
        },
        pickUpLat: {
            type: FloatType
        },
        pickUpLng: {
            type: FloatType
        },
        dropOffLocation: {
            type: StringType
        },
        dropOffLat: {
            type: FloatType
        },
        dropOffLng: {
            type: FloatType
        },
        bookingId: {
            type: IntType
        },
        category: {
            type: IntType
        },
        overallRating: {
            type: FloatType
        },
        driverLat: {
            type: FloatType
        },
        driverLng: {
            type: FloatType
        },
        locationUpdate: {
            type: BooleanType
        },
        tripStatus: {
            type: StringType
        },
        vehicleType: {
            type: IntType
        },
        totalRideDistance: {
            type: FloatType
        },
        baseFare: {
            type: FloatType
        },
        baseUnit: {
            type: FloatType
        },
        baseMinute: {
            type: FloatType
        },
        riderServiceFee: {
            type: FloatType
        },
        driverServiceFee: {
            type: FloatType
        },
        estimatedTotalFare: {
            type: FloatType
        },
        totalFare: {
            type: FloatType
        },
        totalDuration: {
            type: FloatType
        },
        currency: {
            type: StringType
        },
        riderTotalFare: {
            type: FloatType
        },
        driverTotalFare: {
            type: FloatType
        },
        notes: {
            type: StringType
        },
        vehicleId: {
            type: IntType
        },
        vehicleNumber: {
            type: StringType
        },
        vehicleModel: {
            type: StringType
        },
        vehicleColor: {
            type: StringType
        },
        paymentType: {
            type: IntType
        },
        walletBalance: {
            type: FloatType
        },
        promoCodeId: {
            type: IntType
        },
        isSpecialTrip: {
            type: BooleanType
        },
        specialTripPrice: {
            type: FloatType
        },
        specialTripTotalFare: {
            type: FloatType
        },
        reason: {
            type: StringType
        },
        tollFee: {
            type: FloatType
        },
        scheduleId: {
            type: IntType
        },
        riderPayableFare: {
            type: FloatType
        },
        bookingType: {
            type: IntType
        }
    }
});

const BookingRequestType = new ObjectType({
    name: 'BookingRequestType',
    fields: {
        errorMessage: {type: StringType},
        status: {type: IntType},
        data: {type: BookingResponseType},
        result: {type: BookingResponseType},
        isTryAgain: {
            type: BooleanType,
            resolve(responseData) {
                return responseData.isTryAgain || false;
            }
        }
    },
});

export default BookingRequestType;
