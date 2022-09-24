import express from 'express';
import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import PrettyError from 'pretty-error';

// configurations
import { auth, port, environment, socketPort } from './config';

// GraphQL
import models from './data/models';
import schema from './data/schema';
import pushNotificationRoutes from './libs/pushNotification/pushNotificationRoutes';
import licenseUpload from './libs/upload/licenseUpload';

// JWT Auth Middleware
import { verifyJWT_MW } from './libs/middleware';

// Twilio SMS
import TwilioSms from './libs/sms/twilio/sendSms';
import vehicleUpload from './libs/upload/vehicleUpload';
import profilePhotoUpload from './libs/upload/profilePhotoUpload';

// Websocket Connections
import connection from './Websocket/connection';

// CRON
import currencyCron from './core/cron/currencyCron';
import tripAutoCancelCron from './core/cron/tripAutoCancelCron';
import deleteCategoryImage from './core/cron/delete-static-images/deleteCategoryImage';
import deleteHomepageImage from './core/cron/delete-static-images/deleteHomepageImage';
import deleteSiteLogoImage from './core/cron/delete-static-images/deleteSiteLogoImage';
import deleteStaticPageImage from './core/cron/delete-static-images/deleteStaticPageImage';
import deleteContentPageImage from './core/cron/delete-static-images/deleteContentPageImage';
import scheduleRide from './core/cron/scheduleRideCron/scheduleBookingCron';

// Admin Panel Image upload
import categoryImageUpload from './libs/upload/site-admin/categoryImageUpload'
import categoryMarkerUpload from './libs/upload/site-admin/categoryMarkerUpload'
import profileImageUpload from './libs/upload/site-admin/profileImageUpload'
import licenceImageUpload from './libs/upload/site-admin/licenceImageUpload'
import insuranceImageUpload from './libs/upload/site-admin/insuranceImageUpload'
import rcbookImageUpload from './libs/upload/site-admin/rcbookImageUpload'
import logoUpload from './libs/upload/site-admin/logoUpload'
import homepageImageUpload from './libs/upload/site-admin/homepageImageUpload'
import staticPageBannerUpload from './libs/upload/site-admin/staticPageBannerUpload'
import contentPageBannerUpload from './libs/upload/site-admin/contentPageBannerUpload';


// Testing
import { tripRequest } from './Websocket/helpers/tripRequest';
import { tripDecline } from './Websocket/helpers/tripDecline';
import { sendNotifications } from './helpers/push-notification/sendNotifications';

// Socket notification routes
import socketNotificationRoutes from './Websocket/socketNotificationRoutes';

const app = express();
const __DEV__ = environment;
app.use(compression());

app.use('/images', express.static(path.join(__dirname, '../images')));

// Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Authentication
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, cache-control, Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.use(expressJwt({
    secret: auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.headers.authToken,
}));

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.send({
            status: 400,
            errorMessage: 'Invalid auth token provided.'
        });
        next();
    }
});

app.use(verifyJWT_MW);

if (__DEV__) {
    app.enable('trust proxy');
}

pushNotificationRoutes(app);
TwilioSms(app);
licenseUpload(app);
vehicleUpload(app);
profilePhotoUpload(app);
logoUpload(app);


// Currency rates CRON
currencyCron(app);
tripAutoCancelCron(app);

//Images Delete Cron
deleteCategoryImage(app);
deleteHomepageImage(app);
deleteSiteLogoImage(app);
deleteStaticPageImage(app);
deleteContentPageImage(app);

// Admin panel
categoryImageUpload(app);
profileImageUpload(app)
licenceImageUpload(app)
insuranceImageUpload(app)
rcbookImageUpload(app)
categoryMarkerUpload(app)
homepageImageUpload(app)
staticPageBannerUpload(app)
contentPageBannerUpload(app)



// Express GraphQL 
const graphqlMiddleware = expressGraphQL((req, res) => ({
    schema,
    graphiql: __DEV__,
    rootValue: {
        request: req,
        response: res
    },
    pretty: __DEV__,
}));

app.use('/graphql', graphqlMiddleware);

// WebSocket Connection 
let server = app.listen(socketPort);
let socketio = require('socket.io')(server);



// WebSocket Testing HTML File
app.get('/', function(req, res) {
    if (__DEV__) {
        console.log('__dirname', __dirname)
        app.use('/socket-helpers', express.static(path.join(__dirname, './helpers/socket-development')));
        res.sendFile(__dirname + '/helpers/socket-development/index.html');
    } else {
        res.send("<p>Hey Buddy! <br /> Do you want any information! Just try it yourself!<p>")
    }
});

connection(app, socketio);

//scheduleRide
scheduleRide(app)
socketNotificationRoutes(app, socketio)

