import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType
} from 'graphql';

import { User, Reviews, Vehicles } from '../models';

import UserType from './UserType';
import VehicleType from './VehicleType';

const Profile = new ObjectType({
  name: 'userProfile',
  fields: {
    userId: {
      type: StringType,
    },
    userData: {
      type: UserType,
      async resolve(profile) {
        return await User.findOne({
          where: { id: profile.userId },
        });
      },
    },
    // userVerification: {
    //   type: UserVerifiedInfoType,
    //   resolve(profile) {
    //     return UserVerifiedInfo.findOne({
    //       where: { userId: profile.userId },
    //     });
    //   },
    // },
    reviewsCount: {
      type: IntType,
      async resolve(profile) {
        return await Reviews.count({
          where: {
            userId: profile.userId
          }
        });
      }
    },
    profileId: {
      type: IntType,
    },
    firstName: {
      type: StringType,
    },
    lastName: {
      type: StringType,
    },
    displayName: {
      type: StringType,
    },
    dateOfBirth: {
      type: StringType,
    },
    picture: {
      type: StringType,
    },
    location: {
      type: StringType,
    }, 
    info: {
      type: StringType,
    },
    createdAt: {
      type: StringType,
    },
    vehicleDetails: {
      type: VehicleType,
      async resolve(vehicle) {
        return await Vehicles.findOne({
          where: { 
            userId: vehicle.userId,
            vehicleStatus: 'active'
          },
        });
      },
    }
  },
});

export default Profile;
