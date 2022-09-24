var CronJob = require('cron').CronJob;
import sequelize from '../../data/sequelize';
import { Booking, User } from '../../data/models';

const tripAutoCancelCron = app => {
	// CronJob(seconds minutes hours day-of-month months day-of-week)
	new CronJob('0 */2 * * * *', async function () { // Every 2 minutes
		console.log('holy moly expired the not responding trip requests...');
		try {
			const bookingData = await Booking.findAll({
				attributes: ['id', 'tripStatus', 'driverId', 'createdAt', [sequelize.literal('TIMESTAMPDIFF(MINUTE, createdAt, NOW())'), 'minute_difference']],
				having: {
					'minute_difference': {
						$gt: 2 // 2 minutes not reponding trip request
					},
					tripStatus: 'created',
				},
				raw: true
			});
			
			if (bookingData && bookingData.length > 0) {
				let bookingIds = bookingData.map(x => { return x['id'] });
				let driverIds = bookingData.map(x => { return x['driverId'] });
	
				let findInActiveDrivers = await User.findAll({
					attributes: ['id'],
					where: {
						id: {
							$in: driverIds
						},
						activeStatus: 'inactive'
					},
					raw: true
				});
	
				let updateInActiveDriverIds = findInActiveDrivers.map(x => { return x['id'] });
	
				let updateBookingStatus = await Booking.update({
					tripStatus: 'expired',
					notes: 'The trip did not accept/decline by the driver and the system updated to the expired status by background CRON.'
				}, {
					where: {
						id: {
							$in: bookingIds
						}
					}
				});
	
				if (updateInActiveDriverIds && updateInActiveDriverIds.length > 0) {
					let driverStatusUpdate = await User.update({
						activeStatus: 'active'
					}, {
						where: {
							id: {
								$in: updateInActiveDriverIds
							}
						}
					});
				}
			}
		} catch(error) {
			console.log('TRIP AUTO CANCEL CRON ERROR: ', error);
		}

	}, null, true, 'America/Los_Angeles');

};

export default tripAutoCancelCron;