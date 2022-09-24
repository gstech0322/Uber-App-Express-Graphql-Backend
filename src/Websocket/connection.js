// Config
import { environment } from '../config';
// JWT Authentication
import { socketVerifyJWT_MW } from '../libs/socketMiddleware';
// Helpers
import { tripRequest } from './helpers/tripRequest';
import { tripDecline } from './helpers/tripDecline';
import { tripAccept } from './helpers/tripAccept';
import { tripStart } from './helpers/tripStart';
import { tripCancel } from './helpers/tripCancel';
import { tripComplete } from './helpers/tripComplete';
import { autoCancel } from './helpers/autoCancel';
import { loginCheck } from './helpers/loginCheck';
import { cancelTripRequest } from './helpers/cancelTripRequest';
const __DEV__ = environment;

const connection = (app, io) => {
    io.on('connection', function (socket) {
        socket.on('disconnecting', (reason) => {
            console.log('disconnecting');
        });

        if (__DEV__) {
            /* Test Socket event */
            /*
            Rider:-

            http://localhost:4001/?id=<userID>&type=1

            Driver:-

            http://localhost:4001/?id=<userID>&type=2

            */
            socket.on('test', async function (requestData) {
                let formattedRequest = JSON.parse(requestData);
                io.emit("testRequest-" + formattedRequest.id, formattedRequest);
            });
        }

        socket.on('disconnect', function () {
            console.log('Disconnect', socket.id);
        });

        /***** 
        * Allocating a driver for a rider trip request & driver declines the trip request 
        *****/
        socket.on('tripRequest', async function (requestData) {
            let formattedRequest = JSON.parse(requestData);
            let authCheck = await socketVerifyJWT_MW(formattedRequest.data);
            let responseData;
            if (formattedRequest) {
                if (authCheck && authCheck.status === 200) {
                    responseData = await tripRequest(formattedRequest);
                    if (responseData && responseData.status === 200) {
                        if(formattedRequest.data.bookingType === 2){
                            io.emit('tripRequest-' + formattedRequest.data.userId, { data: responseData })
                        } else {
                            io.emit('tripRequest-' + responseData.data.id, { data: responseData }); // Request to Driver(Accept/Decline)
                        }
                    } else {
                        io.emit('tripRequest-' + formattedRequest.data.userId, { data: responseData }); // Request to Rider(Error Reponse)
                    }
                } else {
                    io.emit('tripRequest-' + formattedRequest.data.userId, { data: authCheck }); // Request to Rider(Authentical Fail)
                }
            } else {
                io.emit('tripRequest-' + formattedRequest.data.userId, {
                    data: {
                        status: 400,
                        errorMessage: 'Oops! sorry, something went wrong. Please try again.'
                    }
                }); // Request to Rider(Required information missing)
            }
        });

        /***** 
        * The driver declines the trip request and allocating another driver for the trip 
        *****/
        socket.on('tripDecline', async function (requestData) {
            let formattedRequest = JSON.parse(requestData);
            let authCheck = await socketVerifyJWT_MW(formattedRequest.data);
            let responseData;

            if (formattedRequest) {
                if (authCheck && authCheck.status === 200) {
                    responseData = await tripDecline(formattedRequest);
                    if (responseData && responseData.status === 200) {
                        io.emit('tripRequest-' + responseData.data.id, { data: responseData }); // Request to New Driver(Accept/Decline)
                    } else {
                        if (responseData && responseData.isTryAgain) {
                            io.emit('tripRequest-' + formattedRequest.data.riderId, { data: responseData }); // Request to Rider(Error Reponse)
                        } else {
                            io.emit('tripRequest-' + formattedRequest.data.userId, { data: responseData }); // Error Response to Driver
                        }
                    }
                } else {
                    io.emit('tripDecline-' + formattedRequest.data.userId, {
                        data: authCheck
                    }); // Request to Driver(Authentical Fail)
                }
            } else {
                io.emit('tripDecline-' + formattedRequest.data.userId, {
                    data: {
                        status: 400,
                        errorMessage: 'Oops! sorry, something went wrong. Please try again.'
                    }
                }); // Request to Driver(Required information missing)
            }
        });

        /*****
        * The driver accepts a trip request
        *****/
        socket.on('tripAccept', async function (requestData) {
            let formattedRequest = JSON.parse(requestData);
            let authCheck = socketVerifyJWT_MW(formattedRequest.data);
            let responseData;
            if (formattedRequest) {
                if (authCheck && authCheck.status === 200) {
                    responseData = await tripAccept(formattedRequest);

                    if (responseData && responseData.status === 200) {
                        io.emit('tripRequest-' + responseData.data.id, { data: responseData }); // Request to Rider with driver information
                    } else {
                        io.emit('tripAccept-' + formattedRequest.data.userId, { data: responseData }); // Request to Driver(Error Reponse)
                    }
                } else {
                    io.emit('tripAccept-' + formattedRequest.data.userId, {
                        data: authCheck
                    }); // Request to Driver(Authentical Fail)
                }
            } else {
                io.emit('tripAccept-' + formattedRequest.data.userId, {
                    data: {
                        status: 400,
                        errorMessage: 'Oops! sorry, something went wrong. Please try again.'
                    }
                }); // Request to Driver(Required information missing)
            }
        });

        /*****
        * Finding a driver live locations
        *****/
        socket.on('driverLocation', async function (requestData) {
            let formattedRequest = JSON.parse(requestData);
            let authCheck = socketVerifyJWT_MW(formattedRequest.data);
            let responseData;

            /*
            - auth, - userId, - bookingId - riderId - lat - lng - rotation
            */

            if (authCheck && authCheck.status === 200) {
                if (formattedRequest && formattedRequest.data && formattedRequest.data.riderId
                    && formattedRequest.data.lat && formattedRequest.data.lng && formattedRequest.data.bookingId) {
                    // Prepare response data
                    responseData = {
                        status: 200,
                        data: {
                            id: formattedRequest.data.riderId,
                            driverLat: formattedRequest.data.lat,
                            driverLng: formattedRequest.data.lng,
                            rotation: formattedRequest.data.rotation,
                            bookingId: formattedRequest.data.bookingId,
                            locationUpdate: true
                        }
                    };
                    // Request to rider with the driver's live location
                    io.emit('tripRequest-' + responseData.data.id, { data: responseData });
                } else {
                    io.emit(formattedRequest.data.userId, { // Request to Driver(Required information missing)
                        data: {
                            status: 400,
                            errorMessage: "Oops! Something went wrong. Please check your internet connection and try again!",
                            data: null
                        }
                    });
                }
            } else {
                io.emit(formattedRequest.data.userId, { // Request to Driver(Authentical Fail)
                    data: authCheck
                });
            }
        });

        /*****
        * The driver starts the trip
        *****/
        socket.on('tripStart', async function (requestData) {
            let formattedRequest = JSON.parse(requestData);
            let authCheck = socketVerifyJWT_MW(formattedRequest.data);
            let responseData;


            if (authCheck && authCheck.status === 200) {
                responseData = await tripStart(formattedRequest);

                if (responseData && responseData.status === 200) {
                    io.emit('tripStart-' + responseData.data.id, { data: responseData }); // Request to Rider with driver information
                } else {
                    io.emit('tripStart-' + formattedRequest.data.userId, { data: responseData }); // Request to Driver(Error Reponse)
                }
            } else {
                io.emit('tripStart-' + formattedRequest.data.userId, { // Request to Driver(Authentical Fail)
                    data: authCheck
                });
            }
        });

        /*****
        * The rider cancels the trip
        *****/
        socket.on('riderCancel', async function (requestData) {
            let formattedRequest = JSON.parse(requestData);
            let authCheck = socketVerifyJWT_MW(formattedRequest.data);
            let responseData;

            if (authCheck && authCheck.status === 200) {
                responseData = await tripCancel(formattedRequest, 'cancelledByRider');

                if (responseData && responseData.status === 200) {
                    io.emit('riderCancel-' + responseData.data.id, { data: responseData }); // Request to Driver for the rider cancels the trip
                } else {
                    io.emit('riderCancel-' + formattedRequest.data.userId, { data: responseData }); // Request to Rider(Error Reponse)
                }
            } else {
                io.emit('riderCancel-' + formattedRequest.data.userId, { // Request to Rider(Authentical Fail)
                    data: authCheck
                });
            }
        });

        /*****
        * The driver cancel the trip
        *****/
        socket.on('driverCancel', async function (requestData) {
            let formattedRequest = JSON.parse(requestData);
            let authCheck = socketVerifyJWT_MW(formattedRequest.data);
            let responseData;

            if (authCheck && authCheck.status === 200) {
                responseData = await tripCancel(formattedRequest, 'cancelledByDriver');

                if (responseData && responseData.status === 200) {
                    io.emit('driverCancel-' + responseData.data.id, { data: responseData }); // Request to rider for the driver cancels the trip
                } else {
                    io.emit('driverCancel-' + formattedRequest.data.userId, { data: responseData }); // Request to the driver(Error Reponse)
                }
            } else {
                io.emit('driverCancel-' + formattedRequest.data.userId, { // Request to driver(Authentical Fail)
                    data: authCheck
                });
            }
        });

        /*****
        * The Driver completes the trip 
        *****/
        socket.on('tripComplete', async function (requestData) {
            let formattedRequest = JSON.parse(requestData);
            let authCheck = socketVerifyJWT_MW(formattedRequest.data);
            let responseData;

            if (authCheck && authCheck.status === 200) {
                responseData = await tripComplete(formattedRequest);

                if (responseData && responseData.status === 200) {
                    io.emit('tripComplete-' + responseData.data.id, { data: responseData }); // Request to rider for the driver completes the trip
                    io.emit('tripComplete-' + responseData.data.driverId, { data: responseData }); // Request to driver for that they complete the trip
                } else {
                    io.emit('tripComplete-' + formattedRequest.data.userId, { data: responseData }); // Request to the driver(Error Reponse)
                }
            } else {
                io.emit('tripComplete-' + formattedRequest.data.userId, { // Request to driver(Authentical Fail)
                    data: authCheck
                });
            }
        });

        /*****
        * The rider auto cancels the trip request
        *****/
        socket.on('autoCancel', async function (requestData) {
            let formattedRequest = JSON.parse(requestData);
            let authCheck = socketVerifyJWT_MW(formattedRequest.data);
            let responseData;

            if (authCheck && authCheck.status === 200) {
                responseData = await autoCancel(formattedRequest);

                if (responseData && responseData.status === 200) {
                    io.emit('autoCancel-' + responseData.data.id, { data: responseData }); // Request to the rider(Success response)
                } else {
                    io.emit('autoCancel-' + formattedRequest.data.userId, { data: responseData }); // Request to the rider(Error Reponse)
                }

            } else {
                io.emit('autoCancel-' + formattedRequest.data.userId, { // Request to Rider(Authentical Fail)
                    data: authCheck
                });
            }
        });

        /*****
        * Check the logged-in user with the connected device(recent) and logouts on the early connected devices(old) 
        *****/
        socket.on('loginCheck', async function (requestData) {
            let formattedRequest = JSON.parse(requestData);
            let authCheck = socketVerifyJWT_MW(formattedRequest.data);
            let responseData;

            if (authCheck && authCheck.status === 200) {
                responseData = await loginCheck(formattedRequest);
                if (responseData && responseData.status === 200) {
                    io.emit('loginCheck-' + responseData.data.userId, { data: responseData }); // Request to the user(Success response)
                } else {
                    io.emit('loginCheck-' + formattedRequest.data.userId, { data: responseData }); // Request to the user(Error Reponse)
                }
            } else {
                io.emit('loginCheck-' + formattedRequest.data.userId, { // Request to user(Authentical Fail)
                    data: authCheck
                });
            }
        });

        /*****
        * Cancel the requesting trip request by Rider
        *****/
        socket.on('cancelTripRequest', async function (requestData) {
            let formattedRequest = JSON.parse(requestData);
            let authCheck = socketVerifyJWT_MW(formattedRequest.data);
            let responseData;

            if (authCheck && authCheck.status === 200) {
                responseData = await cancelTripRequest(formattedRequest);
                if (responseData && responseData.status === 200) {
                    io.emit('cancelTripRequest-' + responseData.data.id, { data: responseData }); // Request to rider for cancelled the trip request
                    if (responseData.data && responseData.data.driverId) {
                        io.emit('cancelTripRequest-' + responseData.data.driverId, { data: responseData }); // Request to driver for cancelled the trip request
                    }
                } else {
                    io.emit('cancelTripRequest-' + formattedRequest.data.userId, { data: responseData }); // Request to the user(Error Reponse)
                }
            } else {
                io.emit('cancelTripRequest-' + formattedRequest.data.userId, { // Request to user(Authentical Fail)
                    data: authCheck
                });
            }
        });
    });
};

export default connection;
