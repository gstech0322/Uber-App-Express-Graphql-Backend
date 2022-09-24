import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType
  } from 'graphql';

import UserAccountType from './userAccountType';

  const WholeAccountType = new ObjectType({
    name: 'WholeAccount',
    fields: {
      result: {
        type: UserAccountType
      },
      status: { type: IntType },
      errorMessage: { type: StringType }
    },
  });

  export default WholeAccountType;
