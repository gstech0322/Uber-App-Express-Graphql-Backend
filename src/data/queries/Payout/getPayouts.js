import PayoutWholeType from '../../types/PayoutWholeType';
import { Payout, User } from '../../models';

const getPayouts = {

    type: PayoutWholeType,

    async resolve({ request }) {
        try {
            if (request.user && !request.user.admin) {
                const userId = request.user.id;
                const userEmail = await User.findOne({
                    attributes: [
                        'email',
                        'isBan'
                    ],
                    where: {
                        id: userId
                    },
                    order: [
                        [`createdAt`, `DESC`],
                    ],
                });
                
                if (userEmail && !userEmail.isBan) {
                    let payoutDetails = await Payout.findAll({
                        where: {
                            userId
                        }
                    });                    
                    return {
                        results: payoutDetails,
                        status: 200
                    }
                } else {
                    return {
                        status: 500,
                        errorMessage: 'Something went wrong. Please contact support.'
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'You must login to get your profile information.'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong' + error,
                status: 400
            };
        }
    }
};

export default getPayouts;

/**

query getPayouts {
  getPayouts {
    id
    methodId
    userId
    payEmail
    address1
    address2
    city
    state
    country
    zipcode
    currency
    createdAt
    status
  }
}

**/