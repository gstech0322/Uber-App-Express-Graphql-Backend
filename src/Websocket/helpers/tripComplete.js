import fetch from 'node-fetch'; 
import { url } from '../../config'; 

export async function tripComplete(requestData) {
  if (requestData && requestData.data) {
    let query = `mutation($bookingId: Int!, $totalDistance: Float!, $dropOffLocation: String!, $dropOffLat: Float!, $dropOffLng: Float!, $tollFee: Float!) {
      completeBooking(bookingId: $bookingId, totalDistance: $totalDistance, dropOffLocation: $dropOffLocation, dropOffLat: $dropOffLat, dropOffLng: $dropOffLng, tollFee: $tollFee) {
          status
          errorMessage
          data {
              id
              riderId
              driverId
              baseUnit
              baseMinute
              baseFare
              riderServiceFee
              driverServiceFee
              estimatedTotalFare
              totalFare
              riderTotalFare
              driverTotalFare
              totalDuration
              totalRideDistance
              currency
              paymentType
              walletBalance
              isSpecialTrip
              specialTripPrice, 
              specialTripTotalFare,
              tollFee
          }
      }
    }`;


    let variables = {
      bookingId: requestData.data.bookingId,
      totalDistance: requestData.data.totalDistance,
      dropOffLocation: requestData.data.dropOffLocation,
      dropOffLat: requestData.data.dropOffLat,
      dropOffLng: requestData.data.dropOffLng,
      tollFee: requestData.data.tollFee
    };

    /* For "start" the trip:
    - bookingId - totalDistance - dropOffLocation - dropOffLat - dropOffLng
    */

    const { data, data: { completeBooking } } = await new Promise((resolve, reject) => {
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

    if (data && completeBooking) {
      return await {
        status: completeBooking.status,
        errorMessage: completeBooking.errorMessage,
        data: completeBooking.data
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