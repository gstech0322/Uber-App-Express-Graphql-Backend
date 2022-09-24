import GetPayoutType from '../../types/GetPayoutType';
import { Payout, User } from '../../models';
import stripePackage from 'stripe';
import { payment, url } from '../../../config';

import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

const stripe = stripePackage(payment.stripe.secretKey, {
    apiVersion: '2019-12-03'
});


const addPayout = {

    type: GetPayoutType,

    args: {
        methodId: { type: IntType },
        payEmail: { type: StringType },
        address1: { type: StringType },
        address2: { type: StringType },
        city: { type: StringType },
        state: { type: StringType },
        country: { type: StringType },
        zipcode: { type: StringType },
        currency: { type: StringType },
        firstname: { type: StringType },
        lastname: { type: StringType },
        accountNumber: { type: StringType },
        routingNumber: { type: StringType },
        businessType: { type: StringType }
    },

    async resolve({ request }, {
        methodId,
        payEmail,
        address1,
        address2,
        city,
        state,
        country,
        zipcode,
        currency,
        firstname,
        lastname,
        accountNumber,
        routingNumber,
        businessType,
    }) {

        try {
            let userId = request.user.id;
            let defaultvalue = false;
            let status = 200, errorMessage, createPayout, connectUrl, stripeAccountId;
            let business_type = null;
            let requested_capabilities = ['card_payments', 'transfers'];

            if (request.user) {

                let where = {
                    id: userId,
                    isBan: 1
                };

                const isUserBan = await User.findOne({ attributes: ['id'], where, raw: true });

                if (!isUserBan) {
                    if (methodId == 1) {
                        //Pay Pal
                        let count = await Payout.count({
                            where: {
                                userId,
                                default: true
                            }
                        });
    
                        if (count <= 0) {
                            defaultvalue = true;
                        }
    
                        const payout = await Payout.create({
                            methodId,
                            userId,
                            payEmail,
                            address1,
                            address2,
                            city,
                            state,
                            country,
                            zipcode,
                            currency,
                            default: defaultvalue,
                            last4Digits: null,
                            isVerified: true,
                            firstName: firstname,
                            lastName: lastname
                        });
    
                        if (payout) {
                            return {
                                status
                            }
                        } else {
                            status = 400
    
                            return {
                                status
                            }
                        }
    
                    } else if (methodId == 2) {                
                        
                        try {
    
                            business_type = businessType ? businessType : 'individual';
                            
                            if (business_type === 'individual') {
                                createPayout = await stripe.accounts.create({
                                    type: "custom",
                                    business_type, // individual
                                    individual: {
                                        email: payEmail,   
                                        first_name: firstname,
                                        last_name: lastname, 
                                        address: {
                                            line1: address1,
                                            city: city,
                                            state: state,
                                            country: country,
                                            postal_code: zipcode
                                        }
                                    },
                                    country: country,
                                    email: payEmail,
                                    requested_capabilities,
                                    external_account: {
                                        object: "bank_account",
                                        country: country,
                                        currency: currency,
                                        routing_number: routingNumber,
                                        account_number: accountNumber,
                                    }
                                });
                                
                                stripeAccountId = createPayout.id;
                                
                            } else if (business_type === 'company') {
    
                                createPayout = await stripe.accounts.create({
                                    type: "custom",
                                    business_type, // company
                                    company: {
                                        name: firstname,
                                        address: {
                                            line1: address1,
                                            city: city,
                                            state: state,
                                            country: country,
                                            postal_code: zipcode
                                        }
                                    },
                                    country,
                                    email: payEmail,
                                    requested_capabilities,
                                    external_account: {
                                        object: "bank_account",
                                        country: country,
                                        currency: currency,
                                        routing_number: routingNumber,
                                        account_number: accountNumber,
                                    }
                                });
            
                                stripeAccountId = createPayout.id;
            
                                // Because this is a business (and not an individual), we'll need to specify
                                // the account opener by email address using the Persons API.
                                const accountOpener = await stripe.account.createPerson(stripeAccountId, {
                                    email: payEmail,
                                    relationship: {
                                        representative: true
                                    }
                                });
                            }
    
                            let successUrl = url + '/user/payout/success?account='  + stripeAccountId;
                            let failureUrl = url + '/user/payout/failure?account='  + stripeAccountId;
    
                            const accountLinks = await stripe.accountLinks.create({
                                account: stripeAccountId,
                                failure_url: failureUrl,
                                success_url: successUrl,
                                type: 'custom_account_verification',
                                collect: 'currently_due', // currently_due or eventually_due
                            });
            
                            connectUrl = accountLinks.url; // Account links API on-boarding URL
                               
                            return await {
                                status,
                                errorMessage,
                                connectUrl,
                                successUrl,
                                failureUrl,
                                stripeAccountId
                            }
                            
                        } catch (error) {
                            status = 400;
                            errorMessage = error.message;
                            
                            return {
                                status,
                                errorMessage
                            }
                        }
                    
                    } else {
                        status = 400
                        errorMessage = 'Payment method not selected'

                        return {
                            status,
                            errorMessage
                        }
                    }
                } else {
                    status = 400
                    errorMessage = 'User Banned'

                    return {
                        status,
                        errorMessage
                    }
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

export default addPayout;

