import {
    GraphQLInt as IntType
  } from 'graphql';
import { CancelReason } from '../../models';

import CancelReasonListType from '../../types/CancelReasonListType';

const getCancelReason = {

    type: CancelReasonListType,

    args: {
        userType: { type: IntType }
    },

    async resolve({ request },{ userType }) {
        
        let result = await CancelReason.findAll({
            where: {
                $and: [
                    { userType }
                ]
            },
            raw: true,
        });

        return await {
            status: 200,
            result
        };
    },
};

export default getCancelReason;

/*
        
query {
    getCancelReason {
        status
        errorMessage
        result {
          id
          reason
          reasonto
        }
    }
}

*/
