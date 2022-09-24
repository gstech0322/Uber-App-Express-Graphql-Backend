import { Category, Currencies, CurrencyRates } from '../data/models';
import { convert } from '../helpers/currencyConvertion';

export async function completeTripCalculation(vehicleType, distance, convertCurrency) {

    let categoryInfo, id, riderServiceFee = 0, driverServiceFee = 0, calculatedPrice = 0, priceForDistance = 0, unitPrice = 0, basePrice = 0, categoryName;
    let riderFeeType, riderFeeValue, driverFeeType, driverFeeValue, currency, totalFare = 0;
    let rates, ratesData = {}, convertedUnitPrice = 0, convertedBasePrice = 0;
    let isSameCurrency = true, finalUnitPrice = 0, finalBasePrice = 0, totalFareForDriver = 0, totalFareForRider = 0;

    categoryInfo = await Category.findOne({
        where: {
            isActive: true,
            id:vehicleType
        },
        raw: true
    });

    const data = await CurrencyRates.findAll();
    const base = await Currencies.findOne({ where: { isBaseCurrency: true } });
    if (data) {
        data.map((item) => {
            ratesData[item.dataValues.currencyCode] = item.dataValues.rate;
        })
    }
    rates = ratesData;

    // if (getCategories && getCategories.length > 0) {
    //     categoryInfo = getCategories.find(o => o.id == vehicleType);
    // }

    id = categoryInfo && categoryInfo.id;
    unitPrice = categoryInfo && categoryInfo.unitPrice;
    basePrice = categoryInfo && categoryInfo.basePrice;
    categoryName = categoryInfo && categoryInfo.categoryName;
    riderFeeType = categoryInfo && categoryInfo.riderFeeType;
    riderFeeValue = categoryInfo && categoryInfo.riderFeeValue;
    driverFeeType = categoryInfo && categoryInfo.driverFeeType;
    driverFeeValue = categoryInfo && categoryInfo.driverFeeValue;
    currency = categoryInfo && categoryInfo.currency

    if (currency != convertCurrency) {
        isSameCurrency = false;
        convertedUnitPrice = convert(base.symbol, rates, unitPrice, currency, convertCurrency);
        convertedBasePrice = convert(base.symbol, rates, basePrice, currency, convertCurrency);
    }

    finalUnitPrice = isSameCurrency ? unitPrice : convertedUnitPrice.toFixed(2);
    finalBasePrice = isSameCurrency ? basePrice : convertedBasePrice.toFixed(2);  

    priceForDistance = distance * finalUnitPrice;
    if (priceForDistance > finalBasePrice) {
        calculatedPrice = priceForDistance;
    } else {
        calculatedPrice = parseFloat(finalBasePrice);
    }

    if (categoryInfo) {
        if (categoryInfo.riderFeeType === 'percentage') {
            riderServiceFee = calculatedPrice * (Number(riderFeeValue) / 100);
        } else {
            if (currency != convertCurrency) {
                riderServiceFee = convert(base.symbol, rates, riderFeeValue, currency, convertCurrency);
            } else {
                riderServiceFee = riderFeeValue;
            }
        }
        if (categoryInfo.driverFeeType === 'percentage') {
            driverServiceFee = calculatedPrice * (Number(driverFeeValue) / 100);
        } else {
            if (currency != convertCurrency) {
                driverServiceFee = convert(base.symbol, rates, driverFeeValue, currency, convertCurrency);
            } else {
                driverServiceFee = driverFeeValue
            }
        }
    }

    totalFare = calculatedPrice + riderServiceFee + driverServiceFee;
    totalFareForRider = calculatedPrice + riderServiceFee;
    totalFareForDriver = calculatedPrice + driverServiceFee;

    return {
        id,
        unitPrice: finalUnitPrice,
        basePrice: finalBasePrice,
        currency,
        categoryName,
        riderFeeType,
        riderFeeValue,
        driverFeeType,
        driverFeeValue,
        riderServiceFee: riderServiceFee.toFixed(2),
        driverServiceFee: driverServiceFee.toFixed(2),
        priceForDistance,
        totalFare: totalFare.toFixed(2),
        calculatedPrice,
        totalFareForRider: totalFareForRider.toFixed(2),
        totalFareForDriver: totalFareForDriver.toFixed(2),
        convertCurrency
    }
}