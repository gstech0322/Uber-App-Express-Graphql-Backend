import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLList as List
} from 'graphql';

import EmergencyContactType from './EmergencyContactType';

const responseContact = new ObjectType({
    name:"responseContact",
    fields: {
        result: {
            type: new List(EmergencyContactType)
        },
        status: {
            type: StringType
        },
        errorMessage: {
            type: StringType
        }
    }
});


export default responseContact;
