import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType
} from 'graphql';


const SavedLocationsType = new ObjectType({
    name: 'SavedLocationsType',
    fields: {
        id: {
            type: IntType
        },
        userId: {
            type: StringType
        },
        location: {
            type: StringType
        },
        lat: {
            type: FloatType
        },
        lng: {
            type: FloatType
        },
        locationType: {
            type: StringType
        },
        locationName: {
            type: StringType
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
        }
    }
});

export default SavedLocationsType;
  