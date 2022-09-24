import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
    GraphQLFloat as FloatType
} from 'graphql';


const AllRatesType = new ObjectType({
    name: 'AllRatesType',
    fields: {
        currencyCode: { 
            type: StringType 
        },
        rate: { 
            type: FloatType 
        },
        base: { type: StringType },
        rates: { type: StringType },
    },
});

export default AllRatesType;