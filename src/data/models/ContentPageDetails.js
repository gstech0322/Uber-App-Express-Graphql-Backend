import DataType from 'sequelize';
import Model from '../sequelize';

const ContentPageDetails = Model.define('ContentPageDetails', {
    
    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    pageTitle: {
        type: DataType.STRING,
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

    pageUrl: {
        type: DataType.STRING,
        allowNull: false
    },

    content: {
        type: DataType.TEXT('long'),
        allowNull: false
    },

    isEnable: {
        type: DataType.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    pageBanner: {
        type: DataType.STRING,
        allowNull: true
    }
});

export default ContentPageDetails;