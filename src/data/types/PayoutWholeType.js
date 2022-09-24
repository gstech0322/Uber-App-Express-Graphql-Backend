import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
    GraphQLList as List,
} from 'graphql';

import PayoutType from './PayoutType';

const PayoutWholeType = new ObjectType({
    name: 'PayoutWholeType',
    fields: {
        results: { 
            type: new List(PayoutType),
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        },
    }
});

export default PayoutWholeType;
