import sequelize from '../sequelize';

// Models
import AdminUser from './siteadmin/AdminUser';
import User from './User';
import UserLogin from './UserLogin';
import UserProfile from './UserProfile';
import UserVerifiedInfo from './UserVerifiedInfo';
import EmailToken from './EmailToken';
import Vehicles from './Vehicles';
import Category from './Category';
import SMSVerification from './SMSVerification';

// Table related to Currencies
import Currencies from './Currencies';
import CurrencyRates from './CurrencyRates';

import Country from './Country';

import PaymentMethods from './PaymentMethods';
import Payout from './Payout';
import BookingHistory from './BookingHistory';
import Booking from './Booking';

import SavedLocations from './SavedLocations';

//Reviews
import Reviews from './Reviews';

// Wallet
import WalletHistory from './WalletHistory';

// Emergency Contact
import EmergencyContact from './EmergencyContact';

// Promo code
import PromoCode from './PromoCode';
import BookingPromoCode from './BookingPromoCode';

// Cancellation list admin panel
import CancelReason from './CancelReason';

// tips to driver
import BookingTips from './BookingTips';

import BookingCancelReason from './BookingCancelReason';

import TempImages from './TempImages';
import Threads from './Threads';
import ThreadItems from './ThreadItems';
import HomePage from './HomePage';
import StaticPage from './StaticPage';
import SiteSettings from './SiteSettings';
import ContentPageDetails from './ContentPageDetails';

import Location from './Location';
import Pricing from './Pricing';

//Schedule Bookings
import ScheduleBooking from './ScheduleBooking';
import ScheduleBookingHistory from './ScheduleBookingHistory';

import PrecautionNotification from './PrecautionNotification';

function sync(...args) {
  return sequelize.sync(...args);
}

// User Table - Releation with other Tables
User.hasMany(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasOne(UserVerifiedInfo, {
  foreignKey: 'userId',
  as: 'userVerifiedInfo',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

User.hasMany(Vehicles, {
  foreignKey: 'userId',
  as: 'vehicles',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

User.hasMany(EmailToken, {
  foreignKey: 'userId',
  as: 'emailToken',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

//Category Related with other Table
Category.hasMany(Vehicles, {
  foreignKey: 'vehicleType',
  as: 'vehicles',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

// Other tables relations with User
UserProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

UserVerifiedInfo.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

Vehicles.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

Vehicles.belongsTo(Category, {
  foreignKey: 'vehicleType',
  as: 'category',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

EmailToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

UserLogin.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

User.hasMany(Payout, {
  foreignKey: 'userId',
  as: 'payout',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

Payout.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

Threads.hasMany(ThreadItems, {
  foreignKey: 'threadId',
  as: 'threadItems',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

ThreadItems.belongsTo(Threads, {
  foreignKey: 'threadId',
  as: 'threads',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

export default { sync };
export {
  AdminUser,
  User,
  UserProfile,
  UserVerifiedInfo,
  Vehicles,
  Category,
  SMSVerification,
  EmailToken,
  UserLogin,
  Currencies,
  CurrencyRates,
  Country,
  PaymentMethods,
  Payout,
  BookingHistory,
  Booking,
  Reviews,
  SavedLocations,
  WalletHistory,
  EmergencyContact,
  PromoCode,
  BookingPromoCode,
  CancelReason,
  BookingTips,
  BookingCancelReason,
  TempImages,
  Threads,
  ThreadItems,
  HomePage,
  StaticPage,
  ContentPageDetails,
  SiteSettings,
  Location,
  Pricing,
  ScheduleBooking,
  ScheduleBookingHistory,
  PrecautionNotification
};
