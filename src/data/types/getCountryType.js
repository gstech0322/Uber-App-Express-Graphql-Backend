import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';

import CountryType from '../types/CountryType';

const CountryData = new ObjectType({
    name: 'AllCountry',
    fields: {
        results: {
            type: new List(CountryType)
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    },
});

export default CountryData;
