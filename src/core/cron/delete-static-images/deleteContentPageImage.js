var CronJob = require('cron').CronJob;
import fs from 'fs';
import { promisify } from 'util';

import { contentPageUploadDir } from '../../../config';
import { TempImages, ContentPageDetails } from '../../../data/models';

const readFileAsync = promisify(fs.readdir);
const deleteFileAsync = promisify(fs.unlink);

const deleteContentPageImage = app => {

    new CronJob('0 0 */6 * * *', async function () {
        try {
            const files = await readFileAsync(contentPageUploadDir);

            const promise = files.map(async (file) => {

                if (!file.includes('small') && !file.includes('medium') && !file.includes('large')) {
                    const existOnContentPage = await ContentPageDetails.findOne({
                        where: {
                            pageBanner: file
                        },
                        raw: true
                    });

                    const existOnTemp = await TempImages.findOne({
                        where: {
                            fileName: file,
                            createdAt: {
                                $lt: new Date(new Date() - 1 * 60 * 60 * 1000)
                            }

                        },
                        raw: true
                    });



                    if (!existOnTemp && !existOnContentPage) {
                        if (fs.existsSync(contentPageUploadDir + file)) {
                            await deleteFileAsync(contentPageUploadDir + file);
                        };

                        if (fs.existsSync(contentPageUploadDir + 'small_' + file)) {
                            await deleteFileAsync(contentPageUploadDir + 'small_' + file);
                        };

                        if (fs.existsSync(contentPageUploadDir + 'medium_' + file)) {
                            await deleteFileAsync(contentPageUploadDir + 'medium_' + file);
                        };

                        if (fs.existsSync(contentPageUploadDir + 'large_' + file)) {
                            await deleteFileAsync(contentPageUploadDir + 'large_' + file);
                        };

                        // console.log('Images deleted.');
                    } else {
                        // console.log("Image is being used.");
                    };

                } else {
                    console.log('Not required');
                };

            });

            const resolve = await Promise.all(promise);

        } catch (err) {
            console.log(err);
        };
    })
};


export default deleteContentPageImage;