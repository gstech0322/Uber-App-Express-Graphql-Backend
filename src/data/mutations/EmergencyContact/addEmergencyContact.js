import {
    GraphQLString as StringType,
} from 'graphql';

import EmergencyContactListType from '../../types/EmergencyContactListType';
import { EmergencyContact } from '../../models';

const addEmergencyContact = {

    type: EmergencyContactListType,

    args: {
        data: { type: StringType }
    },

    async resolve({ request }, { data }) {

        if (request.user && request.user.id) {

            let userId = request.user.id;

            try {
                let ContactList = JSON.parse(data);

                let count = await EmergencyContact.count({
                    where: {
                      userId
                    }
                });

                var totalCount = (count && count >= 0) ? parseFloat(count+ContactList.length) : parseFloat(ContactList.length);
                
                let UpdateList = [];

                if(totalCount && totalCount < 6) {
                    await Promise.all(ContactList.map(async (items) => {
                        if (items.phoneNumber && items.phoneNumber != '' && items.contactName) {
                            UpdateList.push({ 'userId': userId, 'phoneNumber': items.phoneNumber, "contactName": items.contactName });
                        }
                    }));

                    if (UpdateList && UpdateList.length > 0) {

                        await EmergencyContact.bulkCreate(UpdateList);

                        let result = await EmergencyContact.findAll({
                            where: {
                              userId
                            },
                            limit: 5,
                            raw:true
                          });
                          
                        return {
                            status: 200,
                            result
                        }
                    } else {
                        return {
                            status: 400,
                            errorMessage: 'Oops! something went wrong. Invalid Contact List.'
                        }
                    }
                } else {
                    return {
                        status: 400,
                        errorMessage: 'Oops! something went wrong. Five Contact List Maximum Allowed.'
                    }
                }
            } catch(error) {
                return {
                    status: 400,
                    errorMessage: 'Oops! something went wrong. ' + error
                }
            }
        } else {
            return {
                status: 500,
                errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'

            }
        }
    },
};

export default addEmergencyContact;

/**
mutation addEmergencyContact($data: String!) {
    addEmergencyContact(data: $data) {
        status
        errorMessage
    }
}
{
	"data": "[{\"phoneNumber\":\"1233444\",\"contactName\":\"prbhu\"},{\"phoneNumber\":\"12334445\",\"contactName\":\"prbhu1\"}]"
}
 */
