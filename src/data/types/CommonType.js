import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType
} from 'graphql';

const CommonType = new ObjectType({
  name: 'CommonType',
  fields: {
    errorMessage: { type: StringType },
    status: { type: IntType }
  },
});

export default CommonType;
