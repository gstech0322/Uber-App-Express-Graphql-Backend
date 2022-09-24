require('dotenv').config();

export const port = process.env.PORT || 4000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const url = process.env.SITE_URL; /* From ENV */
export const sitename = process.env.SITENAME;
export const environment = process.env.environment || true;
export const websiteUrl = process.env.WEBSITE_URL;
export const socketPort = process.env.PORT || 4001;

export const databaseConfig = { /* From ENV */
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DBNAME,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT || "mysql"
};

// Find nearest driver location in Miles
export const distance = 5;


// Testing Users ex: +919698002622 (with country dialcode)
export const testingUsers = [];

// Licence Upload
export const licenseuploadDir = process.env.LICENSE_UPLOAD_DIR || './images/license/';

// Vehicle Upload
export const vehicleUploadDir = process.env.VEHICLE_UPLOAD_DIR || './images/vehicle/';

// Profile photo upload
export const profilePhotouploadDir = process.env.PROFILE_PHOTO_UPLOAD_DIR || './images/avatar/';

// Category photo upload
export const categoryUploadDir = process.env.CATEGORY_PHOTO_UPLOAD_DIR || './images/category/';

// Logo photo upload
export const logoUploadDir = process.env.LOGO_PHOTO_UPLOAD_DIR || './images/logo/';

// Homepage photo upload
export const homepageUploadDir = process.env.HOMEPAGE_PHOTO_UPLOAD_DIR || './images/homepage/';

// Staticpage photo upload
export const staticpageUploadDir = process.env.STATICPAGE_PHOTO_UPLOAD_DIR || './images/staticpage/';

// Contentpage photo upload
export const contentPageUploadDir = process.env.CONTENTPAGE_PHOTO_UPLOAD_DIR || './images/contentPage/';

export const auth = {
    jwt: { secret: process.env.JWT_SECRET || 'Rent ALL' }
};

export const serverKey = '<Your Firebase Server Key>';

// SMS verification
export const sms = { /* From ENV */
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNTSID,
    authToken: process.env.TWILIO_AUTHTOKEN,
    phoneNumber: process.env.TWILIO_PHONENUMBER
  }
};

export const payment = { /* From ENV */
    stripe: {
        secretKey: process.env.STRIPE_SECRET,
    }
};