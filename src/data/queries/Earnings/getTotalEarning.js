import moment from 'moment';
import {
    Booking,
    UserProfile,
    CurrencyRates
} from '../../models';
import EarningsType from '../../types/EarningsType';
import { getMinutes } from '../../../helpers/timeHelpers';
import { convert } from '../../../helpers/currencyConvertion';
import { formatExponentialNumber } from '../../../helpers/formatNumbers';

const getTotalEarning = {

    type: EarningsType,

    async resolve({ request }) {
        try {
            if (request.user) {
                let driverId = request.user.id;
                let ratesData = {}, driverPreferredCurrency;
                let startDate, endDate, weeklyTotalTrips = 0;
                let weeklyTotaltips = 0, weeklyTotalEarnings = 0, weeklyTotalDuration = 0;

                let today = moment();
                startDate = moment(today).startOf('week').startOf('day');
                endDate = moment(startDate).endOf('week').endOf('day');

                // Driver Preferred currency data
                const driverProfileData = await UserProfile.findOne({
                    attributes: ['preferredCurrency'],
                    where: { userId: driverId },
                    raw: true
                });
                driverPreferredCurrency = driverProfileData && driverProfileData.preferredCurrency || 'USD';

                // Currencies & Currency rates
                let currencyData = await CurrencyRates.findAll({
                    attributes: ['currencyCode', 'rate', 'isBase'],
                    raw: true
                });
                let baseCurrency = currencyData && currencyData.length > 0 && currencyData.find((o) => o && o.isBase);
                baseCurrency = baseCurrency && baseCurrency.currencyCode;
                currencyData.map((item) => {
                    ratesData[item.currencyCode] = item.rate;
                });
            

                /* Weekly Earnings */
                let weeklyBookingData = await Booking.findAll({
                    attributes: ['id', 'driverTotalFare', 'currency', 'tripStart', 'tripEnd', 'tipsAmount'],
                    where: {
                        $and: [
                            { driverId },
                            { tripStatus: { $in: ['completed'] } },
                            {
                                tripEnd: {
                                    $and: [{
                                        $lte: endDate
                                    }, {
                                        $gte: startDate
                                    }]
                                }
                            }
                        ]
                    },
                    raw: true
                });

                const weeklyEarningsData = await culculateEarnings(weeklyBookingData, ratesData, baseCurrency, driverPreferredCurrency);
                weeklyTotalTrips = weeklyEarningsData && weeklyEarningsData.totalTrips;
                weeklyTotaltips =  weeklyEarningsData && weeklyEarningsData.totalTips && weeklyEarningsData.totalTips.toFixed(2);
                weeklyTotalEarnings = weeklyEarningsData && weeklyEarningsData.totalEarnings && weeklyEarningsData.totalEarnings.toFixed(2);
                weeklyTotalDuration = weeklyEarningsData && weeklyEarningsData.totalDuration && weeklyEarningsData.totalDuration.toFixed(2);
    
                /* Total Earnings */
                let totalBookingData = await Booking.findAll({
                    attributes: ['id', 'driverTotalFare', 'currency', 'tripStart', 'tripEnd', 'tipsAmount'],
                    where: {
                        $and: [
                            { driverId },
                            { tripStatus: { $in: ['completed'] } }
                        ]
                    },
                    raw: true
                });

                const {
                    totalTrips, totalTips,
                    totalEarnings, totalDuration
                } = await culculateEarnings(totalBookingData, ratesData, baseCurrency, driverPreferredCurrency);

                console.log('totalEarnings', Number(totalEarnings).toFixed(2))

                return await {
                    status: 200,
                    result: {
                        currency: driverPreferredCurrency,
                        startDate,
                        endDate,
                        weeklyTotalTrips,
                        weeklyTotaltips,
                        weeklyTotalEarnings,
                        weeklyTotalDuration,
                        totalTrips,
                        totalTips: totalTips ? totalTips.toFixed(2) : totalTips,
                        totalEarnings: totalEarnings ? totalEarnings.toFixed(2) : totalEarnings,
                        totalDuration: totalDuration ? totalDuration.toFixed(2) : totalDuration
                    }
                };
            } else {
                return await {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged in with your account. Please login and continue.'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }

    },
};

async function culculateEarnings(bookingData, ratesData, baseCurrency, toCurrency) {
    let totalTrips = 0, totalTips = 0, totalEarnings = 0, totalDuration = 0;

    if (bookingData && bookingData.length > 0) {
        totalTrips = bookingData.length; // Trips
        await Promise.all(bookingData.map((item) => {
            let bookingFare = 0, tipsFare = 0;
            // Calculate duration
            totalDuration = totalDuration + (getMinutes(item.tripStart, item.tripEnd)); // Duration
            // Calculate earnings
            bookingFare =  (item.driverTotalFare && Number(item.driverTotalFare) > 0) ? Number(item.driverTotalFare) : 0;
            bookingFare = formatExponentialNumber(bookingFare);
            if (toCurrency !== item.currency && bookingFare > 0) {
                bookingFare = convert(baseCurrency, ratesData, bookingFare, item.currency, toCurrency);
            }
            tipsFare =  (item.tipsAmount && Number(item.tipsAmount) > 0) ? Number(item.tipsAmount) : 0;
            tipsFare = formatExponentialNumber(tipsFare);
            if (toCurrency !== item.currency && tipsFare > 0) {
                tipsFare = convert(baseCurrency, ratesData, tipsFare, item.currency, toCurrency);
            }
            totalTips = totalTips + tipsFare; // Tips
            
            totalEarnings = totalEarnings + (bookingFare + tipsFare); // Earnings
        }));
    }

    return await {
        totalTrips,
        totalTips,
        totalEarnings,
        totalDuration
    };
}

export default getTotalEarning;



/**
query {
  getTotalEarning {
    result {
        currency
        startDate
        endDate
        weeklyTotalTrips
        weeklyTotalEarnings
        weeklyTotalDuration
        totalTrips
        totalEarnings
        totalDuration
    }
    status
    errorMessage
  }
}

 */
