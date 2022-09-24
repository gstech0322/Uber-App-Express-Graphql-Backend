import fetch from 'node-fetch'; 
import { url } from '../../config'; 

export async function loginCheck(requestData) { 
     
    if (requestData && requestData.data) {
      let query = `query ($userId: String!) {
        loginCheck (
            userId: $userId
        ) {
            result {
              userId
              deviceType
              deviceId
            }
            status
            errorMessage
        }
    }`; 
  
      let variables = {  
        userId: requestData.data.userId 
      };

      /* For "login-check" for the user:
        - userId
      */

     const { data, data: { loginCheck } } = await new Promise((resolve, reject) => {
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

      if (data && loginCheck) {
        return await {
          status: loginCheck.status,
          errorMessage: loginCheck.errorMessage,
          data: loginCheck.result
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