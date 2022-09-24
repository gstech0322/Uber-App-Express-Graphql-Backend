import { Location, Pricing } from '../../models';
import NearestDriversType from '../../types/NearestDriversType';
import { distance } from '../../../config';
import sequelize from '../../../data/sequelize';

import {
    GraphQLFloat as FloatType
} from 'graphql';


const GetNearestDrivers = {

    type: NearestDriversType,

    args: {
        lat_val: { type: FloatType },
        lng_val: { type: FloatType },
    },

    async resolve({ request }, { lat_val, lng_val }) {

        try {
            if (request.user) {
                let userId = request.user && request.user.id;

                let requestLocationPoint = sequelize.fn('GeomFromText', `POINT(${lat_val} ${lng_val})`);

                let contains = sequelize.fn('ST_CONTAINS',
                    sequelize.col(`geometryCoordinates`),
                    requestLocationPoint
                );

                const permittedLocations = await Location.findAll({
                    attributes: ['id'],
                    where: {
                        isActive: true,
                        and: sequelize.where(contains, 1)
                    },
                    raw: true
                });

                if (permittedLocations && permittedLocations.length > 0) {
                    let permittedLocationsId = permittedLocations.map(x => { return x['id'] });

                    const permittedCategories = await Pricing.findAll({
                        attributes: ['categoryId'],
                        where: {
                            isActive: true,
                            locationId: {
                                $in: permittedLocationsId
                            }
                        },
                        order: [['updatedAt', 'DESC']],
                        raw: true
                    });

                    if (permittedCategories && permittedCategories.length > 0) {
                        let categoryId = permittedCategories.map(x => { return x['categoryId'] });
                        categoryId = new Set(categoryId);
                        categoryId = [...categoryId];
    
                        const result = await sequelize.query(`
                          SELECT
                                *,
                                (
                                  6371 *
                                  acos(
                                      cos( radians( ${lat_val} ) ) *
                                      cos( radians( lat ) ) *
                                      cos(
                                          radians( lng ) - radians( ${lng_val} )
                                      ) +
                                      sin(radians( ${lat_val} )) *
                                      sin(radians( lat ))
                                  )
                              ) AS distance 
                            FROM
                                User JOIN Vehicles ON User.id=Vehicles.userId 
                            WHERE
                                (
                                    User.lat IS NOT NULL
                                ) AND (
                                    User.lng IS NOT NULL
                                ) AND (
                                    User.isActive=true
                                ) AND (
                                    User.isBan=false
                                ) AND (
                                    User.userType=2
                                ) AND (
                                    User.userStatus='active'     
                                ) AND (
                                    User.activeStatus='active'
                                ) AND (    
                                    User.deletedAt IS NULL
                                ) AND (
                                    User.updatedAt >= "${new Date(Date.now() - 5 * 60000).toISOString().slice(0, 19).replace('T', ' ')}"    
                                ) AND (
                                    User.id NOT IN(SELECT driverId FROM BookingHistory WHERE riderId="${userId}" AND status IN(2, 0) AND updatedAt BETWEEN "${new Date(Date.now() - 2 * 60000).toISOString().slice(0, 19).replace('T', ' ')}" AND "${new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')}")    
                                ) AND (
                                    Vehicles.vehicleType IN(${categoryId})
                                ) AND (
                                    6371 *
                                    acos(
                                        cos( radians( ${lat_val} ) ) *
                                        cos( radians( lat ) ) *
                                        cos(
                                            radians( lng ) - radians( ${lng_val} )
                                        ) +
                                        sin(radians( ${lat_val} )) *
                                        sin(radians( lat ))
                                    )
                                ) < ${distance}
                            ORDER BY distance ASC LIMIT 50
                        `, {
                            type: sequelize.QueryTypes.SELECT
                        });
    
                        let nearByDrivers = [];
    
                        categoryId.map((o, i) => {
                            let categoryData = {};
                            categoryData['id'] = o;
                            categoryData['location'] = result.filter(obj => obj.vehicleType === o);
                            nearByDrivers.push(categoryData);
                        });

                        nearByDrivers = nearByDrivers.sort((a, b) => a['id'] - b['id']);
    
                        return await {
                            status: 200,
                            result: nearByDrivers
                        };
                    } else {
                        return {
                            status: 400,
                            errorMessage: 'Sorry, our service unavailable in your location.'
                        };
                    }
                } else {
                    return {
                        status: 400,
                        errorMessage: 'Sorry, our service unavailable in your location.'
                    };
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! Please login with your account!'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }
    },
};

export default GetNearestDrivers;

/*

query GetNearestDrivers($lat_val:Float, $lng_val:Float) {
  GetNearestDrivers(lat_val:$lat_val, lng_val:$lng_val) {
    status
    result{
      id
      location {
        lat
        lng
      }
    }
    errorMessage
  }
}

*/
