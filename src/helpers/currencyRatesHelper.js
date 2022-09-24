import { CurrencyRates } from '../data/models';

const getCurrencyRates = async () => {
    let rates = {}, baseCurrency;
    const currencyRatesData = await CurrencyRates.findAll({
        attributes: ['currencyCode', 'rate', 'isBase'],
        raw: true
    });
    // Prepare base currency
    baseCurrency = currencyRatesData.find((o) => o && o.isBase);
    baseCurrency = baseCurrency && baseCurrency.currencyCode;
    // Preparerates lookup
    currencyRatesData.map((item) => { rates[item.currencyCode] = item.rate });

    return {
        baseCurrency,
        rates
    };
}

export default getCurrencyRates