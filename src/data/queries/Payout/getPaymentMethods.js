import GetPaymentType from '../../types/GetPaymentType';
import { PaymentMethods } from '../../../data/models';

const getPaymentMethods = {

    type: GetPaymentType,

    async resolve({ request }) {
        try {

            if (request.user) {

                const getData = await PaymentMethods.findAll();

                if (getData) {
                    return {
                        results: getData,
                        status: 200
                    }
                } else {
                    return {
                        status: 400,
                        errorMessage: "Something Went Wrong"
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'You haven\'t authorized for this action.',
                };
            }

        } catch (error) {
            return {
                errorMessage: 'Something went wrong.' + error,
                status: 400
            }
        }
    }
};

export default getPaymentMethods;

/*
{
  getCountries{
    errorMessage
    status
    results{
      id
      isEnable
      countryCode
      countryName
      dialCode
    }
  }
}
*/