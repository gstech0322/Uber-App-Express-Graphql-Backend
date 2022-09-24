import bodyParser from 'body-parser';
import multer from 'multer';
import { licenseuploadDir } from '../../../config';
const crypto = require('crypto');
const fs = require('fs');
import sharp from 'sharp'

const licenceImageUpload = app => {
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
    
    app.post('/deleteLicenceImage', function (req, res, next) {
        next()
    }, async (req, res, next) => {
        const fileName = req.body.fileName
        const filePath = licenseuploadDir
        
        await removeFiles(fileName, filePath)
        res.send({
            status: 200
        })
    })

    app.post('/uploadLicenceImage', function (req, res, next) {
        next();
    }, upload.any(), async (req, res, next) => {
        let files = req.files;
        console.log(files)
        let status = 200, errorMessage;
        let fileName = files[0].filename;

        try {
            status = 200;

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


            res.send({ status, errorMessage, fileName })
        } catch (error) {
            status = 400;
            errorMessage = 'Somthing went wrong' + error;
            res.send({ status, errorMessage })
        }
    }
    )
}

export default licenceImageUpload;