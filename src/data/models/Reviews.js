import DataType from 'sequelize';
import Model from '../sequelize'; 

const Reviews = Model.define('Reviews', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    }, 

    userId: {
        type : DataType.STRING, 
        allowNull: false
    },

    bookingId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    authorId: {
        type: DataType.STRING,
    },

    ratings: {
        type: DataType.FLOAT,
    },

    reviewContent: {
        type: DataType.TEXT,
        allowNull: false
    } 
});

export default Reviews; 