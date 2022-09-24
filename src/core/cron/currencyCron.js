var CronJob = require('cron').CronJob;
import { Currencies, CurrencyRates } from '../../data/models';
import fetch from 'node-fetch';

const currencyCron = app => {
	// CronJob(seconds minutes hours day-of-month months day-of-week)
	new CronJob('0 0 */6 * * *', async function () {
		console.log(`/${'*'.repeat(25)}/`);
		console.log('/* CURRENCY RATES CRON STARTED */');
		try {
			// Get the base currency symbol
			const baseCurrency = await Currencies.findOne({
				where: { isBaseCurrency: true },
				raw: true
			});

			const symbol = baseCurrency.symbol;

			// Fetch rates from fixer api
			//const URL = 'http://api.fixer.io/latest?base=' + symbol;
			const URL = 'https://api.coinbase.com/v2/exchange-rates?currency=' + symbol;
			const resp = await fetch(URL);
			const { data } = await resp.json();
			const currencyData = data.rates;

			// Prepare data and rates from fixer then store them into currency rates table
			let baseData = {
				currencyCode: symbol,
				rate: 1.00,
				isBase: true
			};

			let ratesData = Object.keys(currencyData).map(function (data) {
				return { "currencyCode": data, rate: currencyData[data] };
			});

			ratesData.push(baseData);

			if (ratesData && ratesData.toString().trim() !== '' && ratesData.length > 0) {
				// Clean the table before store anything
				await CurrencyRates.truncate();
				// Lets do bulk create of currency rates
				const updateRates = await CurrencyRates.bulkCreate(ratesData);
			}

			console.log('/* CURRENCY RATES CRON COMPLETED */');
			console.log(`/${'*'.repeat(25)}/`);
		} catch(error) {
			console.log('CURRENCY RATES CRON ERROR: ', error);
			console.log(`/${'*'.repeat(25)}/`);
		}
	}, null, true, 'America/Los_Angeles');

};

export default currencyCron;