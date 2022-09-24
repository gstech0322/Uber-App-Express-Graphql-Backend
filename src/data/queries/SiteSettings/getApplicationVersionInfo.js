import {
    GraphQLInt as IntType,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull
} from 'graphql';
import { SiteSettings } from '../../models';
import CommonType from '../../types/CommonType';

import { versionCompare } from '../../../helpers/formatNumbers';
import { pushNotificationMessage } from '../../../helpers/push-notification/pushNotificationMessage';

const getApplicationVersionInfo = {

    type: CommonType,

    args: {
        osType: { type: new NonNull(StringType) },
        appType: { type: new NonNull(IntType) },
        version: { type: new NonNull(StringType) },
        requestLang: { type: StringType }
    },

    async resolve({ request }, { osType, appType, version, requestLang }) {
        try {
            let requestAppName, status = 200, errorMessage, appForceUpdate, appVersion, appVersionCompare;
            requestAppName = appType === 2 ? 'driver' : 'rider';
            requestAppName = requestAppName + (osType === 'ios' ? 'Ios' : 'Android') + 'Version';

            const getSiteSettings = await SiteSettings.findAll({
                attributes: ['name', 'value'],
                where: {
                    name: {
                        $in: ['appForceUpdate', requestAppName]
                    }
                },
                raw: true
            });

            appForceUpdate = getSiteSettings && getSiteSettings.find((o) => o.name === 'appForceUpdate').value;
            appVersion = getSiteSettings && getSiteSettings.find((o) => o.name !== 'appForceUpdate').value;
            appVersionCompare = versionCompare(version, appVersion);

            if (appForceUpdate === 'true' && appVersionCompare && appVersionCompare.forceUpdate) {    
                status = 400;
                errorMessage = (await pushNotificationMessage('forceUpdate', null, requestLang)).message;
            }
        
            return await {
                status,
                errorMessage
            };
        } catch(error) {
            return {
                status: 400,
                errorMessage: 'Something went wrong. ' + error
            }
        }
    }
};

export default getApplicationVersionInfo;

/*

query ($osType: String!, $appType: Int!, $version: String!, $requestLang: String) {
    getApplicationVersionInfo(osType: $osType, appType: $appType, version: $version, requestLang: $requestLang) {
        status
        errorMessage
    }
}

*/