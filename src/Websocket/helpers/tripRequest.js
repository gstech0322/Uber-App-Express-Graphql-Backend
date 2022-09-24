import fetch from 'node-fetch';
import { url } from '../../config'; 

export async function tripRequest(requestData) {
    let requestStatus, variables;

    let query = `query($requestStatus: String!, $data: String) {
        createBooking(requestStatus: $requestStatus, data: $data) {
            status
            errorMessage
            isTryAgain
            data {
                id,
                name
                userId
                riderId
                picture
                phoneNumber
                riderLocation
                riderLocationLat
                riderLocationLng
                pickUpLocation
                pickUpLat
                pickUpLng
                dropOffLocation
                dropOffLat
                dropOffLng
                bookingId
                category
                overallRating
                vehicleId
                vehicleNumber
                vehicleModel
                vehicleColor
                paymentType
                promoCodeId
                isSpecialTrip
                specialTripPrice
                specialTripTotalFare
                scheduleId
                riderPayableFare
                bookingType
            }
        }
    }`; 


    if (requestData && requestData.requestStatus) {
        
        requestStatus = requestData.requestStatus; // "request"
        
        variables = {
            requestStatus,
            data: JSON.stringify(requestData.data)
        };

        const { data, data: { createBooking } } = await new Promise((resolve, reject) => {
            fetch(url + '/graphql', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables }),
            method: 'post',
        }).then(res => res.json())
          .then(function (body) {
                if (body) {
                    resolve(body)
                } else {
                    reject(error)
                }
            });
        });

        if (data && createBooking) {
            return await {
                status: createBooking.status,
                errorMessage: createBooking.errorMessage,
                isTryAgain: createBooking.isTryAgain || false,
                data: createBooking.data
            };
        } else {
            return await {
                status: 400,
                errorMessage: "Oops! Something went wrong. Please try again!",
                data: null
            };
        }
        
    } else {
        return {
            status: 400,
            errorMessage: "Oops! Something went wrong. Please check your internet connection and try again!",
            data: null
        }
    }
}