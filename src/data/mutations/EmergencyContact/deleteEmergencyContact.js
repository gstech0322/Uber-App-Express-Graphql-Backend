import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

import EmergencyContactType from '../../types/EmergencyContactType';
import { EmergencyContact } from '../../models';

const deleteEmergencyContact = {

    type: EmergencyContactType,

    args: {
        contactId: { type: new NonNull(IntType) }
    },

    async resolve({ request }, { contactId }) {

        if (request.user && request.user.id && contactId) {

            let userId = request.user.id;
            
            const deleteContact = await EmergencyContact.destroy({
                where: {
                    id: contactId,
                    userId
                }
            });

            return await {
                status: 200,
                errorMessage: 'Success'

            }

        } else {
            return await {
                status: 500,
                errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'

            }
        }
    },
};

export default deleteEmergencyContact;

/**
mutation deleteEmergencyContact($contactId: Int!) {
    deleteEmergencyContact(contactId: $contactId) {
        status
        errorMessage
    }
}
 */
