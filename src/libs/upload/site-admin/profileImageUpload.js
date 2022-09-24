import bodyParser from 'body-parser';
import { profilePhotouploadDir } from '../../../config';
import multer from 'multer';
const crypto = require('crypto');
const fs = require('fs')
import sharp from 'sharp'

const profileImageUpload = app => {
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
    })

    var upload = multer({ storage: storage });
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    async function removeFiles(fileName, filePath) {
        if (fs.existsSync(filePath + fileName)) {
            fs.unlink(filePath + fileName, (err) => {
                if (err) console.log(err)
            })
        }
    }

    app.post('/deleteProfileImage', function (req, res, next) {
        next()
    }, async (req, res, next) => {
        const fileName = req.body.fileName;
        const filePath = profilePhotouploadDir;

        // await removeFiles(fileName, filePath)
        res.send({
            status: 200
        })
    })

    app.post('/uploadProfileImage', function (req, res, next) {
        next();
    }, upload.any('file'), async (req, res, next) => {
        let files = req.files;
        let type = req.body.type;
        let status = 200, errorMessage, fileName;
        console.log(files)

        try {
            fileName = files[0].filename;
            status = 200;

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

            res.send({ status, errorMessage, fileName })
        } catch (error) {
            status = 400;
            errorMessage = 'Somthing went wrong' + error;
            console.log("errorsss", error)
            res.send({ status, errorMessage })
        }
    }
    )
}

export default profileImageUpload;