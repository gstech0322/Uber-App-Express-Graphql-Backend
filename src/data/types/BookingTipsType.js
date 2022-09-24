import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType
} from 'graphql';


const BookingTipsType = new ObjectType({
  name: 'BookingTips',
  fields: {
    id: {
      type: StringType
    },

    bookingId: {
      type: IntType
    },

    riderId: {
      type: StringType
    },

    driverId: {
      type: StringType
    },

    paymentType: {
      type: IntType
    },

    amount: {
      type: IntType
    },

    currency: {
      type: StringType
    },

    status: {
      type: StringType
    },

    errorMessage: {
      type: StringType
    },
  }
});

export default BookingTipsType;
