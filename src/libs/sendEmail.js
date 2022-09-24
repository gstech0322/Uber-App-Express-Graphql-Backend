import jwt from 'jsonwebtoken';
import { auth, websiteUrl } from '../config';
// Fetch request
import fetch from 'node-fetch';

export async function sendEmail(to, type, mailContents, isLoggedIn, authToken, ) {
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    if (isLoggedIn) {
        headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            auth: authToken
        };
    }

    // Validation IsLoggedIn
    if (isLoggedIn && !authToken) {
        return {
            status: 400,
            errorMessge: 'Authentication Token Error!'
        }
    }

    const resp = await fetch(websiteUrl + '/sendEmailTemplate', {
        method: 'post',
        headers,
        body: JSON.stringify({
            to,
            type,
            content: mailContents
        })
    });

    const { status, errorMessge } = resp.json;

    return await {
        status,
        errorMessge
    };
}

export default {
    sendEmail
}
