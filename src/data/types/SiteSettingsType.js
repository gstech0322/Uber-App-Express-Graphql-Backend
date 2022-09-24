import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';

const SiteSettingsType = new ObjectType({
    name: 'SiteSettings',
    fields: {
        id: { type: IntType },
        title: { type: StringType },
        name: { type: StringType },
        value: { type: StringType },
        type: { type: StringType },
        status: { type: StringType }
    },
});

export default SiteSettingsType;
