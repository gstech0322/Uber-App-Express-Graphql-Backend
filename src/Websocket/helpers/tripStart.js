import fetch from 'node-fetch';
import {url} from '../../config';

export async function tripStart(requestData) {

    if (requestData && requestData.data && requestData.data.bookingId
        && requestData.data.riderId && requestData.data.userId) {

        let query = `mutation($bookingId: Int!, $driverId: String!, $riderId: String!) {
            startBooking(bookingId: $bookingId, driverId: $driverId, riderId: $riderId) {
                status
                errorMessage
                data {
                  id
                  userId
                  driverId
                  name
                  picture 
                  driverLat
                  driverLng
                  phoneNumber
                  bookingId
                  locationUpdate 
                  vehicleId
                  vehicleNumber
                  vehicleModel
                  vehicleColor
                }
              }
            }`;

        let variables = {
            bookingId: requestData.data.bookingId,
            riderId: requestData.data.riderId,
            driverId: requestData.data.userId
        };

        /* For "start" the trip:
        - bookingId - driverId - riderId
        */

        const {data, data: {startBooking}} = await new Promise((resolve, reject) => {
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

        if (data && startBooking) {
            return await {
                status: startBooking.status,
                errorMessage: startBooking.errorMessage,
                data: startBooking.data
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