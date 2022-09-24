import { convert } from '../helpers/currencyConvertion';

export default async function calculateTripCalculation(
    pricingData, categoryData, distance, duration, convertCurrency, promoCodeData, rates, base
) {

    let id, categoryName, unitPrice, minutePrice, basePrice, riderFeeType, riderFeeValue, driverFeeType, driverFeeValue, currency;
    let isSameCurrency = true, priceForDistance = 0, priceForDuration = 0, priceForTrip = 0, calculatedPrice = 0;
    let riderServiceFee = 0, driverServiceFee = 0;
    let isSpecialTrip = false, specialTripPrice = 0, specialTripTotalFare = 0;
    let totalFare = 0, totalFareForDriver = 0, totalFareForRider = 0, riderPayableFare = 0;
    try {
        // Pricing information
        id = pricingData && pricingData.categoryId;
        unitPrice = pricingData && pricingData.unitPrice || 0;
        minutePrice = pricingData && pricingData.minutePrice || 0;
        basePrice = pricingData && pricingData.basePrice || 0;
        riderFeeType = pricingData && pricingData.riderFeeType;
        riderFeeValue = pricingData && pricingData.riderFeeValue || 0;
        driverFeeType = pricingData && pricingData.driverFeeType;
        driverFeeValue = pricingData && pricingData.driverFeeValue || 0;
        currency = pricingData && pricingData.currency;

        // Category - Find the category name
        categoryName = categoryData && categoryData.find((o) => o.id && o.id === id);
        categoryName = categoryName && categoryName.categoryName || '';

        if (currency != convertCurrency) {
            isSameCurrency = false;
            unitPrice = convert(base, rates, unitPrice, currency, convertCurrency);
            minutePrice = convert(base, rates, minutePrice, currency, convertCurrency);
            basePrice = convert(base, rates, basePrice, currency, convertCurrency);

            unitPrice = unitPrice.toFixed(2);
            minutePrice = minutePrice.toFixed(2);
            basePrice = basePrice.toFixed(2);
        }

        priceForDistance = distance * unitPrice;
        priceForDuration = duration * minutePrice;
        priceForTrip = priceForDistance + priceForDuration;

        if (priceForTrip > basePrice) {
            calculatedPrice = priceForTrip;
        } else { // Minimum basefare will be taken
            calculatedPrice = parseFloat(basePrice);
        }

        if (pricingData) {
            // Rider service fee calculation
            if (riderFeeType === 'percentage') {
                riderServiceFee = calculatedPrice * (Number(riderFeeValue) / 100);
            } else {
                if (!isSameCurrency) {
                    riderServiceFee = convert(base, rates, riderFeeValue, currency, convertCurrency);
                } else {
                    riderServiceFee = riderFeeValue;
                }
            }
            // Driver service fee calculation
            if (driverFeeType === 'percentage') {
                driverServiceFee = calculatedPrice * (Number(driverFeeValue) / 100);
            } else {
                if (!isSameCurrency) {
                    driverServiceFee = convert(base, rates, driverFeeValue, currency, convertCurrency);
                } else {
                    driverServiceFee = driverFeeValue;
                }
            }
        }

        totalFare = Number(calculatedPrice);
        totalFareForRider = Number(calculatedPrice) + Number(riderServiceFee);
        totalFareForDriver = Number(calculatedPrice) - Number(driverServiceFee);

        if (promoCodeData) { // IF promo code added
            if (promoCodeData.type === 1) { // % calculation
                specialTripPrice = totalFareForRider * (Number(promoCodeData.promoValue) / 100);
            } else { // Fixed amount
                if (promoCodeData.currency !== convertCurrency) { // Different currency
                    specialTripPrice = convert(base, rates, promoCodeData.promoValue, promoCodeData.currency, convertCurrency);
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

        riderPayableFare = isSpecialTrip ? Number(specialTripTotalFare) : Number(totalFareForRider);

        return await {
            id,
            categoryName,
            pricingId: pricingData.id,
            unitPrice,
            minutePrice,
            basePrice,
            currency,
            riderFeeType,
            riderFeeValue,
            driverFeeType,
            driverFeeValue,
            riderServiceFee: riderServiceFee && Number(riderServiceFee.toFixed(2)) || 0,
            driverServiceFee: driverServiceFee && Number(driverServiceFee.toFixed(2)) || 0,
            priceForDistance,
            priceForDuration,
            totalFare: totalFare && Number(totalFare.toFixed(2)) || 0,
            calculatedPrice,
            totalFareForRider: totalFareForRider && Number(totalFareForRider.toFixed(2)) || 0,
            totalFareForDriver: totalFareForDriver && Number(totalFareForDriver.toFixed(2)) || 0,
            convertCurrency,
            isSpecialTrip,
            specialTripPrice: specialTripPrice && Number(specialTripPrice.toFixed(2)) || 0,
            specialTripTotalFare: specialTripTotalFare && Number(specialTripTotalFare.toFixed(2)) || 0,
            riderPayableFare
        };
    } catch (error) {
        console.log('Trip calculation error', error);
        return null;
    }
}