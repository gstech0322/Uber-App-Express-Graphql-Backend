import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType
} from 'graphql';

import UserAccountType from './userAccountType';

const VerifyPhoneNumberType = new ObjectType({
    name: 'VerifyPhoneNumber',
    fields: {
        result: {
            type: UserAccountType
        },
        status: { type: IntType },
        errorMessage: { type: StringType }
    },
});

export default VerifyPhoneNumberType;
