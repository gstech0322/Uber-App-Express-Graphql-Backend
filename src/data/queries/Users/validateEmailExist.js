// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

// Models
import { User, AdminUser } from '../../models';

// Types
import CommonType from '../../types/CommonType';

const validateEmailExist = {
    
    type: CommonType,

    args: {
        email: {
            type: new NonNull(StringType)
        }
    },

    async resolve({ request, response }, {
        email
    }) {

        const checkUser = await User.findOne({
            attributes: ['id', 'email'],
            where: { 
                email,
                deletedAt: null
            },
            order: [
                [`createdAt`, `DESC`],
            ],
        });

        try {
            if (checkUser) {
                return {
                    errorMessage: 'User already exists',
                    status: 400
                };
            } else {
                const getAdminUserId = await AdminUser.findOne({
                    where: { 
                        email 
                    },
                });
        
                if(getAdminUserId) {
                  return {
                    errorMessage: 'User already exists',
                    status: 400
                  };
                } else {
                    return {
                        status: 200
                    };
                }
            }
        } catch(error) {
            return {
                errorMessage: 'Something went wrong',
                status: 400
            }
        }
    }

};

export default validateEmailExist;

/*

query ($email: String!) {
    validateEmailExist (email: $email) {
        status
    }
}

*/
