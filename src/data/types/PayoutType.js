import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType
} from 'graphql';

import { PaymentMethods } from '../models';
import { UserProfile } from '../models';
import PaymentMethodsType from './PaymentMethodsType';
import ProfileType from './ProfileType';

const PayoutType = new ObjectType({
    name: 'Payout',
    fields: {
        id: {
            type: IntType
        },
        methodId: {
            type: IntType
        },
        paymentMethod: {
            type: PaymentMethodsType,
            resolve(payout) {
                return PaymentMethods.findOne({ where: { id: payout.methodId } });
            }
        },
        userId: {
            type: StringType
        },
        firstName: {
            type: StringType,
            async resolve(payout) {
                if (payout.firstName) {
                    return payout.firstName;
                } else {
                    let userDetails = await UserProfile.findOne({ where: { userId: payout.userId } });
                    return userDetails && userDetails.firstName ? userDetails.firstName : '';
                }
            }
        },
        lastName: {
            type: StringType,
            async resolve(payout) {
                if (payout && payout.lastName) {
                    return payout.lastName;
                } else {
                    let userDetails = await UserProfile.findOne({ where: { userId: payout.userId } });
                    return userDetails && userDetails.lastName ? userDetails.lastName : '';
                }
            }
        },
        payEmail: {
            type: StringType
        },
        address1: {
            type: StringType
        },
        address2: {
            type: StringType
        },
        city: {
            type: StringType
        },
        state: {
            type: StringType
        },
        zipcode: {
            type: StringType
        },
        country: {
            type: StringType
        },
        currency: {
            type: StringType
        },
        default: {
            type: BooleanType
        },
        createdAt: {
            type: StringType
        },
        updatedAt: {
            type: StringType
        },
        status: {
            type: IntType
        },
        last4Digits: {
            type: IntType
        },
        errorMessage: { type: StringType },
        routingNumber: {
            type: StringType
        },
        accountNumber: {
            type: StringType
        },
        ssn4Digits: {
            type: StringType
        },
        isVerified: {
            type: BooleanType
        },
        accountId: {
            type: StringType,
            allowNull: false
        }
    }
});

export default PayoutType;