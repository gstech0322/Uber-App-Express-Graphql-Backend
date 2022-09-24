import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
} from 'graphql';

const Category = new ObjectType({
    name: 'Category',
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


const CategoryType = new ObjectType({
    name: 'CategoryType',
    fields: {
        result: {
            type: new List(Category)
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    },
});

export default CategoryType;