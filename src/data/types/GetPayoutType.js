import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';

import PayoutType from '../types/PayoutType';

const GetPayoutType = new ObjectType({
    name: 'GetPayoutType',
    fields: {
        results: {
            type: new List(PayoutType)
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        },
        connectUrl: {
            type: StringType
        },
        successUrl: {
            type: StringType
        },
        failureUrl: {
            type: StringType
        },
        stripeAccountId: {
            type: StringType
        }
    },
});

export default GetPayoutType;