import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
} from 'graphql';

const GetCategoryType = new ObjectType({
    name: 'Categories',
    fields: {
        id: { type: IntType },
        categoryName: { type: StringType },
        categoryImage: { type: StringType },
        categoryMarkerImage: { type: StringType },
        unitPrice: { type: FloatType },
        minutePrice: { type: FloatType },
        basePrice: { type: FloatType },
        isActive: { type: BooleanType },
        currency: { type: StringType },
        capacity: { type: IntType },
        createdAt: { type: StringType },
        updatedAt: { type: StringType },
    },
});

export default GetCategoryType;