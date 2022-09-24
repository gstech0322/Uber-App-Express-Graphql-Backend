import {
    GraphQLObjectType as ObjectType, 
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType
} from 'graphql';


const GetAllDriversType = new ObjectType({
    name: 'GetAllDrivers',
    fields: {
        id: {
            type: StringType
        },
        email: {
            type: StringType
        },
        password: {
            type: StringType
        },
        phoneNumber: {
            type: StringType
        },
        phoneDialCode: {
            type: StringType
        },
        lat: {
            type: FloatType
        },
        lng: {
            type: FloatType
        },
        userStatus: {
            type: StringType
        },
        isActive: {
            type: IntType
        },
        isBan: {
            type: IntType
        },
        userType: {
            type: IntType
        },
        overallRating: {
            type: FloatType
        }
    }
});

export default GetAllDriversType;