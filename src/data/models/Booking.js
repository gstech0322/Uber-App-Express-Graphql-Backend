import DataType from 'sequelize';
import Model from '../sequelize';

const Booking = Model.define('Booking', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    riderLocation: {
        type: DataType.STRING,
        allowNull: false,
    },

    riderLocationLat: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    riderLocationLng: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    pickUpLocation: {
        type: DataType.STRING,
        allowNull: false,
    },

    pickUpLat: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    pickUpLng: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    dropOffLocation: {
        type: DataType.STRING,
        allowNull: false,
    },

    dropOffLat: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    dropOffLng: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    riderId: {
        type: DataType.STRING,
        allowNull: false,
    },

    driverId: {
        type: DataType.STRING
    },
    tripStatus: {
        type: DataType.ENUM('created', 'approved', 'declined', 'started', 'cancelledByRider', 'cancelledByDriver', 'completed', 'expired', 'scheduled'),
        allowNull: false,
    },
    vehicleType: {
        type: DataType.INTEGER,
        allowNull: false,
    },
    totalRideDistance: {
        type: DataType.FLOAT,
        allowNull: false,
    },
    baseFare: {
        type: DataType.FLOAT,
        allowNull: false,
    },
    baseUnit: {
        type: DataType.FLOAT,
        allowNull: false,
    },
    baseMinute: {
        type: DataType.FLOAT,
        defaultValue: 0
    },
    riderServiceFee: {
        type: DataType.FLOAT,
        allowNull: false,
    },
    driverServiceFee: {
        type: DataType.FLOAT,
        allowNull: false,
    },
    estimatedTotalFare: {
        type: DataType.FLOAT,
        allowNull: true,
    },
    totalFare: {
        type: DataType.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    totalDuration: {
        type: DataType.FLOAT,
        allowNull: true,
    },
    paymentType: {
        type: DataType.INTEGER,
        allowNull: true,
    },
    paymentStatus: {
        type: DataType.ENUM('pending', 'completed'),
        allowNull: false,
    },
    transactionId: {
        type: DataType.STRING,
        allowNull: true,
    },
    startDate: {
        type: DataType.DATEONLY,
        allowNull: false,
    },
    startTime: {
        type: DataType.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataType.DATEONLY,
        allowNull: false,
    },
    endTime: {
        type: DataType.DATE,
        allowNull: false,
    },
    tripStart: {
        type: DataType.DATE,
        allowNull: true,
    },
    tripEnd: {
        type: DataType.DATE,
        allowNull: true,
    },
    currency: {
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'USD'
    },
    riderTotalFare: {
        type: DataType.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    driverTotalFare: {
        type: DataType.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    notes: {
        type: DataType.TEXT,
        allowNull: true
    },
    vehicleId: {
        type: DataType.INTEGER
    },
    vehicleNumber: {
        type: DataType.STRING
    },
    vehicleModel: {
        type: DataType.STRING
    },
    vehicleColor: {
        type: DataType.STRING
    },
    promoCodeId: {
        type: DataType.INTEGER
    },
    isSpecialTrip: {
        type: DataType.BOOLEAN,
        defaultValue: false
    },
    specialTripPrice: {
        type: DataType.FLOAT,
        defaultValue: 0
    },
    specialTripTotalFare: {
        type: DataType.FLOAT,
        defaultValue: 0
    },
    isTipGiven: {
        type: DataType.BOOLEAN,
        defaultValue: false
    },
    tipsAmount: {
        type: DataType.FLOAT,
        defaultValue: 0
    },
    tipsTotalFare: {
        type: DataType.FLOAT,
        defaultValue: 0
    },
    tipsDriverTotalFare: {
        type: DataType.FLOAT,
        defaultValue: 0
    },
    tollFee: {
        type: DataType.FLOAT,
        defaultValue: 0
    },
    isPayoutPaid: {
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    isBanStatus: {
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    pricingId: {
        type: DataType.INTEGER
    },

    bookingType: {
        type: DataType.TINYINT,
        defaultValue: 1 // 1 - Normal, 2 - Schedule
    },

    riderPayableFare: {
        type: DataType.FLOAT,
        defaultValue: 0
    }
});

export default Booking;