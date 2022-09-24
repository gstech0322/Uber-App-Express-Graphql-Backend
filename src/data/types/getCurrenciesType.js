import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';


import CurrencyType from './CurrenciesType';

const getCurrencyType = new ObjectType({
    name:"AllCurrency",
    fields: {
        results: {
            type: new List(CurrencyType)
        },
        status: {
            type: StringType
        },
        errorMessage: {
            type: StringType
        }
    }
});


export default getCurrencyType;