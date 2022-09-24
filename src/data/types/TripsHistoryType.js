import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';

import BookingType from './BookingType';

const TripsHistoryDataType = new ObjectType({
    name: 'TripsHistory',
    fields: {
        bookings: {
            type: new List(BookingType)
        },
        count: {
            type: IntType
        }
    }
});

const TripsHistoryType = new ObjectType({
    name: 'TripsHistoryCommon',
    fields: {
        results: {
            type: TripsHistoryDataType
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    },
});

export default TripsHistoryType;
