import bodyParser from 'body-parser';
import { contentPageUploadDir } from '../../../config';
import multer from 'multer';
const crypto = require('crypto');
const fs = require('fs');
import sharp from 'sharp';

const contentPageBannerUpload = app => {
    let storage = multer.diskStorage({
        destination: contentPageUploadDir,
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (error, raw) { console.log('error  '+error)
                if (error) return cb(error);
                
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
    console.log(upload);
    async function removeFiles(fileName, filePath) {
        if (fs.existsSync(filePath + fileName)) {
            fs.unlink(filePath + fileName, (error) => {
                if(error) console.log(error);
            })
        }
    }
    
    app.post('/deleteContentPageBannerImage', function (req, res, next) {
        next()
    }, async (req, res, next) => {
        const fileName = req.body.fileName;
        const filePath = categoryUploadDir;

        await removeFiles(fileName, filePath)
        res.send({
            status: 200
        })
    })

    app.post('/uploadContentPageBannerImage', function (req, res, next) {
        next()
    },upload.array('file'), async (req, res, next) => {
        let files = req.files;
        let type = req.body.type;
        let status = 200, errorMessage, fileName;
        console.log('files',files);
        try {
            fileName = files[0].filename;
            status = 200;

            await sharp(files[0].path)
                .resize(1000, null, { fit: 'fill'})
                .toFile(contentPageUploadDir + 'medium_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            await sharp(files[0].path)
                .resize(1400, null, { fit: 'fill'})
                .toFile(contentPageUploadDir + 'large_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))
               
            res.send({status, errorMessage, fileName});
        } catch (error) {
            status = 400;
            errorMessage = 'Something went wrong' + error;
            res.send({ status, errorMessage })
        }
    })
}

export default contentPageBannerUpload;