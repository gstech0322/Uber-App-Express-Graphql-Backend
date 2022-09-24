import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType
} from 'graphql';


const CountryType = new ObjectType({
    name: 'Country',
    fields: {
        id: {
            type: IntType
        },
        countryCode: {
            type: StringType
        },
        countryName: {
            type: StringType
        },
        isEnable: {
            type: BooleanType
        },
        status: {
            type: StringType
        },
        dialCode: {
            type: StringType
        },
    }
});

export default CountryType;


// {
//     getAllCountries{
//         id
//         isEnable
//         countryCode
//         countryName
//         dialCode
//     }
// }
  