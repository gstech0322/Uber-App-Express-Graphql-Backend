// import fetch from '../fetch';
import { url } from '../../config';
import fetch from 'node-fetch';

export async function processSms(phoneDialCode, phoneNumber) {

    let variables = {
        dialCode: phoneDialCode,
        phoneNumber,
    };

    const resp = await fetch(url + '/send-verification-code', {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(variables),
        credentials: 'include'
    });

    const { status, errorMessage, verificationCode } = await resp.json();

    return {
        status,
        errorMessage,
        verificationCode
    }
}