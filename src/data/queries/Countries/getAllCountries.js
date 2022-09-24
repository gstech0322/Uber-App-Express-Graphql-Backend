import CountryData from '../../types/getCountryType';
import {Country} from '../../../data/models';


const getAllCountries = {

    type: CountryData,

    async resolve({request}) {
        try {
            const countries = await Country.findAll();
            if(countries) {
                return {
                    results : countries,
                    status : 200
                }
            } else {
                return {
                    status: 400,
                    errorMessage: "Something Went Wrong"
                }
            }
            
        } catch(error){
            return {
                errorMessage: 'Something went wrong' + error,
                status: 400
            };
        }

    }
};

export default getAllCountries;
