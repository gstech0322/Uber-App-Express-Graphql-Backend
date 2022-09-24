import {
    GraphQLObjectType as ObjectType,
    GraphQLFloat as FloatType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
    GraphQLList as ListType
} from 'graphql';


const PromoCodeType = new ObjectType({
    name: 'PromoCodeType',
    fields: {
        id: {
            type: IntType
        },

        title: {
            type: StringType
        },

        description: {
            type: StringType
        },

        code: {
            type: StringType
        },

        type: {
            type: IntType
        },

        promoValue: {
            type: FloatType
        },

        currency: {
            type: StringType
        },

        expiryDate: {
            type: StringType
        },

        isEnable: {
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

        errorMessage: {
            type: StringType
        },

        availableCategories: {
            type: ListType(IntType)
        }
    }
});

export default PromoCodeType;
  