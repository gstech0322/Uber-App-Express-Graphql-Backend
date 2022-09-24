// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

// Models
import { ForgotPassword } from '../../models';

// Types
import CommonType from '../../types/CommonType';

const verifyForgotPassword = {
    type: CommonType,

    args: {
        email: { type: new NonNull(StringType) },
        token: { type: new NonNull(StringType) },
    },

    async resolve({ request, response }, { email, token }) {
        try {
            if (request.user) {
                return {
                    status: 400,
                    errorMessage: 'Currently, you are logging in. Please logout and try again.',
                };
            } else {
                const getForgotPassword = await ForgotPassword.findOne({
                    attributes: ['id'],
                    where: { 
                        email,
                        token  
                    }
                });
                
                if (getForgotPassword) {
                    return {
                        status: 200
                    };    
                } else {
                    return {
                        status: 400,
                        errorMessage: 'Sorry, You have provided invalid/expired reset password token.'
                    };
                }
            }    
        } catch(error) {
            return {
                errorMessage: 'Something went wrong' + error,
                status: 400
            };
        }
    }

};

export default verifyForgotPassword;

/*

query ($email: String!, $token: String!) {
    verifyForgotPassword (email: $email, token: $token) {
        status
        errorMessage
    }
}

*/