import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull
} from 'graphql';

import EmergencyContactType from '../../types/EmergencyContactType';
import { EmergencyContact, UserProfile } from '../../models';

import { sms } from '../../../config';
import twilio from 'twilio';
import each from 'sync-each';

const client = new twilio(sms.twilio.accountSid, sms.twilio.authToken);

const shareLiveLocations = {

    type: EmergencyContactType,

    args: {
        driverName: { type: new NonNull(StringType) },
        vecihleNumber: { type: new NonNull(StringType) },
        currentLocation: { type: new NonNull(StringType) },
    },

    async resolve({ request }, { driverName, vecihleNumber, currentLocation }) {
        let status = 200, errorMessage;
        if (request.user && request.user.id) {

            let userId = request.user.id;

            let contactList = await EmergencyContact.findAll({
                attributes: ['phoneNumber'],
                where: {
                    userId
                },
                limit: 5,
                raw: true
            });

            let riderData = await UserProfile.findOne({
                attributes: ['firstName', 'lastName'],
                where: {
                    userId
                },
                raw: true
            });

            let firstName = (riderData && riderData.firstName) ? riderData.firstName : '';
            let lastName = (riderData && riderData.lastName) ? riderData.lastName : '';
            let riderName = firstName + " " + lastName;
            let message = riderName + "  with " + driverName + " in " + vecihleNumber + " and my location is " + currentLocation;
            
            if (contactList && contactList.length > 0) {
                each(contactList, function (items, next) {
                    try {
                        client.messages.create({
                            body: message,
                            from: sms.twilio.phoneNumber,
                            to: items.phoneNumber
                        }, function (err, response) {
                            next()
                        });
                    } catch (error) {
                        next()
                    }
                }, function (err, transformedItems) {
                    status = 200;
                });
            } else {
                status = 400;
                errorMessage = 'Oops! something went wrong. Contact List is empty.';

            }
        } else {
            status = 500;
            errorMessage = 'Oops! it looks like you are not logged-in with your account. Please login to continue.';
        }

        return await {
            status,
            errorMessage
        }
    },
};

export default shareLiveLocations;

/**
mutation shareLiveLocations($driverName: String, $vecihleNumber: String,$currentLocation: String) {
    shareLiveLocations(driverName: $driverName, vecihleNumber: $vecihleNumber, currentLocation:$currentLocation) {
        status
        errorMessage
    }
}
 */
