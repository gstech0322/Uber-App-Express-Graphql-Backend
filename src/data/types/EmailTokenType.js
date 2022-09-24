import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
  } from 'graphql';
  
  import ProfileType from './ProfileType';
  import {UserProfile} from '../models';
  
  const EmailTokenType = new ObjectType({
    name: 'emailToken',
    fields: {
      id: { type: StringType },
      userId: { type: StringType },
      profile: {
        type: ProfileType,
        resolve (emailToken) {
          return UserProfile.findOne({
            where: { userId: emailToken.userId}
          });
        }
      },
      token: { type: StringType },
      email: { type: StringType },
      createdAt: { type: StringType },
      status: {type: StringType},
    },
  });
  
  export default EmailTokenType;