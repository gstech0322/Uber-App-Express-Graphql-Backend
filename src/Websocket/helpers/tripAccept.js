import fetch from 'node-fetch';
import { url } from '../../config'; 

export async function tripAccept(requestData) {

  if (requestData && requestData.data && requestData.data.bookingId
    && requestData.data.userId && requestData.data.riderId) {

    let query = `mutation($bookingId: Int!, $driverId: String!, $riderId: String!) {
      acceptBooking(bookingId: $bookingId, driverId: $driverId, riderId: $riderId) {
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
            overallRating
            vehicleId
            vehicleNumber
            vehicleModel
            vehicleColor
          }
        }
      }`;
      
    let variables = {
      bookingId: requestData.data.bookingId,
      driverId: requestData.data.userId,
      riderId: requestData.data.riderId
    };

    /* For "accept" the trip:
    - bookingId - driverId - riderId
    */

    const { data, data: { acceptBooking } } = await new Promise((resolve, reject) => {
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

    if (data && acceptBooking) {
      return await {
        status: acceptBooking.status,
        errorMessage: acceptBooking.errorMessage,
        data: acceptBooking.data
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