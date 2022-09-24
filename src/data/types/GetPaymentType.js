import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';

import PaymentMethodsType from '../types/PaymentMethodsType';

const GetPaymentType = new ObjectType({
    name: 'GetPaymentType',
    fields: {
        results: {
            type: new List(PaymentMethodsType)
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    },
});

export default GetPaymentType;