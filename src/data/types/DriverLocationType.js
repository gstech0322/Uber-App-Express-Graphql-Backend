import {
    GraphQLObjectType as ObjectType, 
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql'; 

const DriverLocationType = new ObjectType({
    name: 'DriverLocation',
    fields: { 
        id :{
            type: StringType
        },  
        driverLat:{
            type: FloatType
        },
        driverLng:{
            type: FloatType
        }, 
        bookingId:{
            type: IntType
        },
        locationUpdate:{
            type:BooleanType
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    }
});

export default DriverLocationType;