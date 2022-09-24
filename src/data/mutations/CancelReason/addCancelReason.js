import { CancelReason } from '../../models';

import CancelReasonType from '../../types/CancelReasonType';

import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType
} from 'graphql';

const addCancelReason = {

    type: CancelReasonType,

    args: {
        userType: { type: new NonNull(IntType) },
        reason: { type: new NonNull(StringType) },
    },

    async resolve({ request }, {
        userType,
        reason
    }) {
                   
        const savenList = await CancelReason.create({
            userType,
            reason
        });

        return await {
            status: 200,
            errorMessage: 'Succefully added reason.'

        };
        
    },
};

export default addCancelReason;

/*
        
mutation($userType: Int!, $reason: String!) {
    addCancelReason(userType: $userType, reason: $reason) {
        status
        errorMessage
    }
}

*/
