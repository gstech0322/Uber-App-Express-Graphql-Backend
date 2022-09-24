import {
    GraphQLSchema as Schema,
    GraphQLObjectType as ObjectType,
} from 'graphql';

// Users
import validateEmailExist from './queries/Users/validateEmailExist';
import createUser from './mutations/Users/createUser';
import userLogin from './queries/Users/userLogin';
import userLogout from './mutations/Users/userLogout';
import userAccount from './queries/Users/userAccount';
import userUpdate from './mutations/Users/userUpdate';
import userForgotPassword from './mutations/Users/userForgotPassword';
import verifyForgotPassword from './queries/Users/verifyForgotPassword';
import updateForgotPassword from './mutations/Users/updateForgotPassword';
import userUpdateCommon from './mutations/Users/userUpdateCommon';
import ResendConfirmEmail from './queries/Users/ResendConfirmEmail';
import showUserProfile from './queries/Users/showUserProfile';
import testToken from './mutations/Users/testToken';
import loginCheck from './queries/Users/loginCheck';

// Sms Verification
import sendVerificationSms from './mutations/SmsVerification/sendVerificationSms';
import verifyPhoneNumber from './mutations/SmsVerification/verifyPhoneNumber';

import getCategories from './queries/Category/getCategories';

// Driver status
import updateDriverstatus from './mutations/Users/updateDriverstatus';
import updateDriverLocation from './mutations/Users/updateDriverLocation';

import updateUserPassword from './mutations/Users/updateUserPassword';
import updateProfileSettings from './mutations/Users/updateProfileSettings';

// Rider update information
import updatePaymentMethod from './mutations/Users/updatePaymentMethod';

// Add card details
import addCardDetails from './mutations/Payment/addCardDetails';
import removeCardDetails from './mutations/Payment/removeCardDetails';
import confirmSetupIntent from './mutations/Payment/confirmSetupIntent';
import confirmPaymentIntent from './mutations/Payment/confirmPaymentIntent';

// Payment details
import tripCalculation from './mutations/PaymentCalculation/tripCalculation';

// Country
import getAllCountries from './queries/Countries/getAllCountries';
import getAllCurrencies from './queries/Currencies/getAllCurrencies';

// Currency
import currency from './queries/Currencies/Currency';

// Driver payouts
import setDefaultPayout from './mutations/Payout/setDefaultPayout';
import addPayout from './mutations/Payout/addPayout';
import getPayouts from './queries/Payout/getPayouts';
import getPaymentMethods from './queries/Payout/getPaymentMethods';
import verifyPayout from './mutations/Payout/verifyPayout';
import confirmPayout from './mutations/Payout/confirmPayout';

// Reviews
import WriteReviews from './mutations/Reviews/WriteReviews';

// History
import getBookings from './queries/BookingHistory/getBookings';
import TripDetails from './queries/BookingHistory/TripDetails';

// Booking
import GetNearestDrivers from './queries/Booking/GetNearestDrivers';
import GetTripStatus from './queries/Booking/GetTripStatus';
import TotalBooking from './queries/Booking/TotalBooking';
import createBooking from './queries/Booking/createBooking';
import declineBooking from './queries/Booking/declineBooking';
import acceptBooking from './mutations/Booking/acceptBooking';
import startBooking from './mutations/Booking/startBooking';
import cancelBooking from './mutations/Booking/cancelBooking';
import completeBooking from './mutations/Booking/completeBooking';
import autoCancel from './mutations/Booking/autoCancel';
import cancelBookingRequest from './mutations/Booking/cancelBookingRequest';
import createScheduleBooking from './mutations/Booking/createScheduleBooking';
import cancelScheduleBooking from './mutations/Booking/cancelScheduleBooking';
import updateScheduleBooking from './mutations/Booking/updateScheduleBooking';

// Earnings
import getTotalEarning from './queries/Earnings/getTotalEarning';

// Saved Locations
import addSavedLocations from './mutations/SavedLocations/addSavedLocations';
import getAllSavedLocations from './queries/SavedLocations/getAllSavedLocations';
import removeSavedLocations from './mutations/SavedLocations/removeSavedLocations';

// Wallet
import addWallet from './mutations/Wallet/addWallet';

// Emergency Contact
import addEmergencyContact from './mutations/EmergencyContact/addEmergencyContact';
import shareLiveLocations from './mutations/EmergencyContact/shareLiveLocations';
import deleteEmergencyContact from './mutations/EmergencyContact/deleteEmergencyContact';

// Promocode
import addPromoCode from './mutations/PromoCode/addPromoCode';
import getPromoCode from './queries/PromoCode/getPromoCode';
import validatePromoCode from './mutations/PromoCode/validatePromoCode';

//cancel reason
import getCancelReason from './queries/CancelReason/getCancelReason';
import addCancelReason from './mutations/CancelReason/addCancelReason';

// Mobile app version
import getApplicationVersionInfo from './queries/SiteSettings/getApplicationVersionInfo';

// Schedule a ride
import editScheduleBooking from './mutations/ScheduleRide/editScheduleBooking';

// Static page
import getStaticPageContent from './queries/StaticPage/getStaticPageContent';

//PrecautionNotification
import getPrecautionNotification from './queries/PrecautionNotification/getPrecautionNotification';

const schema = new Schema({
    query: new ObjectType({
        name: 'Query',
        fields: {
            validateEmailExist,
            userLogin,
            userAccount,
            verifyForgotPassword,
            showUserProfile,
            ResendConfirmEmail,
            getCategories,
            getAllCountries,
            getAllCurrencies,
            getPayouts,
            getPaymentMethods,
            currency,
            GetTripStatus,
            GetNearestDrivers,
            getBookings,
            TripDetails,
            TotalBooking,
            createBooking,
            declineBooking,
            loginCheck,
            getTotalEarning,
            getAllSavedLocations,
            getPromoCode,
            getCancelReason,
            getApplicationVersionInfo,
            getPrecautionNotification,
            getStaticPageContent
        },
    }),
    mutation: new ObjectType({
        name: 'Mutation',
        fields: {
            createUser,
            userLogout,
            userUpdate,
            userForgotPassword,
            updateForgotPassword,
            userUpdateCommon,
            sendVerificationSms,
            verifyPhoneNumber,
            updateDriverstatus,
            updateDriverLocation,
            updateUserPassword,
            updateProfileSettings,
            updatePaymentMethod,
            addCardDetails,
            testToken,
            removeCardDetails,
            tripCalculation,
            setDefaultPayout,
            addPayout,
            WriteReviews,
            acceptBooking,
            startBooking,
            cancelBooking,
            completeBooking,
            autoCancel,
            addSavedLocations,
            cancelBookingRequest,
            removeSavedLocations,
            addWallet,
            addEmergencyContact,
            shareLiveLocations,
            deleteEmergencyContact,
            addPromoCode,
            validatePromoCode,
            addCancelReason,
            confirmSetupIntent,
            confirmPaymentIntent,
            verifyPayout,
            confirmPayout,
            editScheduleBooking,
            createScheduleBooking,
            cancelScheduleBooking,
            updateScheduleBooking
        }
    })
});

export default schema;