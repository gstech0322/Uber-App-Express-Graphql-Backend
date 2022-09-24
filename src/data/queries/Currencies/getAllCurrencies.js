import Currencies from '../../models/Currencies';
import CurrenciesData from '../../types/getCurrenciesType';  

const getAllCurrencies = {

    type: CurrenciesData,

    async resolve ({ request }) {
        try {
            const results = await Currencies.findAll({
                where: {
                    isEnable: true
                }
            }); 

            if(results) {
                return {
                    results,
                    status: 200
                }
            } else {
                return {
                    status: 400,
                    errorMessage: "Something Went Wrong"
                }
            }
        } catch(error) {
            return {
                errorMessage: 'Something went wrong' + error,
                status: 400
            };
        }
    }
};

export default getAllCurrencies;

/*

query {
  getAllCurrencies {
    results {
      id
      symbol
      isEnable
      isPayment
      isPayment
      isBaseCurrency
    }
    status
    errorMessage
  }
}

*/