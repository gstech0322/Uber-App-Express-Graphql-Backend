import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';

const StaticPageType = new ObjectType({
    name: 'StaticPageType',
    fields: {
        id: {
            type: IntType
        },
        pageName: {
            type: StringType
        },
        metaTitle: {
            type: StringType
        },
        metaDescription: {
            type: StringType
        },
        pageBanner: {
            type: StringType
        },
        content: {
            type: StringType
        },
        createdAt: {
            type: StringType
        }
    }
});

export default StaticPageType;