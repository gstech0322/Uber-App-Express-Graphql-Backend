import CurrencyType from '../../types/CurrencyType';

// Sequelize models
import { CurrencyRates } from '../../../data/models';

const Currency = {

    type: CurrencyType,

    async resolve({ request, response }) {
        try {
            let ratesData = {}, rates;
            
            const currencyData = await CurrencyRates.findAll({
                attributes: ['id', 'currencyCode', 'rate', 'isBase'],
                raw: true 
            }); 

            const base = currencyData && currencyData.find(o => o.isBase == true);

            if (currencyData && currencyData.length > 0) {
                await Promise.all(
                    currencyData.map((item, key) => {
                        ratesData[item.currencyCode] = item.rate;
                    })
                );
            } 
            
            rates = JSON.stringify(ratesData);

            if (rates && base) {
                return {
                    result: {
                        base: base.currencyCode,
                        rates,
                    },
                    status: 200
                };
            } else {
                return {
                    status: 400,
                    errorMessage: "No currency records found."
                };
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong' + error,
                status: 400
            };
        }
    },
};

export default Currency;

/*

query currency {
  currency {
    result {
      base
      rates
    }
    status
    errorMessage
  }
}

*/