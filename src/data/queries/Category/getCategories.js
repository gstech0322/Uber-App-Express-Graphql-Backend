import CategoryType from '../../types/CategoryType';
import { Category } from '../../../data/models';

const getCategories = {

    type: CategoryType,

    async resolve({ request }) {

        try {

            const getCategoryList = await Category.findAll({
                where: {
                    isActive: true
                },
                order: [['id', 'ASC']]
            });
            if (getCategoryList && getCategoryList.length > 0) {
                return await {
                    result: getCategoryList,
                    status: 200
                };
            } else {
                return await {
                    result: [],
                    status: 400,
                    errorMessage: "No record found."
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }
    }
};

export default getCategories;

/*
query getCategories {
  getCategories {
    result {
      id
      categoryName
      categoryImage
      categoryMarkerImage
      unitPrice
      minutePrice
      basePrice
      isActive
      currency
    }
    status
    errorMessage
  }
}
*/