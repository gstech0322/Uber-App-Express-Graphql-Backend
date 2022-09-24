const generateRideRequestPushNotificationLookup = (
    requestLocationData, riderProfileData, vehicleData, promoCodeData, riderId, driverId, bookingId, category,
    isSpecialTrip, specialTripPrice, specialTripTotalFare, riderPayableFare, scheduleId, bookingType
    ) => {
    try {
        return {
            tripStatus: 'tripRequest',
            userId: driverId,
            riderId,
            name: riderProfileData.firstName,
            picture: riderProfileData.picture,
            phoneNumber: riderProfileData['user.phoneDialCode'] + '' + riderProfileData['user.phoneNumber'],
            overallRating: riderProfileData['user.overallRating'],
            riderLocation: requestLocationData.riderLocation,
            riderLocationLat: requestLocationData.riderLocationLat,
            riderLocationLng: requestLocationData.riderLocationLng,
            pickUpLocation: requestLocationData.pickUpLocation,
            pickUpLat: requestLocationData.pickUpLat,
            pickUpLng: requestLocationData.pickUpLng,
            dropOffLocation: requestLocationData.dropOffLocation,
            dropOffLat: requestLocationData.dropOffLat,
            dropOffLng: requestLocationData.dropOffLng,
            bookingId,
            category,
            vehicleId: vehicleData && vehicleData.id || null,
            vehicleNumber: vehicleData && vehicleData.vehicleNumber || null,
            vehicleModel: vehicleData && vehicleData.vehicleModel || null,
            vehicleColor: vehicleData && vehicleData.vehicleColor || null,
            promoCodeId: promoCodeData && promoCodeData.id || null,
            isSpecialTrip,
            specialTripPrice,
            specialTripTotalFare,
            scheduleId,
            riderPayableFare,
            bookingType
        };
    } catch(error) {
        console.log('generateRideRequestPushNotificationLookup Error: ', error);
        return null;
    }
}

module.exports = {
    generateRideRequestPushNotificationLookup
};