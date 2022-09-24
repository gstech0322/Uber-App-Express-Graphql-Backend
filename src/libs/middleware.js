import { verifyJWTToken } from './auth';

export function verifyJWT_MW(req, res, next) {
    let token = (req.method === 'POST') ? req.headers.auth : null;

    if (token) {
        verifyJWTToken(token)
            .then((decodedToken) => {
                req.user = decodedToken;
                next()
            })
            .catch((err) => {
                res.send({
                    status: 400,
                    errorMessage: 'Invalid auth token provided.'
                });
            });
    } else {
        next();
    }
}