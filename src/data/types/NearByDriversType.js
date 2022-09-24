import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';
 
import UserType from './UserType';

const NearByDriversType = new ObjectType({
    name: 'NearByDrivers',
    fields: {
        id: {
            type: IntType
        }, 
        location: {
            type: new List(UserType)
        },
        errorMessage: {
            type: StringType
        }
    },
});

export default NearByDriversType;
