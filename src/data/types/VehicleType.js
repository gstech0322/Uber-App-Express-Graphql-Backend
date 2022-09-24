import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
} from 'graphql';

import GetCategoryType from './GetCategoryType';
import Category from '../models/Category';

const VehicleType = new ObjectType({
    name: 'VehicleType',
    fields: {
        id: { type: IntType },
        vehicleName: { type: StringType },
        vehicleNumber: { type: StringType },
        vehicleType: { type: StringType },
        vehicleStatus: { type: StringType },
        vehicleRC: { type: StringType },
        vehicleInsurance: { type: StringType },
        vehicleModel: { type: StringType },
        vehicleColor: { type: StringType },
        vehicleRCName: {
            type: StringType,
            async resolve(vehicle) {
                let name = vehicle.vehicleRC ? 'images/vehicle/' + vehicle.vehicleRC : '';
                return name;
            }
        },
        vehicleInsuranceName: {
            type: StringType,
            async resolve(vehicle) {
                let name = vehicle.vehicleInsurance ? 'images/vehicle/' + vehicle.vehicleInsurance : '';
                return name;
            }
        },
        vehicleCategoryDetails: {
            type: GetCategoryType,
            resolve(vehicle) {
                return Category.findOne({ where: { id: vehicle.vehicleType } });
            }
        }
    },
});

export default VehicleType;