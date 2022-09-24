import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List
} from 'graphql';

import PrecautionNotificationType from './PrecautionNotificationType';

const PrecautionNotificationCommonType = new ObjectType({
    name: 'PrecautionNotificationCommonType',
    fields: {
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        },
        results: {
            type: new List(PrecautionNotificationType)
        },
        result: {
            type: PrecautionNotificationType
        },
        count: {
            type: IntType
        }
    }
});

export default PrecautionNotificationCommonType;