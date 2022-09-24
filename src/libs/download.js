import fetch from 'node-fetch';
import { auth, websiteUrl } from '../config';

export async function downloadFile(url) {
    const resp = await fetch(websiteUrl + '/uploadRemoteImage', {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  url }),
        credentials: 'include'
    });
    const { filename, status } = await resp.json();
    return {
        filename, 
        status
    };
}