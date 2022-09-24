var CronJob = require('cron').CronJob;
import fs from 'fs';
import { promisify } from 'util';

import { homepageUploadDir } from '../../../config';
import { TempImages, HomePage } from '../../../data/models';

const readFileAsync = promisify(fs.readdir);
const deleteFileAsync = promisify(fs.unlink);

const deleteHomepageImage = app => {

    new CronJob('0 0 */6 * * *', async function () {
        try {
            const files = await readFileAsync(homepageUploadDir);

            const promise = files.map(async (file) => {

                if (!file.includes('small') && !file.includes('medium') && !file.includes('large')) {
                    const existOnHomepage = await HomePage.findOne({
                        where: {
                            value: file
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



                    if (!existOnTemp && !existOnHomepage) {
                        if (fs.existsSync(homepageUploadDir + file)) {
                            await deleteFileAsync(homepageUploadDir + file);
                        };

                        if (fs.existsSync(homepageUploadDir + 'small_' + file)) {
                            await deleteFileAsync(homepageUploadDir + 'small_' + file);
                        };

                        if (fs.existsSync(homepageUploadDir + 'medium_' + file)) {
                            await deleteFileAsync(homepageUploadDir + 'medium_' + file);
                        };

                        if (fs.existsSync(homepageUploadDir + 'large_' + file)) {
                            await deleteFileAsync(homepageUploadDir + 'large_' + file);
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



export default deleteHomepageImage;