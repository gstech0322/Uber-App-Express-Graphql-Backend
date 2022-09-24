var FCM = require('fcm-node');
import { serverKey } from '../../config';
import { UserLogin } from '../../data/models';

var fcm = new FCM(serverKey);

const pushNotificationRoutes = app => {

    app.post('/push-notification', async function (req, res) {
        try {
            let userId = req.body.userId;
            let content = req.body.content;
            let notificationId = Math.floor(100000 + Math.random() * 900000);
            let deviceIds = [], notificationType;
            let status = 200, requestTime = new Date().getTime();
            content['notificationId'] = notificationId;
            content['content_available'] = true;
            content['click_action'] = 'FLUTTER_NOTIFICATION_CLICK';
            content['requestTime'] = requestTime;
            notificationType = content['notificationType'];

            if (content['notificationType']) { delete content.notificationType; }

            const getdeviceIds = await UserLogin.findAll({
                attributes: ['deviceId', 'deviceType'],
                where: {
                    userId
                },
                raw: true
            });

            deviceIds = getdeviceIds.map((o) => o.deviceId);

            let firbaseNotification  = {
                notification: {
                    title: content.title,
                    body: content.message,
                    content_available: true,
                    priority: 'high',
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    requestTime
                },
                data: {
                    content,
                    action_loc_key: null
                }
            };

            var message = {
                notification: firbaseNotification.notification,
                data: firbaseNotification.data
            };

            firbaseNotification['registration_ids'] = deviceIds; // Device IDS
            
            fcm.send(firbaseNotification, function (err, response) {
                if (err) {
                    status = 400;
                    console.log("Something has gone wrong!", err);
                } else {
                    console.log("Successfully sent with response: ", response);
                }

                res.send({ status, errorMessge: err });
            });
        } catch(error) {
            console.log('error', error)
            res.send({ status: 400, errorMessge: error });
        }
    });
};

export default pushNotificationRoutes;
