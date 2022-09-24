import bodyParser from 'body-parser';
import { logoUploadDir } from '../../../config';
import multer from 'multer';
const crypto = require('crypto');
const fs = require('fs')
import sharp from 'sharp'

const logoUpload = app => {
    var storage = multer.diskStorage({
        destination: logoUploadDir,
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {console.log('errerr',err)
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
    
    app.post('/deleteLogoImage', function (req, res, next) {
        next()
    }, async (req, res, next) => {
        const fileName = req.body.fileName;
        const filePath = categoryUploadDir;

        await removeFiles(fileName, filePath)
        res.send({
            status: 200
        })
    })

    app.post('/uploadLogoImage', function (req, res, next) {
        next();
    }, upload.array('file'), async (req, res, next) => {
        let files = req.files;
        let type = req.body.type;
        let status = 200, errorMessage, fileName;
        console.log('files',files);
        try {
            fileName = files[0].filename;
            status = 200;

            await sharp(files[0].path)
                .resize(50, null)
                .toFile(logoUploadDir + 'small_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            await sharp(files[0].path)
                .resize(100, null)
                .toFile(logoUploadDir + 'medium_' + fileName)
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

export default logoUpload;