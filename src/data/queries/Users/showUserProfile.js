import ShowUserProfileCommonType from '../../types/ShowUserProfileType';
import { UserProfile } from '../../models';

import {
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType,
} from 'graphql';

const showUserProfile = {

  type: ShowUserProfileCommonType,

  args: {
    profileId: { type: IntType },
    isUser: { type: BooleanType },
  },

  async resolve({ request }, { profileId, isUser }) {
    try{
    let where;
    if(isUser) {
      let userId = request.user.id;
      where = {
        userId
      };
    } else {
      where = {
        profileId
      };
    }

    // Get All User Profile Data
    const userData = await UserProfile.find({
      attributes: [
        'userId',
        'profileId',
        'firstName',
        'lastName',
        'dateOfBirth',
        'gender',
        'phoneNumber',
        'preferredLanguage',
        'preferredCurrency',
        'location',
        'info',
        'createdAt',
        'picture'
      ],
      where
    });
    
    if(userData){
        return {
            status: 200,
            results: userData
        };
    }else{
        return {
            status: 400,
            errorMessage: 'Something went wrong',
        };
    }
    
    
    } catch(error) {
        return {
            errorMessage: 'Something went wrong'+ error,
            status: 400
        }
    }

  },
};

export default showUserProfile;
