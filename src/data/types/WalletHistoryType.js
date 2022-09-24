import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType,
    GraphQLBoolean as BooleanType,
} from 'graphql';


const WalletHistoryType = new ObjectType({
    name: 'WalletHistoryType',
    fields: {
        id: {
            type: IntType
        },
        userId: {
            type: StringType
        },
        transactionId: {
            type: StringType
        },
        cardLast4Digits: {
            type: StringType
        },
        customerId: {
            type: StringType
        },
        amount: {
            type: FloatType
        },
        currency: {
            type: StringType
        },
        paidBy: {
            type: IntType
        },
        walletBalance: { 
            type: FloatType 
        },
        status: {
            type: StringType
        },
        errorMessage: {
            type: StringType
        },
        requireAdditionalAction: { type: BooleanType },
        paymentIntentSecret: { type: StringType }

    }
});

export default WalletHistoryType;