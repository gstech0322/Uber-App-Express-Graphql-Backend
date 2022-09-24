import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType
} from 'graphql';

const PrecautionNotificationType = new ObjectType({
    name: 'PrecautionNotificationType',
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
        isEnabled: {
            type: BooleanType
        },
        imageName: {
            type: StringType
        }
    }
});

export default PrecautionNotificationType;