import {
    GraphQLObjectType as ObjectType,
    GraphQLInt as IntType,
    GraphQLString as StringType
} from 'graphql';

import scheduleType from "./ScheduleBookingType";

const scheduleBookingCommonType = new ObjectType({

    name: 'scheduleBookingCommonType',

    fields: {
        status: { type: IntType },
        errorMessage: { type: StringType }
    }

});

export default scheduleBookingCommonType;