import PayoutType from '../../types/PayoutType';
import { Payout } from '../../models';


import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';


const setDefaultPayout = {

    type: PayoutType,

    args: {
        id: { type: new NonNull(IntType) },
        type: { type: new NonNull(StringType) },
    },

    async resolve({ request }, {
        id,
        type
    }) {

        try {

            if (request.user) {
                let userId = request.user.id;


                if (type == 'set') {

                    let changeEverything = await Payout.update({
                        default: false
                    },
                        {
                            where: {
                                userId
                            }
                        });

                    let payoutupdated = await Payout.update({
                        default: true
                    },
                        {
                            where: {
                                id,
                                userId
                            }
                        });
                    if (payoutupdated) {
                        return {
                            status: 200
                        }
                    }

                } else if (type == "remove") {
                    let payoutRemoved = await Payout.destroy({
                        where: {
                            id,
                            userId
                        }
                    });

                    if (payoutRemoved) {
                        return {
                            status: 200
                        }
                    }

                } else {
                    return {
                        status: 400,
                        errorMessage: 'Please send currect type name.',
                    };
                }

            } else {
                return {
                    status: 500,
                    errorMessage: 'You haven\'t authorized for this action.',
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Something went wrong.' + error.message

            }
        }
    },
};

export default setDefaultPayout;

/**
mutation setDefaultPayout($id: Int!, $type: String!) {
    setDefaultPayout(id: $id, type: $type) {
        status
    }
}
 */
