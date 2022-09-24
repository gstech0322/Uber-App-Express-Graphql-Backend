import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BooleanType
} from 'graphql';
import { UserProfile, UserVerifiedInfo, User } from '../models';

import UserEditProfile from './userEditProfileType';

const UserType = new ObjectType({
  name: 'UserType',
  fields: {
    id: { type: new NonNull(ID) },
    email: { type: StringType },
    emailConfirmed: { type: BooleanType },
    type: { type: StringType },
    userBanStatus: { type: IntType },
    status: { type: IntType },
    errorMessage: { type: StringType },
    userId: { type: StringType },
    userToken: { type: StringType },
    forgotLink: { type: StringType },
    firstName: { type: StringType },
    lastName: { type: StringType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    gender: { type: StringType },
    dateOfBirth: { type: StringType },
    phoneNumber: { type: StringType },
    phoneCountryCode: { type: StringType },
    phoneDialCode: { type: StringType },
    overallRating: { type: FloatType },
    deviceId: { type: StringType },
    deviceType: { type: StringType },
    user: {
      type: UserEditProfile,
      async resolve(user) {
        return await UserProfile.findOne({
          where: {
            userId: user.userId
          }
        })
      }
    },

  },
});

export default UserType;
