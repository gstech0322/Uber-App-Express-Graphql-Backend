import DataType from 'sequelize';
import Model from '../sequelize';

const StaticPage = Model.define('StaticPage', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    pageName: {
        type: DataType.STRING,
        allowNull: false
    },

    content: {
        type: DataType.TEXT('long'),
        allowNull: false
    },

    metaTitle: {
        type: DataType.STRING,
        allowNull: false
    },

    metaDescription: {
        type: DataType.TEXT,
        allowNull: false
    },

    pageBanner: {
        type: DataType.STRING
    },

});

export default StaticPage;