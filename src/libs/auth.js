import jwt from 'jsonwebtoken';
import { auth } from '../config';
import _ from 'lodash';

export async function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, auth.jwt.secret, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err)
            }

            resolve(decodedToken)
        })
    })
}

export async function createJWToken(id, email, phoneNumber) {
    let expiresIn = 15552000; // 180 Days (60 x 60 x 24 x 180)

    let token = jwt.sign({
        id,
        email,
        phoneNumber
    }, auth.jwt.secret, {
            expiresIn,
            algorithm: 'HS256'
        })

    return token;
}

export default {
    verifyJWTToken,
    createJWToken
}
