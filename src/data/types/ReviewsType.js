import {
    GraphQLObjectType as ObjectType, 
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLInt as TextType,
    GraphQLFloat as FloatType
} from 'graphql'; 

const ReviewsType = new ObjectType({
    name: 'ReviewsType',
    fields: { 
        id :{
            type: IntType
        }, 
        userId:{
            type: StringType
        },  
        bookingId:{
            type: IntType
        },
        authorId:{
            type: StringType
        },
        ratings:{
            type: FloatType
        },
        reviewContent: {
            type: StringType
        }, 
    }
});

export default ReviewsType;