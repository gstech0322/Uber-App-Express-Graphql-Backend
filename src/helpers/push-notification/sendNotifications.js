import fetch from 'node-fetch';
import { url } from '../../config';

// Push Notification Title & Message helper
import { pushNotificationMessage } from './pushNotificationMessage';

export async function sendNotifications(type, requestContent, userId, lang) {

    const { title, message } = await pushNotificationMessage(type, requestContent, lang);

    let content = requestContent;
    content['title'] = title;
    content['message'] = message;
    content['notificationType'] = type;

    const resp = await fetch(url + '/push-notification', {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content,
            userId
        }),
        credentials: 'include'
    });
    
    const { status, errorMessge } = await resp.json();
    return await {
        status,
        errorMessge
    };
}

export default {
    sendNotifications
}
