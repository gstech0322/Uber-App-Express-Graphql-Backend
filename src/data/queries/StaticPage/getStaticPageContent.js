import { GraphQLInt as IntType } from 'graphql';
import { StaticPage } from '../../models';
import StaticPageCommonType from '../../types/StaticPage/StaticPageCommonType';

const getStaticPageContent = {

    type: StaticPageCommonType,

    args: {
        id: { type: IntType }
    },

    async resolve({ request }, { id }) {
        try {

            const result = await StaticPage.findOne({
                where: {
                    id: id || 4 // Default Driver Privacy Policy
                }
            });
    
            return await {
                status: result ? 200 : 400,
                errorMessage: result ? null : 'Oops! Unable to find the page. Try again.',
                result
            };
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong.' + error

            }
        }
    }
};

export default getStaticPageContent;

/*

query ($id: Int){
  getStaticPageContent(id: $id){
    status
    errorMessage
    result {
      id
      pageName
      metaTitle
      metaDescription
      pageBanner
      content
      createdAt
    }
  }
}

*/
