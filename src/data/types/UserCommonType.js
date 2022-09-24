import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType
} from 'graphql';

import UserType from './UserType';

const UserCommonType = new ObjectType({
    name: 'UserCommon',
    fields: {
        result: {
            type: UserType
        },
        status: { type: IntType },
        errorMessage: { type: StringType }
    },
});

export default UserCommonType;
