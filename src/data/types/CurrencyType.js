import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

import AllRatesType from './AllRatesType';

const CurrencyType = new ObjectType({
    name: 'Currency',
    fields: {
        base: { type: StringType },
        date: { type: StringType },
        rates: { type: StringType },
        status: { type: IntType },
        errorMessage: {
            type: StringType
        },
        result: {
            type: AllRatesType
        },
    },
});

export default CurrencyType;
