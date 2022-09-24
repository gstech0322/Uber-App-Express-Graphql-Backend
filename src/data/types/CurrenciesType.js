import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType
} from 'graphql'; 

const CurrenciesType = new ObjectType({
    name : "Currencies",
    fields: {
        id: {
            type: IntType
        },
        symbol: {
            type: StringType
        },
        isEnable: {
            type: BooleanType
        },
        isBaseCurrency: {
            type: BooleanType
        },
        isPayment: {
            type: BooleanType
        }
    }
});

export default CurrenciesType;