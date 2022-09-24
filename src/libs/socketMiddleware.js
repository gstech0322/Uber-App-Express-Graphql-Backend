import { auth } from '../config';
import jwt from 'jsonwebtoken';

export function socketVerifyJWT_MW(req, res, next) {
    let token =  req.auth ? req.auth : null;
    let result = [];
    if (token) {
        jwt.verify(token, auth.jwt.secret, (err, decoded) => {
            if (err) {
                result.push(400);
            } else {  
                result.push(200);
            }
        });
    } else {  
        result.push(500);
    }

    if(result[0] === 200) {
        return {
            status: 200,
            errorMessage: null
        };
    } else if(result[0] === 400) {
        return {
            status: 500,
            errorMessage: "It looks like something went wrong with your account. Please log in with your account again."
        };
    } else if(result[0] === 500) {
        return {
            status: 500,
            errorMessage: "It looks like you aren\'t logged in with your account. Please log in with your account."
        };
    }

}