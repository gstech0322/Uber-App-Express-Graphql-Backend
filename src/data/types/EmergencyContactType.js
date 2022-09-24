import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLList as List
} from 'graphql';

const EmergencyContactType = new ObjectType({
    name: 'ContactType',
    fields: {
        id: { type: IntType },
        userId: { type: new NonNull(StringType) },
        phoneNumber: { type: new NonNull(StringType) },
        contactName: { type: new NonNull(StringType) },
        status: {
            type: StringType
        },
        errorMessage: {
            type: StringType
        }
    },
});

export default EmergencyContactType;