app.post('/check', async function(req, res) {
    let request = {
        requestStatus: 'request',
        data: {
            auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRiMDNkNmYwLTQ2NjMtMTFlYS1hMmU1LTgzNjRkYmZhMGE0ZiIsImVtYWlsIjoiYXN3aW4xMjNAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiI4MTQ4NTI0MjI0IiwiaWF0IjoxNTg3NTQ1Mjk3LCJleHAiOjE2MDMwOTcyOTd9.Sf4Cw3uGtKzEgqpIgkmxe6cV3sKKlATJ9CA054hIsZU",
            lang: "es",
            userId: 'db03d6f0-4663-11ea-a2e5-8364dbfa0a4f',
            riderLocation: '563, 80 Feet Rd, Anna Nagar, Sathamangalam, Madurai, Tamil Nadu 625020, India',
            riderLocationLat: 9.9205003,
            riderLocationLng: 78.1488813,
            pickUpLocation: '563, 80 Feet Rd, Anna Nagar, Sathamangalam, Madurai, Tamil Nadu 625020, India',
            // pickUpLat: 9.9413012, // Saravnan
            // pickUpLng: 78.1229816,
            pickUpLat: 9.9249374, // KFC
            pickUpLng: 78.1466836,
            dropOffLocation: 'Madurai, Tamil Nadu, India',
            dropOffLat: 9.9252007,
            dropOffLng: 78.1197754,
            rideDistance: 10,
            rideDuration: 10,
            category: 4,
            deviceId: "123456",
            deviceType: "Android",
            promoId: null,
            paymentType: 1
        }
    };

    /* Response */
    /*

    {
  "status": 200,
  "errorMessage": null,
  "data": {
    "id": "50248300-fa18-11e9-8172-69fcf98f8101",
    "name": "karthik nathan",
    "userId": "62759b90-fa16-11e9-8172-69fcf98f8101",
    "picture": null,
    "phoneNumber": "+919894230865",
    "riderLocation": "563, 80 Feet Rd, Anna Nagar, Sathamangalam, Madurai, Tamil Nadu 625020, India",
    "riderLocationLat": 9.9205003,
    "riderLocationLng": 78.1488813,
    "pickUpLocation": "563, 80 Feet Rd, Anna Nagar, Sathamangalam, Madurai, Tamil Nadu 625020, India",
    "pickUpLat": 9.9205003,
    "pickUpLng": 78.1488813,
    "dropOffLocation": "Madurai, Tamil Nadu, India",
    "dropOffLat": 9.9252007,
    "dropOffLng": 78.1197754,
    "bookingId": 8,
    "category": 1,
    "overallRating": null
  }
}
*/

    const data = await tripRequest(request);

    console.log('data', data);
    res.send(data);
});

app.post('/check-decline', async function(req, res) {

    let request = {
        requestStatus: 'decline',
        data: {
            auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwMjQ4MzAwLWZhMTgtMTFlOS04MTcyLTY5ZmNmOThmODEwMSIsImVtYWlsIjoidW1hQHJhZGljYWxzdGFydC5jb20iLCJwaG9uZU51bWJlciI6IjcwMTA1Mjk4OTMiLCJpYXQiOjE1NzI0NTMwMTEsImV4cCI6MTU4ODAwNTAxMX0.bxiwBiyO0REt7VJOfi3HUvuKL8yecH_jE7wRepHEFfw',
            userId: '50248300-fa18-11e9-8172-69fcf98f8101',
            bookingId: 1,
            riderId: '62759b90-fa16-11e9-8172-69fcf98f8101'
        }
    };
    const data = await tripDecline(request);

    console.log('data', data);
    res.send(data);
});

app.post('/push-notification-check', async function(req, res) {
    let content = {
        "data": {
            "tripStatus": "accept",
            "notificationId": 8848423,
            "message": "Trip is Accepted",
            "name": "karthik nathan",
            "userId": "62759b90-fa16-11e9-8172-69fcf98f8101",
            "riderId": "62759b90-fa16-11e9-8172-69fcf98f8101",
            "picture": null,
            "phoneNumber": "+919894230865",
            "riderLocation": "563, 80 Feet Rd, Anna Nagar, Sathamangalam, Madurai, Tamil Nadu 625020, India",
            "riderLocationLat": 9.9205003,
            "riderLocationLng": 78.1488813,
            "pickUpLocation": "563, 80 Feet Rd, Anna Nagar, Sathamangalam, Madurai, Tamil Nadu 625020, India",
            "pickUpLat": 9.9205003,
            "pickUpLng": 78.1488813,
            "dropOffLocation": "Madurai, Tamil Nadu, India",
            "dropOffLat": 9.9252007,
            "dropOffLng": 78.1197754,
            "bookingId": 8,
            "category": 1,
            "overallRating": null
        }

    };

    let userId = '1c480030-0f5c-11ea-a0d1-e52d223bb23c';

    const data = await sendNotifications('tripRequest', content, userId);

    res.send(data);
});

app.get('/user/payout/:status', async function(req, res) {
        res.send('  ')
    })
    // Error Handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// Server launch
models.sync().catch(err => console.log(err.stack)).then(() => {
    app.listen({ port: 4000 }, () =>
        console.log(`Server ready at http://localhost:4000`),
    )
});