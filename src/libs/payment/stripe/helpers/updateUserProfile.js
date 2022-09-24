import { UserProfile } from '../../../../data/models';

export async function updateUserProfile(userId, paymentCustomerId, cardToken, cardLastFour, sourceId, preferredPaymentMethod) {
    const profile = await UserProfile.update({
        paymentCustomerId,
        cardToken,
        cardLastFour,
        sourceId,
        preferredPaymentMethod
       },
       {
          where: {
              userId
          }
       });

    if (profile) {
        return {
          status: 'updated'
        };
    } else {
        return {
          status: 'failed to update the profile'
        }
    }
}