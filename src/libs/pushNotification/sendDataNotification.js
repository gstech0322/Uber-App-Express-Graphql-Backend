var FCM = require('fcm-node');
import { serverKey } from '../../config';

var fcm = new FCM(serverKey);

async function sendDataNotification(requestContent, deviceIds) {
    let message = requestContent;

    message['registration_ids'] = deviceIds; // Assign Android devices ID
    
    if (message.notification) { delete message.notification }; // Delete Notification Object keys
    
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Data Push Notificaton Error!", err);
        } else {
            console.log("Data Push Notification Success", response);
        }
    });

}

export default sendDataNotification;
