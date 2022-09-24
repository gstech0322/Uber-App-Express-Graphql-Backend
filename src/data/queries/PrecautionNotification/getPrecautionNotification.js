// Models
import { PrecautionNotification } from "../../models";

//Types
import PrecautionNotificationCommonType from "../../types/PrecautionNotification/PrecautionNotificationCommonType";

const getPrecautionNotification = {

    type: PrecautionNotificationCommonType,

    async resolve({ request, response }) {
        try {
            if (request.user) {

                const result = await PrecautionNotification.findOne({
                    where: { isEnabled: true, id: 1 }
                });

                return await {
                    status: !result ? 400 : 200,
                    errorMessage: !result ? 'No record found' : null,
                    result
                };
            }
            else {
                return {
                    status: 500,
                    errorMessage: 'It looks like you have not logged in with your account. Please login and continue.'
                };
            }
        }
        catch (error) {
            return {
                status: 400,
                errorMessage: "Something went wrong " + error
            };
        }
    }
};

export default getPrecautionNotification;

/*
    query GetPrecautionNotification {
        getPrecautionNotification {
            status
            errorMessage
            result {
                id
                title
                description
                isEnabled
                imageName
            }
        }
    }
*/