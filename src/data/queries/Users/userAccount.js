import { User, UserProfile, UserLogin, Payout } from '../../models';

import WholeAccountType from '../../types/WholeAccountType';

const userAccount = {

  type: WholeAccountType,

  async resolve({ request, response }) {

    let currentToken, where;

    try {
      if (request.user) {

        //Collect from Logged-in User
        let userId = request.user.id;
        currentToken = request.headers.auth;
        where = {
          userId: request.user.id,
          key: currentToken
        };

        const checkLogin = await UserLogin.findOne({
          attributes: ['id'],
          where
        });

        if (checkLogin) {

          // Get All User Profile Data
          const userProfile = await UserProfile.findOne({
            attributes: [
              'profileId',
              'firstName',
              'lastName',
              'picture',
              'lat',
              'lng',
              'state',
              'city',
              'zipcode',
              'country',
              'preferredCurrency',
              'preferredLanguage',
              'preferredPaymentMethod',
              'paymentCustomerId',
              'licenceFront',
              'licenceBack',
              'cardLastFour',
              'cardToken',
              'sourceId',
              'walletBalance',
              'walletUsed'
            ],
            where: { userId },
            raw: true
          });

          const user = await User.findOne({
            attributes: [
              'id', 'email', 'isBan', 'phoneNumber', 'phoneDialCode', 'phoneCountryCode', 
              'isActive', 'userStatus', 'userType', 
            ],
            where: {
              id: userId,
              deletedAt: null
            },
            order: [[`createdAt`, `DESC`]],
            raw: true
          });

          const getPayout = await Payout.findOne({
            attributes: ['id', 'methodId'],
            where: {
              userId,
            },
            raw: true
          });

         let isPayout = (getPayout && getPayout.methodId && getPayout.methodId !='')?true:false;

          if (userProfile && user && !user.isBan) {

            return {
              result: {
                userId: request.user.id,
                profileId: userProfile.profileId,
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                email: user.email,
                picture: userProfile.picture,
                state: userProfile.state,
                city: userProfile.city,
                zipcode: userProfile.zipcode,
                country: userProfile.country,
                licenceFront: userProfile.licenceFront,
                licenceBack: userProfile.licenceBack,
                isBan: user.isBan,
                preferredCurrency: userProfile.preferredCurrency,
                preferredLanguage: userProfile.preferredLanguage,
                phoneNumber: user.phoneNumber,
                isActive: user.isActive,
                phoneDialCode: user.phoneDialCode,
                phoneCountryCode: user.phoneCountryCode,
                userStatus: user.userStatus,
                userType: user.userType,
                cardLastFour: userProfile.cardLastFour,
                cardToken: userProfile.cardToken,
                sourceId: userProfile.sourceId,
                preferredPaymentMethod: userProfile.preferredPaymentMethod,
                walletBalance: (userProfile.walletBalance && userProfile.walletBalance.toFixed(2)) || 0,
                walletUsed: (userProfile.walletUsed && userProfile.walletUsed.toFixed(2)) || 0,
                isPayout
              },
              status: 200
            }
          } else {
            if (!userProfile) {
              return {
                status: 500,
                errorMessage: 'Something went wrong with your profile. Please contact support.'
              }
            } else {
              return {
                status: 500,
                errorMessage: 'Something went wrong. Please contact support.'
              }
            }
          }
        } else {
          return {
            errorMessage: "You haven't authorized for this action.",
            status: 500
          };
        }
      } else {
        return {
          status: 500,
          errorMessage: 'You must login to get your profile information.'
        }
      }

    } catch (error) {
      return {
        errorMessage: 'Something went wrong' + error,
        status: 400
      };
    }
  }
};

export default userAccount;

/*
query {
  userAccount {
    result {
      userId
      profileId
      firstName
      lastName
      email
      picture
      state
      city
      zipcode
      country
      licenceFront
      licenceBack
      isBan
      preferredCurrency
      preferredLanguage
      phoneNumber
      isActive
      phoneDialCode
      userStatus
      walletBalance
      walletUsed
      userType
        verification {
        id
        isEmailConfirmed
        isLicenseFrontVerified
        isLicenseBackVerified
      }
      vehicles{
        id
        vehicleRC
        vehicleInsurance
      }
    }
    status
    errorMessage
  }
}
*/
