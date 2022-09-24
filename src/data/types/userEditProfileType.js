import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BooleanType
} from 'graphql';

import { Vehicles } from '../models';
import VehicleType from './VehicleType';

const UserEditProfile = new ObjectType({
  name: 'userEditProfile',
  fields: {
    userId: { type: ID },
    firstName: { type: StringType },
    lastName: { type: StringType },
    gender: { type: StringType },
    dateOfBirth: { type: StringType },
    email: { type: StringType },
    phoneNumber: { type: StringType },
    phoneDialCode: { type: StringType },
    preferredLanguage: { type: StringType },
    preferredCurrency: { type: StringType },
    location: { type: StringType },
    info: { type: StringType },
    status: { type: StringType },
    country: { type: StringType },
    city: { type: StringType },
    state: { type: StringType },
    zipcode: { type: StringType },
    verificationCode: { type: IntType },
    licenceFront: { type: StringType },
    licenceBack: { type: StringType },
    profileId: { type: IntType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    overallRating: { type: FloatType },
    phoneCountryCode: { type: StringType },
    walletUsed: { type: FloatType },
    walletBalance: { type: FloatType },
    picture: {
      type: StringType,
    },
    createdAt: {
      type: StringType
    },
    displayName: {
      type: StringType,
    },
    countryCode: { type: StringType },
    preferredPaymentMethod: {
      type: BooleanType
    },
    licenceFrontName: {
      type: StringType,
      async resolve(account) {
        let name = account.licenceFront ? 'images/license/' + account.licenceFront : '';
        return name;
      }
    },
    licenceBackName: {
      type: StringType,
      async resolve(account) {
        let name = account.licenceBack ? 'images/license/' + account.licenceBack : '';
        return name;
      }
    },
    vehicles: {
      type: VehicleType,
      async resolve(userProfile) {
        return await Vehicles.findOne({ where: { userId: userProfile.userId } });
      }
    },
  },
});

export default UserEditProfile;
