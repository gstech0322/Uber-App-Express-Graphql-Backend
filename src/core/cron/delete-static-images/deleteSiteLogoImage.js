var CronJob = require('cron').CronJob;
import fs from 'fs';
import { promisify } from 'util';

import { logoUploadDir } from '../../../config';
import { TempImages, SiteSettings } from '../../../data/models';

const readFileAsync = promisify(fs.readdir);
const deleteFileAsync = promisify(fs.unlink);

const deleteSiteLogoImage = app => {

    new CronJob('0 0 */6 * * *', async function () {
        try {
            const files = await readFileAsync(logoUploadDir);

            const promise = files.map(async (file) => {

                if (!file.includes('small') && !file.includes('medium') && !file.includes('large')) {
                    const existOnSiteSettings = await SiteSettings.findOne({
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



                    if (!existOnTemp && !existOnSiteSettings) {
                        if (fs.existsSync(logoUploadDir + file)) {
                            await deleteFileAsync(logoUploadDir + file);
                        };

                        if (fs.existsSync(logoUploadDir + 'small_' + file)) {
                            await deleteFileAsync(logoUploadDir + 'small_' + file);
                        };

                        if (fs.existsSync(logoUploadDir + 'medium_' + file)) {
                            await deleteFileAsync(logoUploadDir + 'medium_' + file);
                        };

                        if (fs.existsSync(logoUploadDir + 'large_' + file)) {
                            await deleteFileAsync(logoUploadDir + 'large_' + file);
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


export default deleteSiteLogoImage;