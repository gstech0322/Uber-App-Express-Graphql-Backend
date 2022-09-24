import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List
} from 'graphql';

import StaticPageType from './StaticPageType';

const StaticPageCommonType = new ObjectType({
    name: 'StaticPageCommonType',
    fields: {
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        },
        result: {
            type: StaticPageType
        },
        results: {
            type: new List(StaticPageType)
        }
    }
});

export default StaticPageCommonType;