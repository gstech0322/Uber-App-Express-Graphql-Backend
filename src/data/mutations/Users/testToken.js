// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
// Config
import { auth, websiteUrl, payment } from '../../../config';


import stripePackage from 'stripe';
const stripe = stripePackage(payment.stripe.secretKey);

// Helpers
import jwt from 'jsonwebtoken';

import UserType from '../../types/UserType';

import { verifyJWTToken, createJWToken } from '../../../libs/auth';
import { downloadFile } from '../../../libs/download';

// Fetch request
import fetch from '../../../libs/fetch';

import { sendEmail } from '../../../libs/sendEmail';

const testToken = {
    type: UserType,

    args: {
        token: { type: StringType }
    },

    async resolve({ request, response }, {
        token
    }) {
        try {

            let cardDetails = {
                name: 'Latha',
                // number: 4111111111111111,
                number: 4242424242424242,
                exp_month: 12,
                exp_year: 2020,
                cvc: 123
              };
              let status = 200, createCard, errorMessage;
              let content = {
                token: 'avc',
                name: 'Laxman',
                email: 'laxman@radicalstart.com'
              };

              if (cardDetails && status === 200) {
                try {
                  createCard = await stripe.tokens.create({
                    card: cardDetails
                  });
  
                } catch (error) {
                  status = 400;
                  errorMessage = error.message;
                }
              }

            return {
                userToken: createCard && createCard.id,
                status: 200
            }

        } catch (error) {
            return {
                errorMessage: 'Something went wrong! ' + error,
                status: 400
            }
        }
    }

};

export default testToken;

/*

mutation (
    $token: String
) {
    testToken (
        token: $token
    ) {
        	userToken
            status
            errorMessage
    }
}

*/