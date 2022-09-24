var CronJob = require('cron').CronJob;
import scheduleBookingAction from './scheduleBookingAction';

const scheduleRide = app => {
    new CronJob('0 */5 * * * *', async function() { // Every 5 Minutes
        console.log(`/${'*'.repeat(25)}/`);
		console.log(`/* SCHEDULE RIDE CRON STARTED at ${new Date().toString()} */`);
        try {
            await scheduleBookingAction();
            console.log(`/* SCHEDULE RIDE CRON COMPLETED at ${new Date().toString()}*/`);
            console.log(`/${'*'.repeat(25)}/`);
        } catch (error) {
            console.log(`/* SCHEDULE RIDE CRON ERROR: ${error}*/`);
            console.log(`/${'*'.repeat(25)}/`);
        }
    }, null, true, 'America/Los_Angeles')
}

export default scheduleRide;