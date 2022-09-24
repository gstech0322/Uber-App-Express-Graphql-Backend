import { Category, CurrencyRates } from '../data/models';
import { convert } from '../helpers/currencyConvertion';

export async function calculateTripPrice(vehicleType, distance, duration, convertCurrency, promoCodeData) {

    let categoryInfo, id, riderServiceFee = 0, driverServiceFee = 0, calculatedPrice = 0;
    let priceForDistance = 0, priceForDuration = 0, priceForTrip;
    let unitPrice = 0, minutePrice = 0, basePrice = 0, categoryName;
    let riderFeeType, riderFeeValue, driverFeeType, driverFeeValue, currency, totalFare = 0;
    let rates, ratesData = {}, convertedUnitPrice = 0, convertedMinutePrice = 0, convertedBasePrice = 0;
    let isSameCurrency = true, finalUnitPrice = 0, finalMinutePrice = 0, finalBasePrice = 0;
    let totalFareForDriver = 0, totalFareForRider = 0;
    let isSpecialTrip = false, specialTripPrice = 0, specialTripTotalFare = 0;

    let getCategories = await Category.findOne({
        where: {
            isActive: true,
            id: vehicleType
        },
        raw: true
    });

    const data = await CurrencyRates.findAll({
        attributes: ['currencyCode', 'rate', 'isBase'],
        raw: true 
    });

    const base = data.find(o => o && o.isBase);

    data.map((item) => { ratesData[item.currencyCode] = item.rate });

    rates = ratesData;

    if (getCategories) {
        categoryInfo = getCategories;
    }

    id = categoryInfo && categoryInfo.id;
    unitPrice = categoryInfo && categoryInfo.unitPrice;
    minutePrice = categoryInfo && categoryInfo.minutePrice;
    basePrice = categoryInfo && categoryInfo.basePrice;
    categoryName = categoryInfo && categoryInfo.categoryName;
    riderFeeType = categoryInfo && categoryInfo.riderFeeType;
    riderFeeValue = categoryInfo && categoryInfo.riderFeeValue;
    driverFeeType = categoryInfo && categoryInfo.driverFeeType;
    driverFeeValue = categoryInfo && categoryInfo.driverFeeValue;
    currency = categoryInfo && categoryInfo.currency

    if (currency != convertCurrency) {
        isSameCurrency = false;
        convertedUnitPrice = convert(base.currencyCode, rates, unitPrice, currency, convertCurrency);
        convertedBasePrice = convert(base.currencyCode, rates, basePrice, currency, convertCurrency);
        convertedMinutePrice = convert(base.currencyCode, rates, minutePrice, currency, convertCurrency);
    }

    finalUnitPrice = isSameCurrency ? unitPrice : convertedUnitPrice.toFixed(2);
    finalBasePrice = isSameCurrency ? basePrice : convertedBasePrice.toFixed(2);  
    finalMinutePrice = isSameCurrency ? minutePrice : convertedMinutePrice.toFixed(2);

    priceForDistance = distance * finalUnitPrice;
    priceForDuration = duration * finalMinutePrice;
    priceForTrip = priceForDistance + priceForDuration;


    if (priceForTrip > finalBasePrice) {
        calculatedPrice = priceForTrip;
    } else {
        calculatedPrice = parseFloat(finalBasePrice);
    }

    if (categoryInfo) {
        if (categoryInfo.riderFeeType === 'percentage') {
            riderServiceFee = calculatedPrice * (Number(riderFeeValue) / 100);
        } else {
            if (currency != convertCurrency) {
                riderServiceFee = convert(base.currencyCode, rates, riderFeeValue, currency, convertCurrency);
            } else {
                riderServiceFee = riderFeeValue;
            }
        }
        if (categoryInfo.driverFeeType === 'percentage') {
            driverServiceFee = calculatedPrice * (Number(driverFeeValue) / 100);
        } else {
            if (currency != convertCurrency) {
                driverServiceFee = convert(base.currencyCode, rates, driverFeeValue, currency, convertCurrency);
            } else {
                driverServiceFee = driverFeeValue
            }
        }
    }

    totalFare = calculatedPrice;
    totalFareForRider = calculatedPrice + riderServiceFee;
    totalFareForDriver = calculatedPrice - driverServiceFee;

    if (promoCodeData) { // IF promo code added
        if (promoCodeData.type === 1) { // % calculation
            specialTripPrice = totalFareForRider * (Number(promoCodeData.promoValue) / 100);
        } else { // Fixed amount
            if (promoCodeData.currency !== convertCurrency) { // Different currency
                specialTripPrice = convert(base.currencyCode, rates, promoCodeData.promoValue, promoCodeData.currency, convertCurrency);
            } else { // Same currency
                specialTripPrice = promoCodeData.promoValue;
            }
        }

        if (totalFareForRider > specialTripPrice) {
            isSpecialTrip = true;
            specialTripTotalFare = totalFareForRider - specialTripPrice;
        } else {
            specialTripPrice = 0;
        }
    }

    return await {
        id,
        unitPrice: finalUnitPrice,
        minutePrice: finalMinutePrice,
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
        priceForDuration,
        totalFare: totalFare.toFixed(2),
        calculatedPrice,
        totalFareForRider: totalFareForRider.toFixed(2),
        totalFareForDriver: totalFareForDriver.toFixed(2),
        convertCurrency,
        isSpecialTrip,
        specialTripPrice: specialTripPrice.toFixed(2),
        specialTripTotalFare: specialTripTotalFare.toFixed(2)
    }
}