import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
    GraphQLList as List
} from 'graphql';

import UserVerifiedInfoType from './UserVerifiedInfoType';
import UserType from './UserType';
import UserEditProfile from './userEditProfileType';
import PaymentMethodsType from './PaymentMethodsType';
import SavedLocationsType from './SavedLocationsType';
import EmergencyContactType from './EmergencyContactType';

import {
    UserVerifiedInfo,
    User,
    Listing,
    Vehicles,
    UserProfile,
    Payout,
    PaymentMethods,
    SavedLocations,
    EmergencyContact
} from '../models';
import VehicleType from './VehicleType';

const UserAccountType = new ObjectType({
    name: 'UserAccount',
    fields: {
        userId: {type: ID},
        profileId: {type: IntType},
        firstName: {type: StringType},
        lastName: {type: StringType},
        displayName: {type: StringType},
        gender: {type: StringType},
        dateOfBirth: {type: StringType},
        iosDOB: {
            type: StringType,
            async resolve(account) {
                var array = account.dateOfBirth.split("-");
                return array[0] + '-' + array[2] + '-' + array[1];
            }
        },
        email: {type: StringType},
        userBanStatus: {type: IntType},
        phoneNumber: {type: StringType},
        phoneCountryCode: {type: StringType},
        preferredLanguage: {type: StringType},
        preferredLanguageName: {type: StringType},
        preferredCurrency: {type: StringType},
        location: {type: StringType},
        info: {type: StringType},
        createdAt: {type: StringType},
        userDeletedAt: {type: StringType},
        picture: {type: StringType},
        preferredPaymentMethod: {type: IntType},
        overallRating: {type: FloatType},
        isPayout: {type: BooleanType},
        verification: {
            type: UserVerifiedInfoType,
            async resolve(userProfile) {
                return await UserVerifiedInfo.findOne({where: {userId: userProfile.userId}});
            }
        },
        vehicles: {
            type: VehicleType,
            async resolve(userProfile) {
                return await Vehicles.findOne({where: {userId: userProfile.userId}});
            }
        },
        userData: {
            type: UserType,
            async resolve(userProfile) {
                return await User.findOne({where: {id: userProfile.userId}});
            }
        },
        country: {type: StringType},
        verificationCode: {type: IntType},
        countryCode: {type: StringType},
        status: {type: IntType},
        errorMessage: {type: StringType},
        state: {type: StringType},
        city: {type: StringType},
        zipcode: {type: StringType},
        licenceFront: {type: StringType},
        licenceBack: {type: StringType},
        isActive: {type: BooleanType},
        userStatus: {type: StringType},
        userType: {type: IntType},
        isBan: {type: BooleanType},
        cardLastFour: {type: IntType},
        cardToken: {type: StringType},
        sourceId: {type: StringType},
        walletUsed: {type: FloatType},
        walletBalance: {type: FloatType},
        requireAdditionalAction: {type: BooleanType},
        paymentIntentSecret: {type: StringType},
        paymentIntent: {type: StringType},
        paymentIntentId: {type: StringType},
        loginUserType: {
            type: StringType,
            async resolve(userProfile, {}, request) {
                let userId = (request && request.user) ? request.user.id : undefined;
                let count = await Listing.count({
                    where: {
                        userId
                    },
                });
                return (count) ? 'Host' : 'Guest';
            }
        },
        isAddedList: {
            type: BooleanType,
            async resolve(userProfile, {}, request) {
                let userId = (request && request.user) ? request.user.id : undefined;
                let count = await Listing.count({
                    where: {
                        userId
                    },
                });
                return (count) ? true : false;
            }
        },
        phoneDialCode: {type: StringType},
        auth: {type: StringType},
        account: {
            type: UserEditProfile,
            async resolve(userProfile) {
                return await UserProfile.findOne({where: {userId: userProfile.userId}});
            }
        },
        payout: {
            type: StringType,
            async resolve(userProfile) {
                return await Payout.count({where: {userId: userProfile.userId}});
            }
        },
        paymentDetails: {
            type: PaymentMethodsType,
            async resolve(userProfile) {
                return await PaymentMethods.findAll({});
            }
        },

        savedLocations: {
            type: new List(SavedLocationsType),
            async resolve(userProfile) {
                return await SavedLocations.findAll({
                    where: {
                        userId: userProfile.userId
                    }
                });
            }
        },

        emergencyContacts: {
            type: new List(EmergencyContactType),
            async resolve(userProfile) {
                return await EmergencyContact.findAll({
                    where: {
                        userId: userProfile.userId
                    },
                    limit: 5
                });
            }
        }
    },
});

export default UserAccountType;
