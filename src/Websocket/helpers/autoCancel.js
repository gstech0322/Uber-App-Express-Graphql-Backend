import fetch from 'node-fetch'; 
import { url } from '../../config'; 

export async function autoCancel(requestData) { 
     
    if (requestData && requestData.data) {
      let query = `mutation($riderId: String!) {
        autoCancel(riderId: $riderId) {
            status
            errorMessage
            data {
                id
                bookingId
            }
        }
      }`; 
      
      let variables = {  
        riderId: requestData.data.userId 
      };

      /* For "auto-cancel" the trip:
        - driverId(userId)
      */

     const { data, data: { autoCancel } } = await new Promise((resolve, reject) => {
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

      if (data && autoCancel) {
        return await {
          status: autoCancel.status,
          errorMessage: autoCancel.errorMessage,
          data: autoCancel.data
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