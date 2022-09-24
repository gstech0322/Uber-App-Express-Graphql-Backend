import { Booking, UserProfile, CurrencyRates, Currencies } from '../../models';

import TotalBookingType from '../../types/TotalBookingType'; 
import { convert } from '../../../helpers/currencyConvertion';
import { formatExponentialNumber } from '../../../helpers/formatNumbers';


const TotalBooking = {

    type: TotalBookingType,

    async resolve({ request }) {
        try { 
            let totalIncome = 0, userId, rates = [], driverPreferredCurrency;
            if (request.user) {
                userId = request.user.id;

                let userDetails = await UserProfile.findOne({
                    attributes: ['preferredCurrency', 'userId', 'profileId'],
                    where: {
                        userId
                    },
                    raw: true
                });
                driverPreferredCurrency = userDetails && userDetails.preferredCurrency || 'USD';

                let bookingData = await Booking.findAll({
                    attributes: ['id', 'tripStatus', 'currency', 'driverTotalFare', 'tipsAmount'],
                    where: {
                        driverId: userId,
                        tripStatus: 'completed'
                    },
                    raw: true
                });

                if (bookingData && bookingData.length > 0) {
                    const ratesData = await CurrencyRates.findAll({
                        attributes: ['currencyCode', 'rate', 'isBase'],
                        raw: true
                    });
                    let baseCurrency = ratesData && ratesData.length > 0 && ratesData.find((o) => o && o.isBase);
                    baseCurrency = baseCurrency && baseCurrency.currencyCode;
                    // Preparing currency rates
                    ratesData && ratesData.length > 0 && ratesData.map((item) => {
                        rates[item.currencyCode] = item.rate;
                    })
                    

                    await Promise.all(bookingData.map(async(item) => {
                        let bookingFare = 0, tipsFare = 0;
                        // Calculate earnings
                        bookingFare = (item.driverTotalFare && Number(item.driverTotalFare) > 0) ? Number(item.driverTotalFare) : 0;
                        bookingFare = formatExponentialNumber(bookingFare);
                        if (driverPreferredCurrency !== item.currency && bookingFare > 0) {
                            bookingFare = convert(baseCurrency, rates, bookingFare, item.currency, driverPreferredCurrency);
                        }
                        tipsFare = (item.tipsAmount && Number(item.tipsAmount) > 0) ? Number(item.tipsAmount) : 0;
                        tipsFare = formatExponentialNumber(tipsFare);
                        if (driverPreferredCurrency !== item.currency && tipsFare > 0) {
                            tipsFare = convert(baseCurrency, rates, tipsFare, item.currency, driverPreferredCurrency);
                        }

                        totalIncome = totalIncome + (bookingFare + tipsFare)
                    }));

                    return await { 
                        status: 200,
                        results: {
                            totalBookings: bookingData.length, 
                            totalIncome: totalIncome ? totalIncome.toFixed(2) : totalIncome 
                        }
                    };

                } else {
                    return await { // No Booking Found
                        status: 200,
                        results: {
                            totalBookings: 0, 
                            totalIncome: 0 
                        }
                    };
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'It looks like you have not logged in with your account. Please login and continue.'
                }
            }

        } catch(error) {
            return { 
                status : 400,
                errorMessage : 'Something went wrong!, ' + error 
            };  
        }
    }
};

export default TotalBooking;

/*

query TotalBooking{
  TotalBooking{
    results {
      totalIncome
      totalBookings
    }
    status
    errorMessage
  }
} 


*/