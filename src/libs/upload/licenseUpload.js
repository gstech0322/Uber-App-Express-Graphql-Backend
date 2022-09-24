import bodyParser from 'body-parser';
import { verifyJWTToken } from '../auth';
import { licenseuploadDir } from '../../config';
import multer from 'multer';
import sharp from 'sharp';
const crypto = require('crypto');

// Models
import {
    User,
    UserProfile
} from '../../data/models';

const licenseUpload = app => {

    var storage = multer.diskStorage({
        destination: licenseuploadDir,
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                if (err) return cb(err);

                let ext;

                switch (file.mimetype) {
                    case 'image/jpeg':
                        ext = '.jpeg';
                        break;
                    case 'image/png':
                        ext = '.png';
                        break;
                    case 'image/jpg':
                        ext = '.jpg';
                        break;
                }

                cb(null, raw.toString('hex') + ext);
            })
        }
    });

    var upload = multer({ storage: storage });
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.post('/uploadLicence', function (req, res, next) {
        next();
    }, upload.array('file'), async (req, res, next) => {
        let files = req.files;
        let type = req.body.type;
        let requestHeader = req.headers;
        let isLoggedInUser;
        let status = 200, errorMessage, fileName, userId;

        try {
            let fileName = files[0].filename;
            
            await sharp(files[0].path)
                .resize(200, null)
                .toFile(licenseuploadDir + 'small_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            await sharp(files[0].path)
                .resize(400, null)
                .toFile(licenseuploadDir + 'medium_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            if (requestHeader && requestHeader.auth) {
                isLoggedInUser = await verifyJWTToken(requestHeader.auth);
            }
            if (requestHeader &&
                ((requestHeader.isAuth === true && isLoggedInUser) || !requestHeader.isAuth)) {

                const userLogin = await User.findOne({
                    attributes: ['email', 'id'],
                    where: { email: isLoggedInUser.email },
                });

                if (userLogin) {
                    userId = userLogin.dataValues.id;
                    fileName = files[0].filename;

                    if (type && type == 'front') {

                        const licenseFrontUpdate = await UserProfile.update({
                            licenceFront: fileName
                        }, {
                                where: {
                                    userId
                                }
                            });
                    } else if (type && type == 'back') {

                        const licenseBackUpdate = await UserProfile.update({
                            licenceBack: fileName
                        }, {
                                where: {
                                    userId
                                }
                            });
                    }
                    status = 200;
                    res.send({ status, errorMessage, files });

                } else {
                    status = 400;
                    errorMessage = 'Sorry user not exist in database!';
                    res.send({ status, errorMessage });
                }
            } else {
                status = 400;
                errorMessage = 'Auth required';
            }
        } catch (error) {
            status = 400;
            errorMessage = 'Something went wrong!, ' + error;
            res.send({ status, errorMessage });
        }
    });

};

export default licenseUpload;
