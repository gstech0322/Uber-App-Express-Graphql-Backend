import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
    GraphQLFloat as FloatType,
    GraphQLBoolean as BooleanType
} from 'graphql';

const TripResponseType = new ObjectType({
    name: 'TripResponseType',
    fields: {
        id: { type: IntType },
        unitPrice: { type: FloatType },
        minutePrice: { type: FloatType },
        basePrice: { type: FloatType },
        categoryName: { type: StringType },
        riderFeeType: { type: StringType },
        riderFeeValue: { type: FloatType },
        driverFeeType: { type: StringType },
        driverFeeValue: {
            type: FloatType,
        },
        riderServiceFee: {
            type: FloatType,
        },
        driverServiceFee: {
            type: FloatType
        },
        priceForDistance: {
            type: FloatType
        },
        priceForDuration: {
            type: FloatType
        },
        totalFare: {
            type: FloatType
        },
        calculatedPrice: {
            type: FloatType
        },
        currency: {
            type: StringType
        },
        convertCurrency: {
            type: StringType
        },
        totalFareForRider: {
            type: FloatType
        },
        totalFareForDriver: {
            type: FloatType
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
        pricingId: {
            type: IntType
        }
    },
});

const WholeTripResponseType = new ObjectType({
    name: 'WholeTripResponseType',
    fields: {
        result: {
            type: new List(TripResponseType)
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        },
    }
});

export default WholeTripResponseType;