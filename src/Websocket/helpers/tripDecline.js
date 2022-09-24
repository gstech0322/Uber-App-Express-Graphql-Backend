import fetch from 'node-fetch';
import {url} from '../../config';

export async function tripDecline(requestData) {
    let requestStatus, variables;

    let query = `query($requestStatus: String!, $data: String) {
        declineBooking(requestStatus: $requestStatus, data: $data) {
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
            }
        }
    }`;

    if (requestData && requestData.requestStatus) {

        requestStatus = requestData.requestStatus; // "decline"

        variables = {
            requestStatus,
            data: JSON.stringify(requestData.data)
        };

        /* For "decline": 
            - auth, - userId, - bookingId, - riderId
        */
        const {data, data: {declineBooking}} = await new Promise((resolve, reject) => {
            fetch(url + '/graphql', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query, variables}),
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

        if (data && declineBooking) {
            return await {
                status: declineBooking.status,
                errorMessage: declineBooking.errorMessage,
                isTryAgain: declineBooking.isTryAgain || false,
                data: declineBooking.data
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