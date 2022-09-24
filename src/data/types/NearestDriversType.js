import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';
 
import NearByDriversType from './NearByDriversType';

const NearestDriversType = new ObjectType({
    name: 'NearestDrivers',
    fields: {
        result: {
            type: new List(NearByDriversType)
        }, 
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    },
});

export default NearestDriversType;
