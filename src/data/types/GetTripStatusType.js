import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';

import BookingType from '../types/BookingType';

const GetTripStatusType = new ObjectType({
    name: 'GetTripStatus',
    fields: {
        result: {
            type: BookingType
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    },
});

export default GetTripStatusType;
