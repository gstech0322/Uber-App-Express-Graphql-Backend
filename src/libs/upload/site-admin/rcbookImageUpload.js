import bodyParser from 'body-parser';
import { vehicleUploadDir } from '../../../config';
import multer from 'multer';
const crypto = require('crypto');
const fs = require('fs')
import sharp from 'sharp'

const rcbookImageUpload = app => {
    var storage = multer.diskStorage({
        destination: vehicleUploadDir,
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
            //console.log(filePath + fileName)
            fs.unlink(filePath + fileName, (err) => {
                if (err) console.log(err)
            })
        }
    }
    
    app.post('/deleteRcbookImage', function (req, res, next) {
        next()
    }, async (req, res, next) => {
        const fileName = req.body.fileName;
        const filePath = vehicleUploadDir;

        await removeFiles(fileName, filePath)
        res.send({
            status: 200
        })
    })

    app.post('/uploadRcbookImage', function (req, res, next) {
        next();
    }, upload.any('file'), async (req, res, next) => {
        let files = req.files;
        let type = req.body.type;
        let status = 200, errorMessage, fileName;
        
        try {
            fileName = files[0].filename;
            status = 200;

            await sharp(files[0].path)
                .resize(200, null)
                .toFile(vehicleUploadDir + 'small-' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            await sharp(files[0].path)
                .resize(400, null)
                .toFile(vehicleUploadDir + 'medium_' + fileName)
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

export default rcbookImageUpload;