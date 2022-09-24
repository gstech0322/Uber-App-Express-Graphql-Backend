import fetch from 'node-fetch';
import { url } from '../../config'; 

export async function cancelTripRequest(requestData) {
    let variables;

    let query = `
        mutation($userId: String!) {
            cancelBookingRequest(userId: $userId) {
                status
                errorMessage
                data {
                    id
                    userId
                    driverId
                    bookingId
                    tripStatus
                }
            }
        }
    `; 

    if (requestData) {
        variables = {
            userId: requestData.data && requestData.data.userId
        };

        const { data, data: { cancelBookingRequest } } = await new Promise((resolve, reject) => {
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

        if (data && cancelBookingRequest) {
            return await {
                status: cancelBookingRequest.status,
                errorMessage: cancelBookingRequest.errorMessage,
                data: cancelBookingRequest.data
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