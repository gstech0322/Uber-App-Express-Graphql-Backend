
// const apn = require('apn'); // Apple Push Notification
import path from 'path';

async function sendVoipNotification(requestContent, deviceIds) {
    /*const apnKeyPath = path.join(__dirname, '../../../certificates/apn');
    const options = {
        cert: `${apnKeyPath}/cert.pem`, // APN certificate
        key: `${apnKeyPath}/key.pem` // APN key
    };
    let apnProvider = new apn.Provider(options); // Creating an APN provider
    let notification = new apn.Notification(); // Creating an APN Notification instance 
    notification['payload'] = requestContent; // Assign the data to the APN notification payload
    apnProvider.send(notification, deviceIds).then((result) => { // Sending APN notification
        if (result.sent && result.sent.length > 0) {
            console.log('APN SUCCESS: ', result.sent);
        }

        if (result.failed && result.failed.length > 0) {
            console.log('APN ERROR: ', result.failed);
        }
    });

    apnProvider.shutdown(); // Shutting down the APN provider*/
}

export default sendVoipNotification;