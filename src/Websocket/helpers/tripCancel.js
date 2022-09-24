import fetch from 'node-fetch'; 
import { url } from '../../config'; 

export async function tripCancel(requestData, requestBy) {
    if (requestData && requestData.data && requestData.data.bookingId
        && requestData.data.userId && requestBy) {
        let query = `mutation($bookingId: Int!, $requestBy: String!, $userId: String!, $reason: String) {
          cancelBooking(bookingId: $bookingId, requestBy: $requestBy, userId: $userId, reason: $reason) {
              status
              errorMessage
              data {
                  id
                  bookingId
              }
          }
        }`;

        
        let variables = {
          bookingId: requestData.data.bookingId,
          userId: requestData.data.userId,
          requestBy,
          reason: (requestData.data.reason && requestData.data.reason !='')?requestData.data.reason:''
        };
        
        /* For "cancel" the trip:
        - bookingId - userId - requestBy(cancelledByRider/cancelledByDriver)
        */

       const { data, data: { cancelBooking } } = await new Promise((resolve, reject) => {
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

      if (data && cancelBooking) {
        return await {
          status: cancelBooking.status,
          errorMessage: cancelBooking.errorMessage,
          data: cancelBooking.data
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