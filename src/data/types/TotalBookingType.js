import {
    GraphQLObjectType as ObjectType, 
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql'; 

const totalEarningType = new ObjectType({
    name: 'totalEarningType',
    fields: { 
        totalBookings: {
            type: IntType
        }, 
        totalIncome: {
            type: FloatType
        }
    }
});

const TotalBookingType = new ObjectType({
    name: 'TotalBooking',
    fields: { 
        results: {
            type: totalEarningType
        }, 
        status: {
            type: IntType
        },  
        errorMessage: {
            type: StringType
        }
    }
});

export default TotalBookingType;