import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType
} from 'graphql';


const CancelReasonListType = new ObjectType({
  name: 'CancelReason',
  fields: {
    id: {
      type: StringType
    },

    userType: {
      type: IntType
    },

    reason: {
      type: StringType
    },

    status: {
      type: StringType
    },

    errorMessage: {
      type: StringType
    },

    isActive:{
      type:BooleanType
    }
  }
});

export default CancelReasonListType;
