import bodyParser from 'body-parser';
import { verifyJWTToken } from '../auth';
import { profilePhotouploadDir } from '../../config';
import multer from 'multer';
const crypto = require('crypto');
import sharp from 'sharp'

// Models
import {
    User,
    UserProfile
} from '../../data/models';

const profilePhotoUpload = app => {

    var storage = multer.diskStorage({
        destination: profilePhotouploadDir,
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

    app.post('/uploadProfilePhoto', function (req, res, next) {
        next();
    }, upload.array('file'), async (req, res, next) => {
        let files = req.files;
        let requestHeader = req.headers;
        let isLoggedInUser;
        let status = 200, errorMessage;
        try {
            let fileName = files[0].filename;

            await sharp(files[0].path)
                .resize(100, 100)
                .toFile(profilePhotouploadDir + 'small_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            await sharp(files[0].path)
                .resize(200, 200)
                .toFile(profilePhotouploadDir + 'medium_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            if (requestHeader && requestHeader.auth) {
                isLoggedInUser = await verifyJWTToken(requestHeader.auth);
            }

            if (requestHeader && ((requestHeader.isAuth === true && isLoggedInUser) || !requestHeader.isAuth)) {

                const userLogin = await User.findOne({
                    attributes: ['email', 'id'],
                    where: { email: isLoggedInUser.email },
                });

                if (userLogin) {
                    const userProfilePicture = await UserProfile.update({
                        picture: files[0].filename,
                    }, {
                        where: {
                            userId: userLogin.id
                        }
                    });

                    res.send({ status, files });
                } else {
                    status = 400;
                    errorMessage = 'Sorry user not exist in database!';
                    res.send({ status, errorMessage });
                }
            } else {
                status = 400;
                errorMessage = 'Please provide auth token';
            }
        } catch (error) {
            status = 400;
            errorMessage = 'Something went wrong!, ' + error;
            res.send({ status, errorMessage });
        }
    });

};

export default profilePhotoUpload;
