import { UserProfile, User } from '../../../../data/models';

export async function getCustomerId(
    userId
) {
    // Find Customer Id from UserProfile 
    const profile = await UserProfile.findOne({
        attributes: ['paymentCustomerId'],
        where: {
            userId
        },
        raw: true
    });

    if (profile) {
        return await profile.paymentCustomerId;
    } else {
        return null;
    }
}

export async function getCustomerSource(
    userId
) {
    // Find Customer Source from UserProfile 
    const profile = await UserProfile.findOne({
        attributes: ['sourceId'],
        where: {
            userId
        },
        raw: true
    });

    if (profile) {
        return profile.sourceId;
    } else {
        return null;
    }
}

export async function updateCustomerId(
    userId,
    paymentCustomerId
) {
    // Find Customer Source from UserProfile 
    const profile = await UserProfile.update({
        paymentCustomerId
    }, {
        where: {
            userId
        }
    });

    if (profile) {
        return true;
    } else {
        return false;
    }
}