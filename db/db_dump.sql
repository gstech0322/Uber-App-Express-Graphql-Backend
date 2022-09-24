-- MySQL dump 10.13  Distrib 5.7.29, for osx10.15 (x86_64)
--
-- Host: localhost    Database: wooberly_v_1_8
-- ------------------------------------------------------
-- Server version	5.7.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AdminPrivileges`
--

DROP TABLE IF EXISTS `AdminPrivileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AdminPrivileges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) NOT NULL,
  `previlegeId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `adminprivileges_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `AdminRoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AdminPrivileges`
--

LOCK TABLES `AdminPrivileges` WRITE;
/*!40000 ALTER TABLE `AdminPrivileges` DISABLE KEYS */;
/*!40000 ALTER TABLE `AdminPrivileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AdminRoles`
--

DROP TABLE IF EXISTS `AdminRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AdminRoles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AdminRoles`
--

LOCK TABLES `AdminRoles` WRITE;
/*!40000 ALTER TABLE `AdminRoles` DISABLE KEYS */;
/*!40000 ALTER TABLE `AdminRoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AdminUser`
--

DROP TABLE IF EXISTS `AdminUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AdminUser` (
  `id` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isSuperAdmin` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AdminUser`
--

LOCK TABLES `AdminUser` WRITE;
/*!40000 ALTER TABLE `AdminUser` DISABLE KEYS */;
INSERT INTO `AdminUser` VALUES ('cd1cc030-1bdc-11ea-9e8f-179abe411c92','admin@radicalstart.com','$2b$08$JygwCxbWP/Q7jkfqwtsXcOFiyuCVi1/yubJH/nvmHLfCQv04CTLNO',1,'2019-12-11 06:09:33','2020-03-04 09:31:35',NULL);
/*!40000 ALTER TABLE `AdminUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Booking`
--

DROP TABLE IF EXISTS `Booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Booking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `riderLocation` varchar(255) NOT NULL,
  `riderLocationLat` float NOT NULL,
  `riderLocationLng` float NOT NULL,
  `pickUpLocation` varchar(255) NOT NULL,
  `pickUpLat` float NOT NULL,
  `pickUpLng` float NOT NULL,
  `dropOffLocation` varchar(255) NOT NULL,
  `dropOffLat` float NOT NULL,
  `dropOffLng` float NOT NULL,
  `riderId` varchar(255) NOT NULL,
  `driverId` varchar(255) DEFAULT NULL,
  `tripStatus` enum('created','approved','declined','started','cancelledByRider','cancelledByDriver','completed','expired','scheduled') NOT NULL,
  `vehicleType` int(11) NOT NULL,
  `totalRideDistance` float NOT NULL,
  `baseFare` float NOT NULL,
  `baseUnit` float NOT NULL,
  `riderServiceFee` float NOT NULL,
  `driverServiceFee` float NOT NULL,
  `estimatedTotalFare` float DEFAULT NULL,
  `totalFare` float DEFAULT NULL,
  `totalDuration` float DEFAULT NULL,
  `paymentType` int(11) DEFAULT NULL,
  `paymentStatus` enum('pending','completed') NOT NULL,
  `transactionId` varchar(255) DEFAULT NULL,
  `startDate` date NOT NULL,
  `startTime` datetime NOT NULL,
  `endDate` date NOT NULL,
  `endTime` datetime NOT NULL,
  `tripStart` datetime DEFAULT NULL,
  `tripEnd` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `currency` varchar(255) NOT NULL DEFAULT 'USD',
  `riderTotalFare` float DEFAULT '0',
  `driverTotalFare` float DEFAULT '0',
  `notes` mediumtext,
  `baseMinute` float DEFAULT '0',
  `vehicleId` int(11) DEFAULT NULL,
  `vehicleNumber` varchar(255) DEFAULT NULL,
  `promoCodeId` int(11) DEFAULT NULL,
  `isSpecialTrip` tinyint(1) DEFAULT '0',
  `specialTripPrice` float DEFAULT '0',
  `specialTripTotalFare` float DEFAULT '0',
  `isTipGiven` tinyint(1) DEFAULT '0',
  `tipsAmount` float DEFAULT '0',
  `tipsTotalFare` float DEFAULT '0',
  `tipsDriverTotalFare` float DEFAULT '0',
  `tollFee` float DEFAULT '0',
  `isPayoutPaid` tinyint(1) DEFAULT '0',
  `userBanStatus` enum('active','inactive') DEFAULT 'inactive',
  `isBanStatus` tinyint(1) DEFAULT '0',
  `pricingId` int(11) DEFAULT NULL,
  `riderPayableFare` float DEFAULT NULL,
  `bookingType` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Booking`
--

LOCK TABLES `Booking` WRITE;
/*!40000 ALTER TABLE `Booking` DISABLE KEYS */;
/*!40000 ALTER TABLE `Booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookingCancelReason`
--

DROP TABLE IF EXISTS `BookingCancelReason`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BookingCancelReason` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) NOT NULL,
  `riderId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `driverId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `cancelStatus` enum('cancelledByDriver','cancelledByRider') DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookingCancelReason`
--

LOCK TABLES `BookingCancelReason` WRITE;
/*!40000 ALTER TABLE `BookingCancelReason` DISABLE KEYS */;
/*!40000 ALTER TABLE `BookingCancelReason` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookingHistory`
--

DROP TABLE IF EXISTS `BookingHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BookingHistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) NOT NULL,
  `riderId` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `driverId` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `status` int(11) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookingHistory`
--

LOCK TABLES `BookingHistory` WRITE;
/*!40000 ALTER TABLE `BookingHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `BookingHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookingPromoCode`
--

DROP TABLE IF EXISTS `BookingPromoCode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BookingPromoCode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `promoId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `type` tinyint(4) DEFAULT '1',
  `promoValue` float NOT NULL DEFAULT '0',
  `currency` varchar(255) DEFAULT NULL,
  `expiryDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookingPromoCode`
--

LOCK TABLES `BookingPromoCode` WRITE;
/*!40000 ALTER TABLE `BookingPromoCode` DISABLE KEYS */;
/*!40000 ALTER TABLE `BookingPromoCode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookingTips`
--

DROP TABLE IF EXISTS `BookingTips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BookingTips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) NOT NULL,
  `riderId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `driverId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `paymentType` int(11) DEFAULT NULL,
  `amount` float NOT NULL,
  `riderCurrency` varchar(255) NOT NULL,
  `driverCurrency` varchar(255) NOT NULL,
  `transactionId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookingTips`
--

LOCK TABLES `BookingTips` WRITE;
/*!40000 ALTER TABLE `BookingTips` DISABLE KEYS */;
/*!40000 ALTER TABLE `BookingTips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CancelReason`
--

DROP TABLE IF EXISTS `CancelReason`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CancelReason` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userType` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CancelReason`
--

LOCK TABLES `CancelReason` WRITE;
/*!40000 ALTER TABLE `CancelReason` DISABLE KEYS */;
/*!40000 ALTER TABLE `CancelReason` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(255) DEFAULT NULL,
  `categoryImage` varchar(255) DEFAULT NULL,
  `categoryMarkerImage` varchar(255) DEFAULT NULL,
  `unitPrice` float DEFAULT '0',
  `basePrice` float DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `currency` varchar(255) DEFAULT 'USD',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `riderFeeType` enum('fixed','percentage') DEFAULT NULL,
  `riderFeeValue` float DEFAULT NULL,
  `driverFeeType` enum('fixed','percentage') DEFAULT NULL,
  `driverFeeValue` float DEFAULT NULL,
  `minutePrice` float DEFAULT '0',
  `capacity` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'Auto','ff67623b9992cf3eb34842593ad990a1.png','2e749762203d8547e9fbc4761ce55891.png',1,5,1,'PLN','2019-09-21 12:31:25','2020-05-09 15:54:26','percentage',10,'percentage',80,0.5,3),(2,'Micro','b08fb699f68fa6a4613c15bdeaee019b.png','f99ff35b770abe435a01eef7411cde1b.png',60,123,1,'USD','2019-09-21 12:31:27','2021-02-12 12:06:53','percentage',90,'percentage',70,30,4),(3,'Mini','15cfda5e9500b2dab412bee6388dcee4.png','5385fa00f25741380974aa93d81e987d.png',10,20,1,'USD','2019-09-21 12:31:27','2020-05-09 15:53:58','percentage',5,'percentage',10,5,5),(4,'Luxury','b2bda05908bf1c337884fc3009ae6744.png','366c947fdb7f15300779fe215fb8ca08.png',20,50,1,'USD','2019-09-21 12:31:27','2020-05-09 15:54:05','percentage',5,'percentage',10,10,8),(5,'Prime','3b998173c272f93ceab3cabe29f95a86.png','7771fb16f608446181966f03ac2bebfa.png',15,30,1,'USD','2019-09-21 12:31:27','2020-05-09 15:54:14','percentage',5,'percentage',10,10,5);
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ContentPageDetails`
--

DROP TABLE IF EXISTS `ContentPageDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ContentPageDetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageTitle` varchar(255) NOT NULL,
  `metaTitle` varchar(255) NOT NULL,
  `metaDescription` mediumtext NOT NULL,
  `pageUrl` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT '1',
  `pageBanner` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContentPageDetails`
--

LOCK TABLES `ContentPageDetails` WRITE;
/*!40000 ALTER TABLE `ContentPageDetails` DISABLE KEYS */;
INSERT INTO `ContentPageDetails` VALUES (1,'Lorum Ipsum Team','Lorum Ipsum Team','Lorum Ipsum Team','lorum-ipsum-team','<p>Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>',1,'8f5cd5ec1cf9735a2ea94c7ae295797c.jpeg','2020-05-09 16:11:28','2020-05-09 16:11:28');
/*!40000 ALTER TABLE `ContentPageDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Country`
--

DROP TABLE IF EXISTS `Country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `countryCode` varchar(255) NOT NULL,
  `countryName` varchar(255) NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT '1',
  `dialCode` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=242 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Country`
--

LOCK TABLES `Country` WRITE;
/*!40000 ALTER TABLE `Country` DISABLE KEYS */;
INSERT INTO `Country` VALUES (1,'AF','Afghanistan',1,'+93','2019-10-08 10:01:44','2019-10-08 10:01:44'),(2,'AL','Albania',1,'+355','2019-10-08 10:01:44','2019-10-08 10:01:44'),(3,'DZ','Algeria',1,'+213','2019-10-08 10:01:44','2019-10-08 10:01:44'),(4,'AS','AmericanSamoa',1,'+1 684','2019-10-08 10:01:44','2019-10-08 10:01:44'),(5,'AD','Andorra',1,'+376','2019-10-08 10:01:44','2019-10-08 10:01:44'),(6,'AO','Angola',1,'+244','2019-10-08 10:01:44','2019-10-08 10:01:44'),(7,'AI','Anguilla',1,'+1 264','2019-10-08 10:01:44','2019-10-08 10:01:44'),(8,'AQ','Antarctica',1,'+672','2019-10-08 10:01:44','2019-10-08 10:01:44'),(9,'AG','Antigua and Barbuda',1,'+1268','2019-10-08 10:01:44','2019-10-08 10:01:44'),(10,'AR','Argentina',1,'+54','2019-10-08 10:01:44','2019-10-08 10:01:44'),(11,'AM','Armenia',1,'+374','2019-10-08 10:01:44','2019-10-08 10:01:44'),(12,'AW','Aruba',1,'+297','2019-10-08 10:01:44','2019-10-08 10:01:44'),(13,'AU','Australia',1,'+61','2019-10-08 10:01:44','2019-10-08 10:01:44'),(14,'AT','Austria',1,'+43','2019-10-08 10:01:44','2019-10-08 10:01:44'),(15,'AZ','Azerbaijan',1,'+994','2019-10-08 10:01:44','2019-10-08 10:01:44'),(16,'BS','Bahamas',1,'+1 242','2019-10-08 10:01:44','2019-10-08 10:01:44'),(17,'BH','Bahrain',1,'+973','2019-10-08 10:01:44','2019-10-08 10:01:44'),(18,'BD','Bangladesh',1,'+880','2019-10-08 10:01:44','2019-10-08 10:01:44'),(19,'BB','Barbados',1,'+1 246','2019-10-08 10:01:44','2019-10-08 10:01:44'),(20,'BY','Belarus',1,'+375','2019-10-08 10:01:44','2019-10-08 10:01:44'),(21,'BE','Belgium',1,'+32','2019-10-08 10:01:44','2019-10-08 10:01:44'),(22,'BZ','Belize',1,'+501','2019-10-08 10:01:44','2019-10-08 10:01:44'),(23,'BJ','Benin',1,'+229','2019-10-08 10:01:44','2019-10-08 10:01:44'),(24,'BM','Bermuda',1,'+1 441','2019-10-08 10:01:44','2019-10-08 10:01:44'),(25,'BT','Bhutan',1,'+975','2019-10-08 10:01:44','2019-10-08 10:01:44'),(26,'BO','Bolivia, Plurinational State of',1,'+591','2019-10-08 10:01:44','2019-10-08 10:01:44'),(27,'BA','Bosnia and Herzegovina',1,'+387','2019-10-08 10:01:44','2019-10-08 10:01:44'),(28,'BW','Botswana',1,'+267','2019-10-08 10:01:44','2019-10-08 10:01:44'),(29,'BR','Brazil',1,'+55','2019-10-08 10:01:44','2019-10-08 10:01:44'),(30,'IO','British Indian Ocean Territory',1,'+246','2019-10-08 10:01:44','2019-10-08 10:01:44'),(31,'BN','Brunei Darussalam',1,'+673','2019-10-08 10:01:44','2019-10-08 10:01:44'),(32,'BG','Bulgaria',1,'+359','2019-10-08 10:01:44','2019-10-08 10:01:44'),(33,'BF','Burkina Faso',1,'+226','2019-10-08 10:01:44','2019-10-08 10:01:44'),(34,'BI','Burundi',1,'+257','2019-10-08 10:01:44','2019-10-08 10:01:44'),(35,'KH','Cambodia',1,'+855','2019-10-08 10:01:44','2019-10-08 10:01:44'),(36,'CM','Cameroon',1,'+237','2019-10-08 10:01:44','2019-10-08 10:01:44'),(37,'CA','Canada',1,'+1','2019-10-08 10:01:44','2019-10-08 10:01:44'),(38,'CV','Cape Verde',1,'+238','2019-10-08 10:01:44','2019-10-08 10:01:44'),(39,'KY','Cayman Islands',1,'+ 345','2019-10-08 10:01:44','2019-10-08 10:01:44'),(40,'CF','Central African Republic',1,'+236','2019-10-08 10:01:44','2019-10-08 10:01:44'),(41,'TD','Chad',1,'+235','2019-10-08 10:01:44','2019-10-08 10:01:44'),(42,'CL','Chile',1,'+56','2019-10-08 10:01:44','2019-10-08 10:01:44'),(43,'CN','China',1,'+86','2019-10-08 10:01:44','2019-10-08 10:01:44'),(44,'CX','Christmas Island',1,'+61','2019-10-08 10:01:44','2019-10-08 10:01:44'),(45,'CC','Cocos (Keeling) Islands',1,'+61','2019-10-08 10:01:44','2019-10-08 10:01:44'),(46,'CO','Colombia',1,'+57','2019-10-08 10:01:44','2019-10-08 10:01:44'),(47,'KM','Comoros',1,'+269','2019-10-08 10:01:44','2019-10-08 10:01:44'),(48,'CG','Congo',1,'+242','2019-10-08 10:01:44','2019-10-08 10:01:44'),(49,'CD','Congo, The Democratic Republic of the',1,'+243','2019-10-08 10:01:44','2019-10-08 10:01:44'),(50,'CK','Cook Islands',1,'+682','2019-10-08 10:01:44','2019-10-08 10:01:44'),(51,'CR','Costa Rica',1,'+506','2019-10-08 10:01:44','2019-10-08 10:01:44'),(52,'CI','Cote d\'Ivoire',1,'+225','2019-10-08 10:01:44','2019-10-08 10:01:44'),(53,'HR','Croatia',1,'+385','2019-10-08 10:01:44','2019-10-08 10:01:44'),(54,'CU','Cuba',1,'+53','2019-10-08 10:01:44','2019-10-08 10:01:44'),(55,'CY','Cyprus',1,'+537','2019-10-08 10:01:44','2019-10-08 10:01:44'),(56,'CZ','Czech Republic',1,'+420','2019-10-08 10:01:44','2019-10-08 10:01:44'),(57,'DK','Denmark',1,'+45','2019-10-08 10:01:44','2019-10-08 10:01:44'),(58,'DJ','Djibouti',1,'+253','2019-10-08 10:01:44','2019-10-08 10:01:44'),(59,'DM','Dominica',1,'+1 767','2019-10-08 10:01:44','2019-10-08 10:01:44'),(60,'DO','Dominican Republic',1,'+1 849','2019-10-08 10:01:44','2019-10-08 10:01:44'),(61,'EC','Ecuador',1,'+593','2019-10-08 10:01:44','2019-10-08 10:01:44'),(62,'EG','Egypt',1,'+20','2019-10-08 10:01:44','2019-10-08 10:01:44'),(63,'SV','El Salvador',1,'+503','2019-10-08 10:01:44','2019-10-08 10:01:44'),(64,'GQ','Equatorial Guinea',1,'+240','2019-10-08 10:01:44','2019-10-08 10:01:44'),(65,'ER','Eritrea',1,'+291','2019-10-08 10:01:44','2019-10-08 10:01:44'),(66,'EE','Estonia',1,'+372','2019-10-08 10:01:44','2019-10-08 10:01:44'),(67,'ET','Ethiopia',1,'+251','2019-10-08 10:01:44','2019-10-08 10:01:44'),(68,'FK','Falkland Islands (Malvinas)',1,'+500','2019-10-08 10:01:44','2019-10-08 10:01:44'),(69,'FO','Faroe Islands',1,'+298','2019-10-08 10:01:44','2019-10-08 10:01:44'),(70,'FJ','Fiji',1,'+679','2019-10-08 10:01:44','2019-10-08 10:01:44'),(71,'FI','Finland',1,'+358','2019-10-08 10:01:44','2019-10-08 10:01:44'),(72,'FR','France',1,'+33','2019-10-08 10:01:44','2019-10-08 10:01:44'),(73,'GF','French Guiana',1,'+594','2019-10-08 10:01:44','2019-10-08 10:01:44'),(74,'PF','French Polynesia',1,'+689','2019-10-08 10:01:44','2019-10-08 10:01:44'),(75,'GA','Gabon',1,'+241','2019-10-08 10:01:44','2019-10-08 10:01:44'),(76,'GM','Gambia',1,'+220','2019-10-08 10:01:44','2019-10-08 10:01:44'),(77,'GE','Georgia',1,'+995','2019-10-08 10:01:44','2019-10-08 10:01:44'),(78,'DE','Germany',1,'+49','2019-10-08 10:01:44','2019-10-08 10:01:44'),(79,'GH','Ghana',1,'+233','2019-10-08 10:01:44','2019-10-08 10:01:44'),(80,'GI','Gibraltar',1,'+350','2019-10-08 10:01:44','2019-10-08 10:01:44'),(81,'GR','Greece',1,'+30','2019-10-08 10:01:44','2019-10-08 10:01:44'),(82,'GL','Greenland',1,'+299','2019-10-08 10:01:44','2019-10-08 10:01:44'),(83,'GD','Grenada',1,'+1 473','2019-10-08 10:01:44','2019-10-08 10:01:44'),(84,'GP','Guadeloupe',1,'+590','2019-10-08 10:01:44','2019-10-08 10:01:44'),(85,'GU','Guam',1,'+1 671','2019-10-08 10:01:44','2019-10-08 10:01:44'),(86,'GT','Guatemala',1,'+502','2019-10-08 10:01:44','2019-10-08 10:01:44'),(87,'GG','Guernsey',1,'+44','2019-10-08 10:01:44','2019-10-08 10:01:44'),(88,'GN','Guinea',1,'+224','2019-10-08 10:01:44','2019-10-08 10:01:44'),(89,'GW','Guinea-Bissau',1,'+245','2019-10-08 10:01:44','2019-10-08 10:01:44'),(90,'GY','Guyana',1,'+595','2019-10-08 10:01:44','2019-10-08 10:01:44'),(91,'HT','Haiti',1,'+509','2019-10-08 10:01:44','2019-10-08 10:01:44'),(92,'VA','Holy See (Vatican City State)',1,'+379','2019-10-08 10:01:44','2019-10-08 10:01:44'),(93,'HN','Honduras',1,'+504','2019-10-08 10:01:44','2019-10-08 10:01:44'),(94,'HK','Hong Kong',1,'+852','2019-10-08 10:01:44','2019-10-08 10:01:44'),(95,'HU','Hungary',1,'+36','2019-10-08 10:01:44','2019-10-08 10:01:44'),(96,'IS','Iceland',1,'+354','2019-10-08 10:01:44','2019-10-08 10:01:44'),(97,'IN','India',1,'+91','2019-10-08 10:01:44','2019-10-08 10:01:44'),(98,'ID','Indonesia',1,'+62','2019-10-08 10:01:44','2019-10-08 10:01:44'),(99,'IR','Iran, Islamic Republic of',1,'+98','2019-10-08 10:01:44','2019-10-08 10:01:44'),(100,'IQ','Iraq',1,'+964','2019-10-08 10:01:44','2019-10-08 10:01:44'),(101,'IE','Ireland',1,'+353','2019-10-08 10:01:44','2019-10-08 10:01:44'),(102,'IM','Isle of Man',1,'+44','2019-10-08 10:01:44','2019-10-08 10:01:44'),(103,'IL','Israel',1,'+972','2019-10-08 10:01:44','2019-10-08 10:01:44'),(104,'IT','Italy',1,'+39','2019-10-08 10:01:44','2019-10-08 10:01:44'),(105,'JM','Jamaica',1,'+1 876','2019-10-08 10:01:44','2019-10-08 10:01:44'),(106,'JP','Japan',1,'+81','2019-10-08 10:01:44','2019-10-08 10:01:44'),(107,'JE','Jersey',1,'+44','2019-10-08 10:01:44','2019-10-08 10:01:44'),(108,'JO','Jordan',1,'+962','2019-10-08 10:01:44','2019-10-08 10:01:44'),(109,'KZ','Kazakhstan',1,'+7 7','2019-10-08 10:01:44','2019-10-08 10:01:44'),(110,'KE','Kenya',1,'+254','2019-10-08 10:01:44','2019-10-08 10:01:44'),(111,'KI','Kiribati',1,'+686','2019-10-08 10:01:44','2019-10-08 10:01:44'),(112,'KP','Korea, Democratic People\'s Republic of',1,'+850','2019-10-08 10:01:44','2019-10-08 10:01:44'),(113,'KR','Korea, Republic of',1,'+82','2019-10-08 10:01:44','2019-10-08 10:01:44'),(114,'KW','Kuwait',1,'+965','2019-10-08 10:01:44','2019-10-08 10:01:44'),(115,'KG','Kyrgyzstan',1,'+996','2019-10-08 10:01:44','2019-10-08 10:01:44'),(116,'LA','Lao People\'s Democratic Republic',1,'+856','2019-10-08 10:01:44','2019-10-08 10:01:44'),(117,'LV','Latvia',1,'+371','2019-10-08 10:01:44','2019-10-08 10:01:44'),(118,'LB','Lebanon',1,'+961','2019-10-08 10:01:44','2019-10-08 10:01:44'),(119,'LS','Lesotho',1,'+266','2019-10-08 10:01:44','2019-10-08 10:01:44'),(120,'LR','Liberia',1,'+231','2019-10-08 10:01:44','2019-10-08 10:01:44'),(121,'LY','Libyan Arab Jamahiriya',1,'+218','2019-10-08 10:01:44','2019-10-08 10:01:44'),(122,'LI','Liechtenstein',1,'+423','2019-10-08 10:01:44','2019-10-08 10:01:44'),(123,'LT','Lithuania',1,'+370','2019-10-08 10:01:44','2019-10-08 10:01:44'),(124,'LU','Luxembourg',1,'+352','2019-10-08 10:01:44','2019-10-08 10:01:44'),(125,'MO','Macao',1,'+853','2019-10-08 10:01:44','2019-10-08 10:01:44'),(126,'MK','Macedonia, The Former Yugoslav Republic of',1,'+389','2019-10-08 10:01:44','2019-10-08 10:01:44'),(127,'MG','Madagascar',1,'+261','2019-10-08 10:01:44','2019-10-08 10:01:44'),(128,'MW','Malawi',1,'+265','2019-10-08 10:01:44','2019-10-08 10:01:44'),(129,'MY','Malaysia',1,'+60','2019-10-08 10:01:44','2019-10-08 10:01:44'),(130,'MV','Maldives',1,'+960','2019-10-08 10:01:44','2019-10-08 10:01:44'),(131,'ML','Mali',1,'+223','2019-10-08 10:01:44','2019-10-08 10:01:44'),(132,'MT','Malta',1,'+356','2019-10-08 10:01:44','2019-10-08 10:01:44'),(133,'MH','Marshall Islands',1,'+692','2019-10-08 10:01:44','2019-10-08 10:01:44'),(134,'MQ','Martinique',1,'+596','2019-10-08 10:01:44','2019-10-08 10:01:44'),(135,'MR','Mauritania',1,'+222','2019-10-08 10:01:44','2019-10-08 10:01:44'),(136,'MU','Mauritius',1,'+230','2019-10-08 10:01:44','2019-10-08 10:01:44'),(137,'YT','Mayotte',1,'+262','2019-10-08 10:01:44','2019-10-08 10:01:44'),(138,'MX','Mexico',1,'+52','2019-10-08 10:01:44','2019-10-08 10:01:44'),(139,'FM','Micronesia, Federated States of',1,'+691','2019-10-08 10:01:44','2019-10-08 10:01:44'),(140,'MD','Moldova, Republic of',1,'+373','2019-10-08 10:01:44','2019-10-08 10:01:44'),(141,'MC','Monaco',1,'+377','2019-10-08 10:01:44','2019-10-08 10:01:44'),(142,'MN','Mongolia',1,'+976','2019-10-08 10:01:44','2019-10-08 10:01:44'),(143,'ME','Montenegro',1,'+382','2019-10-08 10:01:44','2019-10-08 10:01:44'),(144,'MS','Montserrat',1,'+1664','2019-10-08 10:01:44','2019-10-08 10:01:44'),(145,'MA','Morocco',1,'+212','2019-10-08 10:01:44','2019-10-08 10:01:44'),(146,'MZ','Mozambique',1,'+258','2019-10-08 10:01:44','2019-10-08 10:01:44'),(147,'MM','Myanmar',1,'+95','2019-10-08 10:01:44','2019-10-08 10:01:44'),(148,'NA','Namibia',1,'+264','2019-10-08 10:01:44','2019-10-08 10:01:44'),(149,'NR','Nauru',1,'+674','2019-10-08 10:01:44','2019-10-08 10:01:44'),(150,'NP','Nepal',1,'+977','2019-10-08 10:01:44','2019-10-08 10:01:44'),(151,'NL','Netherlands',1,'+31','2019-10-08 10:01:44','2019-10-08 10:01:44'),(152,'AN','Netherlands Antilles',1,'+599','2019-10-08 10:01:44','2019-10-08 10:01:44'),(153,'NC','New Caledonia',1,'+687','2019-10-08 10:01:44','2019-10-08 10:01:44'),(154,'NZ','New Zealand',1,'+64','2019-10-08 10:01:44','2019-10-08 10:01:44'),(155,'NI','Nicaragua',1,'+505','2019-10-08 10:01:44','2019-10-08 10:01:44'),(156,'NE','Niger',1,'+227','2019-10-08 10:01:44','2019-10-08 10:01:44'),(157,'NG','Nigeria',1,'+234','2019-10-08 10:01:44','2019-10-08 10:01:44'),(158,'NU','Niue',1,'+683','2019-10-08 10:01:44','2019-10-08 10:01:44'),(159,'NF','Norfolk Island',1,'+672','2019-10-08 10:01:44','2019-10-08 10:01:44'),(160,'NO','Norway',1,'+47','2019-10-08 10:01:44','2019-10-08 10:01:44'),(161,'OM','Oman',1,'+968','2019-10-08 10:01:44','2019-10-08 10:01:44'),(162,'MP','Northern Mariana Islands',1,'+1 670','2019-10-08 10:01:44','2019-10-08 10:01:44'),(163,'PK','Pakistan',1,'+92','2019-10-08 10:01:44','2019-10-08 10:01:44'),(164,'PW','Palau',1,'+680','2019-10-08 10:01:44','2019-10-08 10:01:44'),(165,'PS','Palestinian Territory, Occupied',1,'+970','2019-10-08 10:01:44','2019-10-08 10:01:44'),(166,'PA','Panama',1,'+507','2019-10-08 10:01:44','2019-10-08 10:01:44'),(167,'PG','Papua New Guinea',1,'+675','2019-10-08 10:01:44','2019-10-08 10:01:44'),(168,'PY','Paraguay',1,'+595','2019-10-08 10:01:44','2019-10-08 10:01:44'),(169,'PE','Peru',1,'+51','2019-10-08 10:01:44','2019-10-08 10:01:44'),(170,'PH','Philippines',1,'+63','2019-10-08 10:01:44','2019-10-08 10:01:44'),(171,'PN','Pitcairn',1,'+872','2019-10-08 10:01:44','2019-10-08 10:01:44'),(172,'PL','Poland',1,'+48','2019-10-08 10:01:44','2019-10-08 10:01:44'),(173,'PT','Portugal',1,'+351','2019-10-08 10:01:44','2019-10-08 10:01:44'),(174,'PR','Puerto Rico',1,'+1 939','2019-10-08 10:01:44','2019-10-08 10:01:44'),(175,'QA','Qatar',1,'+974','2019-10-08 10:01:44','2019-10-08 10:01:44'),(176,'RO','Romania',1,'+40','2019-10-08 10:01:44','2019-10-08 10:01:44'),(177,'RU','Russia',1,'+7','2019-10-08 10:01:44','2019-10-08 10:01:44'),(178,'RW','Rwanda',1,'+250','2019-10-08 10:01:44','2019-10-08 10:01:44'),(179,'RE','R√©union',1,'+262','2019-10-08 10:01:44','2019-10-08 10:01:44'),(180,'BL','Saint Barth√©lemy',1,'+590','2019-10-08 10:01:44','2019-10-08 10:01:44'),(181,'SH','Saint Helena, Ascension and Tristan Da Cunha',1,'+290','2019-10-08 10:01:44','2019-10-08 10:01:44'),(182,'KN','Saint Kitts and Nevis',1,'+1 869','2019-10-08 10:01:44','2019-10-08 10:01:44'),(183,'LC','Saint Lucia',1,'+1 758','2019-10-08 10:01:44','2019-10-08 10:01:44'),(184,'MF','Saint Martin',1,'+590','2019-10-08 10:01:44','2019-10-08 10:01:44'),(185,'PM','Saint Pierre and Miquelon',1,'+508','2019-10-08 10:01:44','2019-10-08 10:01:44'),(186,'VC','Saint Vincent and the Grenadines',1,'+1 784','2019-10-08 10:01:44','2019-10-08 10:01:44'),(187,'WS','Samoa',1,'+685','2019-10-08 10:01:44','2019-10-08 10:01:44'),(188,'SM','San Marino',1,'+378','2019-10-08 10:01:44','2019-10-08 10:01:44'),(189,'ST','Sao Tome and Principe',1,'+239','2019-10-08 10:01:44','2019-10-08 10:01:44'),(190,'SA','Saudi Arabia',1,'+966','2019-10-08 10:01:44','2019-10-08 10:01:44'),(191,'SN','Senegal',1,'+221','2019-10-08 10:01:44','2019-10-08 10:01:44'),(192,'RS','Serbia',1,'+381','2019-10-08 10:01:44','2019-10-08 10:01:44'),(193,'SC','Seychelles',1,'+248','2019-10-08 10:01:44','2019-10-08 10:01:44'),(194,'SL','Sierra Leone',1,'+232','2019-10-08 10:01:44','2019-10-08 10:01:44'),(195,'SG','Singapore',1,'+65','2019-10-08 10:01:44','2019-10-08 10:01:44'),(196,'SK','Slovakia',1,'+421','2019-10-08 10:01:44','2019-10-08 10:01:44'),(197,'SI','Slovenia',1,'+386','2019-10-08 10:01:44','2019-10-08 10:01:44'),(198,'SB','Solomon Islands',1,'+677','2019-10-08 10:01:44','2019-10-08 10:01:44'),(199,'SO','Somalia',1,'+252','2019-10-08 10:01:44','2019-10-08 10:01:44'),(200,'ZA','South Africa',1,'+27','2019-10-08 10:01:44','2019-10-08 10:01:44'),(201,'GS','South Georgia and the South Sandwich Islands',1,'+500','2019-10-08 10:01:44','2019-10-08 10:01:44'),(202,'ES','Spain',1,'+34','2019-10-08 10:01:44','2019-10-08 10:01:44'),(203,'LK','Sri Lanka',1,'+94','2019-10-08 10:01:44','2019-10-08 10:01:44'),(204,'SD','Sudan',1,'+249','2019-10-08 10:01:44','2019-10-08 10:01:44'),(205,'SR','Suriname',1,'+597','2019-10-08 10:01:44','2019-10-08 10:01:44'),(206,'SJ','Svalbard and Jan Mayen',1,'+47','2019-10-08 10:01:44','2019-10-08 10:01:44'),(207,'SZ','Swaziland',1,'+268','2019-10-08 10:01:44','2019-10-08 10:01:44'),(208,'SE','Sweden',1,'+46','2019-10-08 10:01:44','2019-10-08 10:01:44'),(209,'CH','Switzerland',1,'+41','2019-10-08 10:01:44','2019-10-08 10:01:44'),(210,'SY','Syrian Arab Republic',1,'+963','2019-10-08 10:01:44','2019-10-08 10:01:44'),(211,'TW','Taiwan, Province of China',1,'+886','2019-10-08 10:01:44','2019-10-08 10:01:44'),(212,'TJ','Tajikistan',1,'+992','2019-10-08 10:01:44','2019-10-08 10:01:44'),(213,'TZ','Tanzania, United Republic of',1,'+255','2019-10-08 10:01:44','2019-10-08 10:01:44'),(214,'TH','Thailand',1,'+66','2019-10-08 10:01:44','2019-10-08 10:01:44'),(215,'TL','Timor-Leste',1,'+670','2019-10-08 10:01:44','2019-10-08 10:01:44'),(216,'TG','Togo',1,'+228','2019-10-08 10:01:44','2019-10-08 10:01:44'),(217,'TK','Tokelau',1,'+690','2019-10-08 10:01:44','2019-10-08 10:01:44'),(218,'TO','Tonga',1,'+676','2019-10-08 10:01:44','2019-10-08 10:01:44'),(219,'TT','Trinidad and Tobago',1,'+1 868','2019-10-08 10:01:44','2019-10-08 10:01:44'),(220,'TN','Tunisia',1,'+216','2019-10-08 10:01:44','2019-10-08 10:01:44'),(221,'TR','Turkey',1,'+90','2019-10-08 10:01:44','2019-10-08 10:01:44'),(222,'TM','Turkmenistan',1,'+993','2019-10-08 10:01:44','2019-10-08 10:01:44'),(223,'TC','Turks and Caicos Islands',1,'+1 649','2019-10-08 10:01:44','2019-10-08 10:01:44'),(224,'TV','Tuvalu',1,'+688','2019-10-08 10:01:44','2019-10-08 10:01:44'),(225,'UG','Uganda',1,'+256','2019-10-08 10:01:44','2019-10-08 10:01:44'),(226,'UA','Ukraine',1,'+380','2019-10-08 10:01:44','2019-10-08 10:01:44'),(227,'AE','United Arab Emirates',1,'+971','2019-10-08 10:01:44','2019-10-08 10:01:44'),(228,'GB','United Kingdom',1,'+44','2019-10-08 10:01:44','2019-10-08 10:01:44'),(229,'US','United States',1,'+1','2019-10-08 10:01:44','2019-10-08 10:01:44'),(230,'UY','Uruguay',1,'+598','2019-10-08 10:01:44','2019-10-08 10:01:44'),(231,'UZ','Uzbekistan',1,'+998','2019-10-08 10:01:44','2019-10-08 10:01:44'),(232,'VU','Vanuatu',1,'+678','2019-10-08 10:01:44','2019-10-08 10:01:44'),(233,'VE','Venezuela, Bolivarian Republic of',1,'+58','2019-10-08 10:01:44','2019-10-08 10:01:44'),(234,'VN','Viet Nam',1,'+84','2019-10-08 10:01:44','2019-10-08 10:01:44'),(235,'VG','Virgin Islands, British',1,'+1 284','2019-10-08 10:01:44','2019-10-08 10:01:44'),(236,'VI','Virgin Islands, U.S.',1,'+1 340','2019-10-08 10:01:44','2019-10-08 10:01:44'),(237,'WF','Wallis and Futuna',1,'+681','2019-10-08 10:01:44','2019-10-08 10:01:44'),(238,'YE','Yemen',1,'+967','2019-10-08 10:01:44','2019-10-08 10:01:44'),(239,'ZM','Zambia',1,'+260','2019-10-08 10:01:44','2019-10-08 10:01:44'),(240,'ZW','Zimbabwe',1,'+263','2019-10-08 10:01:44','2019-10-08 10:01:44'),(241,'AX','√Öland Islands',1,'+358','2019-10-08 10:01:44','2019-10-08 10:01:44');
/*!40000 ALTER TABLE `Country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Currencies`
--

DROP TABLE IF EXISTS `Currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Currencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `symbol` varchar(255) NOT NULL,
  `isEnable` tinyint(1) NOT NULL DEFAULT '1',
  `isBaseCurrency` tinyint(1) NOT NULL DEFAULT '0',
  `isPayment` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Currencies`
--

LOCK TABLES `Currencies` WRITE;
/*!40000 ALTER TABLE `Currencies` DISABLE KEYS */;
INSERT INTO `Currencies` VALUES (1,'BRL',1,0,1,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(2,'AUD',1,0,1,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(3,'CAD',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(4,'BGN',1,0,1,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(5,'CHF',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(6,'CNY',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(7,'CZK',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(8,'DKK',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(9,'EUR',1,0,1,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(10,'GBP',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(11,'HKD',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(12,'HRK',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(13,'HUF',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(14,'IDR',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(15,'ILS',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(16,'INR',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(17,'JPY',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(18,'KRW',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(19,'MXN',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(20,'MYR',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(21,'NOK',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(22,'NZD',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(23,'PHP',1,0,1,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(24,'PLN',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(25,'RON',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(26,'RUB',1,0,1,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(27,'SEK',1,0,0,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(28,'SGD',1,0,1,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(29,'THB',1,0,1,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(30,'TRY',1,0,1,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(31,'USD',1,1,1,'2019-10-08 10:01:44','2020-03-05 10:14:48'),(32,'ZAR',1,0,1,'2019-10-08 10:01:44','2020-03-05 10:14:48');
/*!40000 ALTER TABLE `Currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CurrencyRates`
--

DROP TABLE IF EXISTS `CurrencyRates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CurrencyRates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `currencyCode` varchar(255) NOT NULL,
  `rate` float NOT NULL,
  `isBase` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CurrencyRates`
--

LOCK TABLES `CurrencyRates` WRITE;
/*!40000 ALTER TABLE `CurrencyRates` DISABLE KEYS */;
INSERT INTO `CurrencyRates` VALUES (1,'AED',3.67309,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(2,'AFN',76.1732,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(3,'ALL',107.945,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(4,'AMD',479.506,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(5,'ANG',1.79287,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(6,'AOA',491.888,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(7,'ARS',62.4258,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(8,'ATOM',0.333778,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(9,'AUD',1.52629,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(10,'AWG',1.8,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(11,'AZN',1.7025,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(12,'BAM',1.71461,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(13,'BAT',5.08033,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(14,'BBD',2,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(15,'BCH',0.00374848,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(16,'BDT',84.965,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(17,'BGN',1.72088,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(18,'BHD',0.377181,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(19,'BIF',1890.18,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(20,'BMD',1,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(21,'BND',1.38585,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(22,'BOB',6.90615,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(23,'BRL',4.7249,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(24,'BSD',1,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(25,'BSV',0.00505373,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(26,'BTC',0.000126283,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(27,'BTN',74.0755,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(28,'BWP',11.2099,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(29,'BYN',2.35874,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(30,'BYR',23587.4,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(31,'BZD',2.01316,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(32,'CAD',1.3633,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(33,'CDF',1700.21,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(34,'CHF',0.934496,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(35,'CLF',0.031158,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(36,'CLP',841.2,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(37,'CNH',6.93756,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(38,'CNY',6.9378,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(39,'COP',3609.99,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(40,'CRC',570.01,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(41,'CUC',1,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(42,'CVE',97.25,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(43,'CZK',22.4146,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(44,'DAI',0.993593,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(45,'DASH',0.013749,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(46,'DJF',178,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(47,'DKK',6.5733,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(48,'DOP',53.1941,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(49,'DZD',119.371,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(50,'EEK',14.6137,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(51,'EGP',15.7062,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(52,'EOS',0.328893,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(53,'ERN',14.9996,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(54,'ETB',32.4282,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(55,'ETC',0.148887,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(56,'ETH',0.00499139,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(57,'EUR',0.880426,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(58,'FJD',2.2032,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(59,'FKP',0.76718,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(60,'GBP',0.76718,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(61,'GEL',2.79,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(62,'GGP',0.76718,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(63,'GHS',5.50875,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(64,'GIP',0.76718,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(65,'GMD',50.94,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(66,'GNF',9549.58,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(67,'GTQ',7.68229,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(68,'GYD',209.881,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(69,'HKD',7.7714,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(70,'HNL',24.7099,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(71,'HRK',6.6137,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(72,'HTG',94.2521,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(73,'HUF',295.603,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(74,'IDR',14307,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(75,'ILS',3.5143,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(76,'IMP',0.76718,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(77,'INR',74.095,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(78,'IQD',1195.71,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(79,'ISK',128.44,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(80,'JEP',0.76718,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(81,'JMD',134.769,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(82,'JOD',0.7093,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(83,'JPY',104.616,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(84,'KES',102.85,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(85,'KGS',69.8503,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(86,'KHR',4088.79,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(87,'KMF',435.85,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(88,'KNC',1.3741,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(89,'KRW',1193.49,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(90,'KWD',0.30585,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(91,'KYD',0.834762,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(92,'KZT',386.636,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(93,'LAK',8911.57,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(94,'LBP',1514.43,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(95,'LINK',0.247381,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(96,'LKR',182.212,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(97,'LRD',198,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(98,'LSL',16.035,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(99,'LTC',0.020202,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(100,'LTL',3.22484,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(101,'LVL',0.656261,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(102,'LYD',1.3917,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(103,'MAD',9.44374,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(104,'MDL',17.3446,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(105,'MGA',3690.9,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(106,'MKD',54.0423,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(107,'MMK',1364.66,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(108,'MNT',2757.25,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(109,'MOP',8.01624,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(110,'MRO',357,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(111,'MTL',0.683738,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(112,'MUR',37.05,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(113,'MVR',15.5,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(114,'MWK',736.737,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(115,'MXN',20.4627,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(116,'MYR',4.225,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(117,'MZN',65.602,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(118,'NAD',15.68,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(119,'NGN',366.49,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(120,'NIO',33.7885,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(121,'NOK',9.54016,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(122,'NPR',118.517,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(123,'NZD',1.5886,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(124,'OMR',0.385061,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(125,'OXT',4.47728,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(126,'PAB',1,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(127,'PEN',3.47663,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(128,'PGK',3.4693,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(129,'PHP',50.5155,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(130,'PKR',157.897,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(131,'PLN',3.79829,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(132,'PYG',6543.33,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(133,'QAR',3.64751,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(134,'REP',0.0804505,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(135,'RON',4.2453,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(136,'RSD',103.535,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(137,'RUB',72.373,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(138,'RWF',953.189,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(139,'SAI',0.993593,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(140,'SAR',3.75383,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(141,'SBD',8.26088,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(142,'SCR',13.7045,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(143,'SEK',9.47532,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(144,'SGD',1.38808,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(145,'SHP',0.76718,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(146,'SLL',7607.17,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(147,'SOS',579.388,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(148,'SRD',7.458,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(149,'SSP',130.26,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(150,'STD',22052.8,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(151,'SVC',8.76491,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(152,'SZL',16.0266,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(153,'THB',31.4257,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(154,'TJS',9.69759,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(155,'TMT',3.5,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(156,'TND',2.7975,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(157,'TOP',2.30903,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(158,'TRY',6.1391,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(159,'TTD',6.76743,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(160,'TWD',29.933,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(161,'TZS',2304.4,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(162,'UAH',25.0563,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(163,'UGX',3720.91,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(164,'USD',1,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(165,'USDC',1,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(166,'UYU',41.6465,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(167,'UZS',9526.74,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(168,'VEF',248488,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(169,'VES',73095.2,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(170,'VND',23312.3,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(171,'VUV',118.299,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(172,'WST',2.676,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(173,'XAF',577.522,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(174,'XAG',0.0586253,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(175,'XAU',0.00060215,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(176,'XCD',2.70255,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(177,'XDR',0.716546,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(178,'XLM',19.5697,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(179,'XOF',577.522,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(180,'XPD',0.00039953,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(181,'XPF',105.063,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(182,'XPT',0.00114026,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(183,'XRP',4.83676,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(184,'XTZ',0.395249,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(185,'YER',250.3,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(186,'ZAR',15.8722,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(187,'ZEC',0.0242248,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(188,'ZMK',5253.08,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(189,'ZMW',15.3743,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(190,'ZRX',4.39947,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(191,'ZWL',322,0,'2020-03-10 07:00:01','2020-03-10 07:00:01'),(192,'USD',1,1,'2020-03-10 07:00:01','2020-03-10 07:00:01');
/*!40000 ALTER TABLE `CurrencyRates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmailToken`
--

DROP TABLE IF EXISTS `EmailToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EmailToken` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `EmailToken_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmailToken`
--

LOCK TABLES `EmailToken` WRITE;
/*!40000 ALTER TABLE `EmailToken` DISABLE KEYS */;
/*!40000 ALTER TABLE `EmailToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmergencyContact`
--

DROP TABLE IF EXISTS `EmergencyContact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EmergencyContact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `contactName` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmergencyContact`
--

LOCK TABLES `EmergencyContact` WRITE;
/*!40000 ALTER TABLE `EmergencyContact` DISABLE KEYS */;
/*!40000 ALTER TABLE `EmergencyContact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FailedTransactionHistory`
--

DROP TABLE IF EXISTS `FailedTransactionHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FailedTransactionHistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) NOT NULL,
  `driverId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `riderId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `amount` float NOT NULL,
  `currency` varchar(255) NOT NULL,
  `reason` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FailedTransactionHistory`
--

LOCK TABLES `FailedTransactionHistory` WRITE;
/*!40000 ALTER TABLE `FailedTransactionHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `FailedTransactionHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HomePage`
--

DROP TABLE IF EXISTS `HomePage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `HomePage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HomePage`
--

LOCK TABLES `HomePage` WRITE;
/*!40000 ALTER TABLE `HomePage` DISABLE KEYS */;
INSERT INTO `HomePage` VALUES (1,'Home Section Image 1','homeSectionImage1','1fe9b385f87a9289bcce197fdd124fe0.png','2020-03-05 04:45:25','2021-02-12 12:37:48'),(2,'Home Section Image 2','homeSectionImage2','6924c7787b71b3c47fac257eea7ce8c6.png','2020-03-05 04:45:25','2021-02-12 12:37:48'),(3,'Home Section Image 5','homeSectionImage5','0e5a205bc1716e222c8312eb00c170a8.png','2020-03-05 04:45:25','2021-02-12 12:37:48'),(4,'Home Section Button 1','homeSectionButton1','GET IT','2020-03-05 04:45:25','2021-02-12 12:37:48'),(5,'Home Section Image 3','homeSectionImage3','b34c1c1d07fc110a364dfe1c6dc3aac7.png','2020-03-05 04:45:25','2021-02-12 12:37:48'),(6,'Home Section Image 4','homeSectionImage4','bbb6b6c816732c74088a248faf992533.png','2020-03-05 04:45:25','2021-02-12 12:37:48'),(7,'Home Section Image 6','homeSectionImage6','6256d4bfafae04465cc0446a2973ae98.png','2020-03-05 04:45:25','2021-02-12 12:37:48'),(8,'City Section Title 1','citySectionTitle1','Lorem Ipsum  ','2020-03-05 04:45:25','2020-03-05 06:45:33'),(9,'Home Section Title 1','homeSectionTitle1','Start Riding With Your Site','2020-03-05 04:45:25','2021-02-12 12:37:48'),(10,'About Grid Image 1','aboutGridImage1','8814a348c03269b2e335da57a18418c5.png','2020-03-05 04:45:25','2020-05-09 15:39:58'),(11,'City Section Content 1','citySectionContent1','Percipit repudiandae an eum, enim case eos no. Percipit tractatos pertinacia cum id, ad eos facete malorum recusabo, vis insolens perpetua definitionem ex.Percipit','2020-03-05 04:45:25','2020-03-05 06:45:33'),(12,'About Grid Image 2','aboutGridImage2','f7593d69084b8bb4e1cafbd9270e2b32.png','2020-03-05 04:45:25','2020-05-09 15:39:58'),(13,'About Grid Title 1','aboutGridTitle1',' Lorem Ipsum','2020-03-05 04:45:25','2020-05-09 15:39:58'),(14,'About Grid Title 2','aboutGridTitle2',' Lorem Ipsum','2020-03-05 04:45:25','2020-05-09 15:39:58'),(15,'About Grid Title 3','aboutGridTitle3',' Lorem Ipsum','2020-03-05 04:45:25','2020-05-09 15:39:59'),(16,'About Grid Title 4','aboutGridTitle4',' Lorem Ipsum','2020-03-05 04:45:25','2020-05-09 15:39:59'),(17,'About Grid Title 5','aboutGridTitle5',' Lorem Ipsum','2020-03-05 04:45:25','2020-05-09 15:39:59'),(18,'About Grid Title 6','aboutGridTitle6',' Lorem Ipsum','2020-03-05 04:45:25','2020-05-09 15:39:59'),(19,'About Grid Content 1','aboutGridContent1','  Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mei.','2020-03-05 04:45:25','2020-05-09 15:39:59'),(20,'About Grid Content 3','aboutGridContent3','  Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mei.','2020-03-05 04:45:25','2020-05-09 15:39:59'),(21,'About Grid Content 2','aboutGridContent2','  Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mei.','2020-03-05 04:45:25','2020-05-09 15:39:59'),(22,'About Grid Content 4','aboutGridContent4','  Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mei.','2020-03-05 04:45:25','2020-05-09 15:40:00'),(23,'About Grid Content 6','aboutGridContent6','  Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mei.','2020-03-05 04:45:25','2020-05-09 15:40:00'),(24,'About Grid Content 5','aboutGridContent5','  Id per gloriatur tincidunt. Vim odio unum atomorum at. Ut essent dicunt dolorum mei.','2020-03-05 04:45:25','2020-05-09 15:40:00'),(25,'Safety Grid Title 1','safetyGridTitle1','Download The Rider App','2020-03-05 04:45:25','2021-02-12 12:37:59'),(26,'Safety Grid Content 1','safetyGridContent1','Delectus scaevola elaboraret vel ad, vis no noster vocent prodesset, nec ei omittantur dissentiet. Nobis postea ei est.','2020-03-05 04:45:25','2021-02-12 12:37:59'),(27,'Safety Grid Image 1','safetyGridImage1','cb32ffbe4cedbe62179c8880ac173552.png','2020-03-05 04:45:25','2021-02-12 12:37:59'),(28,'Safety Grid Image 2','safetyGridImage2','5c4716ae4ee24bc9673b2fa9ec26f36e.png','2020-03-05 04:45:25','2021-02-12 12:37:59'),(29,'Safety Grid Image 3','safetyGridImage3','84f2709ba5f38c685841a61bac400814.png','2020-03-05 04:45:25','2021-02-12 12:37:59'),(30,'Signup Grid Image 1','signupGridImage1','4532f511e069786cbad7f72dbcc1435b.png','2020-03-05 04:45:25','2021-02-12 12:38:08'),(31,'Signup Grid Image 2','signupGridImage2','4a76a5b890bed022bc6042722f7e53c4.png','2020-03-05 04:45:25','2021-02-12 12:38:08'),(32,'Signup Grid Image 3','signupGridImage3','fc2237b6834ab5e1680dadee95b4731f.png','2020-03-05 04:45:25','2021-02-12 12:38:08'),(33,'Signup Grid Title 1','signupGridTitle1','Download The Driver App','2020-03-05 04:45:25','2021-02-12 12:38:08'),(34,'Signup Grid Content 1','signupGridContent1','Delectus scaevola elaboraret vel ad, vis no noster vocent prodesset, nec ei omittantur dissentiet. Nobis postea ei est.','2020-03-05 04:45:25','2021-02-12 12:38:08'),(35,'Footer Title 1','footerTitle1','About Us','2020-03-05 04:45:25','2021-02-12 11:52:38'),(36,'Footer Content 1','footerContent1','An cum maiorum repudiandae, cu eam dolore bonorum probatus. Et legere sanctus cum, quot nostrud postulant ex mei. Ad ullum audire admodum eos. Ne eam quod habeo aeque, ad decoreos.','2020-03-05 04:45:25','2021-02-12 11:52:38'),(37,'Footer Logo 1','footerLogo1','06ccc93c0028f8c4fb125f28775ed0e7.png','2020-03-05 04:45:25','2021-02-12 11:52:38'),(38,'Footer Logo 2','footerLogo2','7f73a1336d36592e6d45ca02926fb686.png','2020-03-05 04:45:25','2021-02-12 11:52:38'),(39,'Footer Logo 3','footerLogo3','bf81d7b7bb7c2710c4ccedef876fbdba.png','2020-03-05 04:45:25','2021-02-12 11:52:38'),(40,'Footer Logo 4','footerLogo4','c0d0058403b540f405fae3b7aa236c81.png','2020-03-05 04:45:25','2021-02-12 11:52:38'),(41,'Footer Link 1','footerLink1','https://yourwebsite.com/1','2020-03-05 04:45:25','2021-02-12 11:52:38'),(42,'Footer Link 2','footerLink2','https://yourwebsite.com/2','2020-03-05 04:45:25','2021-02-12 11:52:38'),(43,'Footer Link 3','footerLink3','https://yourwebsite.com/3','2020-03-05 04:45:25','2021-02-12 11:52:38'),(44,'Footer Link 4','footerLink4','https://yourwebsite.com/4','2020-03-05 04:45:25','2021-02-12 11:52:38'),(45,'Safety Grid Link 1','safetyGridLink1','https://play.google.com','2020-03-05 04:45:25','2021-02-12 12:37:59'),(46,'Safety Grid Link 2','safetyGridLink2','https://apps.apple.com','2020-03-05 04:45:25','2021-02-12 12:37:59'),(47,'Signup Grid Link 1','signupGridLink1','https://play.google.com','2020-03-05 04:45:25','2021-02-12 12:38:08'),(48,'Signup Grid Link 2','signupGridLink2','https://apps.apple.com','2020-03-05 04:45:25','2021-02-12 12:38:08'),(49,'Footer Link Name 1','footerLinkName1','Start Riding','2020-03-05 04:45:25','2021-02-12 11:52:38'),(50,'Footer Link Name 2','footerLinkName2','Start Driving','2020-03-05 04:45:25','2021-02-12 11:52:38'),(51,'Footer Link Name 3','footerLinkName3','Contact Us','2020-03-05 04:45:25','2021-02-12 11:52:38'),(52,'Footer Link Name 4','footerLinkName4','Privacy Policy','2020-03-05 04:45:25','2021-02-12 11:52:38'),(53,'Footer Link Title','footerLinkTitle','Useful Links','2020-03-05 04:45:25','2021-02-12 11:52:38'),(54,'Footer Bottom','footerBottom','Your Site 2021. All Rights Reserved','2020-03-05 04:45:25','2021-02-12 11:52:38'),(55,'Home Section Image 7','homeSectionImage7','5c5f2b0a270e4bd3eb9302c63ca51c12.png','2020-06-30 15:34:06','2021-02-12 12:37:48'),(56,'Home Section Image 8','homeSectionImage8','b59a9ddf3d36a1d81de58c9c1859dc1a.png','2020-06-30 15:34:06','2021-02-12 12:37:48');
/*!40000 ALTER TABLE `HomePage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Location`
--

DROP TABLE IF EXISTS `Location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationName` varchar(255) NOT NULL,
  `coordinates` text NOT NULL,
  `description` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `geometryCoordinates` polygon DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Location`
--

LOCK TABLES `Location` WRITE;
/*!40000 ALTER TABLE `Location` DISABLE KEYS */;
INSERT INTO `Location` VALUES (1,'World','[{\"lat\":81.74296351581049,\"lng\":-159.82291229369366},{\"lat\":83.99366845200866,\"lng\":-19.90103729369372},{\"lat\":82.23282724897581,\"lng\":101.03646270630622},{\"lat\":77.49584183279016,\"lng\":156.58333770630622},{\"lat\":70.88975190540886,\"lng\":167.83333770630622},{\"lat\":52.56646117787263,\"lng\":166.42708770630622},{\"lat\":38.92966499328289,\"lng\":157.98958770630622},{\"lat\":1.5436013294439104,\"lng\":160.09896270630622},{\"lat\":-32.43080032523527,\"lng\":167.13021270630622},{\"lat\":-46.4642054470642,\"lng\":108.77083770630622},{\"lat\":-48.8320440546434,\"lng\":33.536462706306224},{\"lat\":-52.39893978609436,\"lng\":-26.93228729369372},{\"lat\":-57.63058726111004,\"lng\":-76.15103729369372},{\"lat\":-33.02230669073638,\"lng\":-114.82291229369372},{\"lat\":20.76144584973123,\"lng\":-138.02603729369372},{\"lat\":47.1338300060915,\"lng\":-159.11978729369366},{\"lat\":62.00358151553921,\"lng\":-166.15103729369366},{\"lat\":66.56801413212942,\"lng\":-167.55728729369366},{\"lat\":71.34483751494282,\"lng\":-166.85416229369366},{\"lat\":77.03083845194367,\"lng\":-166.15103729369366}]','Covered all the countries in the world! ',1,'2020-03-09 06:32:24','2021-02-12 12:10:00',_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0æ°ÿ∂åoT@Äú)LU˙c¿mêCòˇT@\‰La™\Ê3¿\0˛B§\ÊéT@¯∆¨gUBY@£Ùaﬂª_S@|c÷≥™íc@9\“˘±Ò∏Q@|c÷≥™˙d@Sµ\ƒÃÅHJ@|c÷≥™\Õd@k13CˇvC@|c÷≥™øc@%a¿Nó≤¯?|c÷≥*d@\Ó˛\rw$7@¿|c÷≥*\‰d@\‚Ük;G¿¯∆¨gU1[@\'\√ikÄjH¿çYœ™\ƒ@@ú,{u3J¿\‰La™\Ó:¿Ù\ﬁW∑\–L¿9Sò™	S¿\ÌòÚ⁄Ç@¿9Sò™¥\\¿DE~\Ó\¬4@Çú)L\’@a¿x±uW!ëG@Äú)L\’\„c¿6\Ó[u\0O@Äú)L\’\ƒd¿YJÚWZ§P@Äú)L\’Òd¿AG^\—\÷Q@Äú)LU\€d¿´£\◊A˘AS@Äú)L\’\ƒd¿æ°ÿ∂åoT@Äú)LU˙c¿');
/*!40000 ALTER TABLE `Location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PaymentMethods`
--

DROP TABLE IF EXISTS `PaymentMethods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PaymentMethods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `processedIn` varchar(255) DEFAULT NULL,
  `fees` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `details` text,
  `isEnable` tinyint(1) NOT NULL DEFAULT '1',
  `paymentType` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PaymentMethods`
--

LOCK TABLES `PaymentMethods` WRITE;
/*!40000 ALTER TABLE `PaymentMethods` DISABLE KEYS */;
/*!40000 ALTER TABLE `PaymentMethods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payout`
--

DROP TABLE IF EXISTS `Payout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Payout` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `methodId` int(11) NOT NULL,
  `userId` char(36) NOT NULL,
  `payEmail` varchar(255) NOT NULL,
  `address1` mediumtext,
  `address2` mediumtext,
  `city` varchar(255) NOT NULL,
  `zipcode` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `currency` varchar(255) NOT NULL,
  `default` tinyint(1) NOT NULL DEFAULT '0',
  `last4Digits` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isVerified` tinyint(1) DEFAULT '0',
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `Payout_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payout`
--

LOCK TABLES `Payout` WRITE;
/*!40000 ALTER TABLE `Payout` DISABLE KEYS */;
/*!40000 ALTER TABLE `Payout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PrecautionNotification`
--

DROP TABLE IF EXISTS `PrecautionNotification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PrecautionNotification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `imageName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PrecautionNotification`
--

LOCK TABLES `PrecautionNotification` WRITE;
/*!40000 ALTER TABLE `PrecautionNotification` DISABLE KEYS */;
INSERT INTO `PrecautionNotification` VALUES (1,'Wear a mask! Save lives! Fight against COVID-19!','<p>Please ensure you follow the below steps for every ride, to keep you and your driver safe.</p><ul><li>Wear a face cover</li><li>Wash your hands</li><li>Keep a safe distance</li></ul>',1,'b8d80479a4500d505b7a201efd26f5e4.png','2021-02-12 11:54:18','2021-02-12 11:54:18');
/*!40000 ALTER TABLE `PrecautionNotification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pricing`
--

DROP TABLE IF EXISTS `Pricing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Pricing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryId` int(11) DEFAULT NULL,
  `locationId` int(11) DEFAULT NULL,
  `unitPrice` float DEFAULT '0',
  `minutePrice` float DEFAULT '0',
  `basePrice` float DEFAULT '0',
  `currency` varchar(255) DEFAULT 'USD',
  `riderFeeType` enum('fixed','percentage') DEFAULT 'percentage',
  `riderFeeValue` float NOT NULL,
  `driverFeeType` enum('fixed','percentage') DEFAULT 'percentage',
  `driverFeeValue` float NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `isSurgePrice` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pricing`
--

LOCK TABLES `Pricing` WRITE;
/*!40000 ALTER TABLE `Pricing` DISABLE KEYS */;
INSERT INTO `Pricing` VALUES (1,1,1,2,2,10,'USD','percentage',10,'percentage',10,1,0,'2020-05-09 15:54:52','2021-02-12 12:06:42'),(2,2,1,3,3,12,'USD','percentage',10,'percentage',10,1,0,'2020-05-09 15:55:21','2020-05-09 15:55:21'),(3,3,1,4,4,15,'USD','percentage',10,'percentage',10,1,0,'2020-05-09 15:55:42','2020-05-09 15:55:42'),(4,5,1,5,5,20,'USD','percentage',10,'percentage',10,1,0,'2020-05-09 15:56:06','2020-05-09 15:56:06'),(5,4,1,10,2,25,'USD','percentage',10,'percentage',10,1,0,'2020-05-09 15:56:31','2020-05-09 15:56:31');
/*!40000 ALTER TABLE `Pricing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PromoCode`
--

DROP TABLE IF EXISTS `PromoCode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PromoCode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `type` tinyint(4) DEFAULT '1',
  `promoValue` float NOT NULL DEFAULT '0',
  `currency` varchar(255) DEFAULT NULL,
  `expiryDate` datetime DEFAULT NULL,
  `isEnable` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PromoCode`
--

LOCK TABLES `PromoCode` WRITE;
/*!40000 ALTER TABLE `PromoCode` DISABLE KEYS */;
/*!40000 ALTER TABLE `PromoCode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reviews`
--

DROP TABLE IF EXISTS `Reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `bookingId` int(11) NOT NULL,
  `authorId` varchar(255) DEFAULT NULL,
  `ratings` float DEFAULT NULL,
  `reviewContent` mediumtext NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reviews`
--

LOCK TABLES `Reviews` WRITE;
/*!40000 ALTER TABLE `Reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SMSVerification`
--

DROP TABLE IF EXISTS `SMSVerification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SMSVerification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(255) NOT NULL,
  `phoneDialCode` varchar(255) NOT NULL,
  `userId` char(36) DEFAULT NULL,
  `deviceId` mediumtext,
  `deviceType` mediumtext,
  `otp` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SMSVerification`
--

LOCK TABLES `SMSVerification` WRITE;
/*!40000 ALTER TABLE `SMSVerification` DISABLE KEYS */;
/*!40000 ALTER TABLE `SMSVerification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SavedLocations`
--

DROP TABLE IF EXISTS `SavedLocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SavedLocations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `locationType` enum('home','work','other') DEFAULT NULL,
  `locationName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SavedLocations`
--

LOCK TABLES `SavedLocations` WRITE;
/*!40000 ALTER TABLE `SavedLocations` DISABLE KEYS */;
/*!40000 ALTER TABLE `SavedLocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ScheduleBooking`
--

DROP TABLE IF EXISTS `ScheduleBooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ScheduleBooking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `riderId` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `bookingId` int(11) NOT NULL,
  `tripStatus` enum('scheduled','completed','failed') DEFAULT NULL,
  `scheduleFrom` datetime DEFAULT NULL,
  `scheduleTo` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ScheduleBooking`
--

LOCK TABLES `ScheduleBooking` WRITE;
/*!40000 ALTER TABLE `ScheduleBooking` DISABLE KEYS */;
/*!40000 ALTER TABLE `ScheduleBooking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ScheduleBookingHistory`
--

DROP TABLE IF EXISTS `ScheduleBookingHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ScheduleBookingHistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `scheduleId` int(11) DEFAULT NULL,
  `tripStatus` enum('scheduled','completed','failed','updated') DEFAULT NULL,
  `scheduleFrom` datetime DEFAULT NULL,
  `scheduleTo` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ScheduleBookingHistory`
--

LOCK TABLES `ScheduleBookingHistory` WRITE;
/*!40000 ALTER TABLE `ScheduleBookingHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `ScheduleBookingHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20190926052943-addStripeFieldToProfile.js'),('20190927072518-addServiceFeeSettings.js'),('20191008070900-addCountriesTable.js'),('20191008073524-addCurrenciesTable.js'),('20191017094012-addactiveStatusFieldtoUser.js'),('20191029065327-updateBookingDatesFieldTypes.js'),('20191030065343-addCurrencyToBookingTable.js'),('20191030071733-addOverallRatingToUserTable.js'),('20191030074152-allowNullForTransactionIdToBookingTable.js'),('20191107055240-addRiderDriverTotalFareToBooking.js'),('20191114073847-addNotesColumnToBooking.js'),('20191202162352-addMinutePriceOnCategory.js'),('20191202170507-addMinutePriceToBooking.js'),('20191207141027-addVehicleIdToBooking.js'),('20191218055441-addCapacityColumn.js'),('20191227055513-addPhoneCountryCode.js'),('20200110151340-addRoleIdToAdminUser.js'),('20200113092830-deletedAtUser.js'),('20200116084426-deletedAtColumnAddedToUser.js'),('20200116122021-addWalletColumnsToUserProfile.js'),('20200122104428-addPromoCodeFieldsToBooking.js'),('20200203043316-addColumnsTips.js'),('20200204091208-addColumnsDriverTotalTips.js'),('20200205131034-paymentIntentColumns.js'),('20200207125112-removeUnwantedStripePaymentIntentColumns.js'),('20200208115100-addColumnIsActiveAtCancelReason.js'),('20200213080259-addColumnstollFee.js'),('20200219073437-addColumnLocation.js'),('20200219074738-addHomePageSettings.js'),('20200220064353-addColumnBooking.js'),('20200220080129-addPayoutColumn.js'),('20200224073822-addHomePageSettingExtraValues.js'),('20200305060009-isVerifiedAtPayoutTable.js'),('20200306064335-changeColumnReasonAtFailedTransactionHistory.js'),('20200309132008-changeIsVerifiedAtPayout.js'),('20200312105450-addPayoutHolderNames.js'),('20200313071146-insertStaticPageSupport.js'),('20200316115834-pageBannerAtStaticPage.js'),('20200316120223-insertStaticPageRiderAndDriver.js'),('20200406073458-changeCategoryColumnsAcceptNull.js'),('20200407045029-addPageBanner.js'),('20200407121624-changeVehicleStatus.js'),('20200407144649-changeVehicleStatus.js'),('20200409104455-changeCharacterSetContentPage.js'),('20200422091657-addPolygonColumnToLocation.js'),('20200429145337-addPricingIdToBooking.js'),('20200529054910-addExtraHomepageSettings.js'),('20201126073032-addVoipIdToModels.js'),('20201210051721-androidAndIosVersion.js'),('20201228070317-addRiderPayableFareInBooking.js'),('20201228071503-alterBookingTableDriverIdToNull.js'),('20201229094606-addNewEnumInBookingTable.js'),('20201230095552-addColumnBookingTypeInBooking.js'),('20210109101511-removeUnwatedVoipDeviceId.js'),('20210112074659-addRiderIdToScheduleBooking.js'),('20210121071549-addDriverPrivacyPolicyPage.js'),('20210201135022-changeDescriptionDataType.js'),('20210202084509-updateBookingTripStatusColumn.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteSettings`
--

DROP TABLE IF EXISTS `SiteSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SiteSettings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteSettings`
--

LOCK TABLES `SiteSettings` WRITE;
/*!40000 ALTER TABLE `SiteSettings` DISABLE KEYS */;
INSERT INTO `SiteSettings` VALUES (1,'Site Name','siteName','Your Site',NULL,'2020-02-10 13:05:03','2021-02-12 11:52:26'),(2,'Logo Height','logoHeight','34',NULL,'2020-02-10 13:05:03','2021-02-12 11:52:26'),(3,'Logo Width','logoWidth','140',NULL,'2020-02-10 13:05:03','2021-02-12 11:52:26'),(4,'Site Title','siteTitle','Your Site Title',NULL,'2020-02-10 13:05:03','2021-02-12 11:52:26'),(5,'Meta Description','metaDescription','Your Site Meta Description',NULL,'2020-02-10 13:05:03','2021-02-12 11:52:26'),(6,'Facebook Link','facebookLink','https://www.facebook.com/yoursite',NULL,'2020-02-10 13:05:03','2021-02-12 11:52:26'),(7,'Twitter Link','twitterLink','https://twitter.com/yoursite',NULL,'2020-02-10 13:05:03','2021-02-12 11:52:26'),(8,'Youtube Link','youtubeLink','https://www.youtube.com/yoursite',NULL,'2020-02-10 13:05:03','2021-02-12 11:52:26'),(9,'Instagram Link','instagramLink','https://www.instagram.com/yoursite',NULL,'2020-02-10 13:05:03','2021-02-12 11:52:26'),(10,'Meta Keyword','metaKeyword','Your Site Meta Keyword',NULL,'2020-02-10 13:05:03','2021-02-12 11:52:26'),(11,'Home Logo','homeLogo','3ae636aa7d8f90db5a176099461d7dda.png',NULL,'2020-02-10 13:05:03','2021-02-12 11:52:26'),(12,'App Force Update','appForceUpdate','true','appSettings','2021-01-11 07:22:55','2021-02-12 11:52:26'),(13,'Rider Android Version','riderAndroidVersion','1.0','appSettings','2021-01-11 07:22:55','2021-02-12 11:52:26'),(14,'Rider iOS Version','riderIosVersion','1.0','appSettings','2021-01-11 07:22:55','2021-02-12 11:52:26'),(15,'Driver Android Version','driverAndroidVersion','1.0','appSettings','2021-01-11 07:22:55','2021-02-12 11:52:26'),(16,'Driver iOS Version','driverIosVersion','1.0','appSettings','2021-01-11 07:22:55','2021-02-12 11:52:26');
/*!40000 ALTER TABLE `SiteSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StaticPage`
--

DROP TABLE IF EXISTS `StaticPage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `StaticPage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageName` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `metaTitle` varchar(255) NOT NULL,
  `metaDescription` text NOT NULL,
  `pageBanner` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StaticPage`
--

LOCK TABLES `StaticPage` WRITE;
/*!40000 ALTER TABLE `StaticPage` DISABLE KEYS */;
INSERT INTO `StaticPage` VALUES (1,'Support','<p>Email: support@yourdomain.com</p><p>Phone Number: +0 000 0000 000</p>','Support','Support',NULL,'2020-03-25 13:52:13','2020-03-25 13:55:28'),(2,'Rider','<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>','Rider','Rider','09068a14be5623a95877e3527cba3948.png','2020-03-25 13:52:37','2020-03-25 13:56:32'),(3,'Driver','<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.&nbsp;</p>','Driver','Driver','c26b9c70074fae38a6103283e5f038f5.png','2020-03-25 13:52:37','2020-03-25 13:57:02'),(4,'Driver Privacy Policy','<p><strong>Privacy Policy</strong></p><p>This Privacy Policy describes how your personal information is collected, used, and shared when you use our &lt;YOUR PROJECT&gt; application.</p><p>&lt;YOUR COMPANY&gt; built the &lt;YOUR PROJECT&gt;  app as a Free app. This SERVICE is provided by &lt;YOUR COMPANY&gt; at no cost and is intended for use as is.</p><p>This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.</p><p>If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p><p><br></p><p><strong>Information Collection and Use</strong></p><p>For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to Users(Driver Partners) live location, email address, and phone number. The information that we request will be retained by us and used as described in this privacy policy.</p><p>This app collects location data to enable \"live location tracking\" and \"receive ride requests\" even when the app is closed or not in use.&nbsp;We collect your live location for better communication with the rider.</p><p>The app does use third-party services that may collect information used to identify you.</p><p>Link to the privacy policy of third party service providers used by the app</p><ul><li><a href=\"https://www.google.com/policies/privacy/\" rel=\"noopener noreferrer\" target=\"_blank\">Google Play Services</a></li></ul><p><br></p><p><strong>Log Data</strong></p><p>We want to inform you that whenever you use our Service, in case of an error in the app we collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (‚ÄúIP‚Äù) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.</p><p><br></p><p><strong>Cookies</strong></p><p>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device\'s internal memory.</p><p>This Service does not use these ‚Äúcookies‚Äù explicitly. However, the app may use third party code and libraries that use ‚Äúcookies‚Äù to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.</p><p><br></p><p><strong>Service Providers</strong></p><p>We may employ third-party companies and individuals due to the following reasons:</p><ul><li>To facilitate our Service;</li><li>To provide the Service on our behalf;</li><li>To perform Service-related services; or</li></ul><p>To assist us in analyzing how our Service is used.</p><p>We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</p><p><br></p><p><strong>Security</strong></p><p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p><p><br></p><p><strong>Changes to This Privacy Policy</strong></p><p>We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.</p><p><br></p><p><strong>Contact Us</strong></p><p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at &lt;SUPPORT EMAIL ADDRESS&gt;.</p>','Privacy Policy','Privacy Policy',NULL,'2021-02-01 08:40:12','2021-02-01 09:36:19');
/*!40000 ALTER TABLE `StaticPage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TempImages`
--

DROP TABLE IF EXISTS `TempImages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TempImages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tableName` varchar(255) DEFAULT NULL,
  `fieldName` varchar(255) DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TempImages`
--

LOCK TABLES `TempImages` WRITE;
/*!40000 ALTER TABLE `TempImages` DISABLE KEYS */;
INSERT INTO `TempImages` VALUES (1,'SiteSettings','siteLogo',NULL,'2020-05-09 15:31:19','2021-02-12 11:52:26'),(2,'Homepage','aboutGridImage2',NULL,'2020-05-09 15:39:50','2020-05-09 15:40:00'),(3,'Homepage','aboutGridImage1',NULL,'2020-05-09 15:39:55','2020-05-09 15:40:00'),(4,'Homepage','signupGridImage2',NULL,'2020-05-09 16:00:18','2021-02-12 12:38:08'),(5,'Homepage','signupGridImage1',NULL,'2020-05-09 16:00:21','2021-02-12 12:38:08'),(6,'Homepage','signupGridImage3',NULL,'2020-05-09 16:01:20','2021-02-12 12:38:08'),(7,'Homepage','safetyGridImage2',NULL,'2020-05-09 16:01:34','2021-02-12 12:37:59'),(8,'Homepage','safetyGridImage1',NULL,'2020-05-09 16:01:37','2021-02-12 12:37:59'),(9,'Homepage','safetyGridImage3',NULL,'2020-05-09 16:01:41','2021-02-12 12:37:59'),(10,'Homepage','homeSectionImage1',NULL,'2020-05-09 16:02:37','2021-02-12 12:37:48'),(11,'Homepage','homeSectionImage2',NULL,'2020-05-09 16:02:45','2021-02-12 12:37:48'),(12,'Homepage','homeSectionImage3',NULL,'2020-05-09 16:02:52','2021-02-12 12:37:48'),(13,'Homepage','homeSectionImage4',NULL,'2020-05-09 16:02:59','2021-02-12 12:37:48'),(14,'Homepage','homeSectionImage5',NULL,'2020-05-09 16:03:08','2021-02-12 12:37:48'),(15,'Homepage','homeSectionImage6',NULL,'2020-05-09 16:03:19','2021-02-12 12:37:48'),(16,'ContentPage','pageBanner',NULL,'2020-05-09 16:10:37','2020-05-09 16:11:28'),(17,'Homepage','homeSectionImage7',NULL,'2020-06-30 17:46:15','2021-02-12 12:37:48'),(18,'Homepage','homeSectionImage8',NULL,'2020-06-30 17:46:25','2021-02-12 12:37:48'),(19,'PrecautionNotification','imageName',NULL,'2021-02-12 11:54:16','2021-02-12 11:54:18');
/*!40000 ALTER TABLE `TempImages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ThreadItems`
--

DROP TABLE IF EXISTS `ThreadItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ThreadItems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `threadId` int(11) NOT NULL,
  `bookingId` int(11) NOT NULL,
  `sentBy` varchar(255) NOT NULL,
  `sendTo` varchar(255) NOT NULL,
  `content` text,
  `isRead` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `threadId` (`threadId`),
  CONSTRAINT `threaditems_ibfk_1` FOREIGN KEY (`threadId`) REFERENCES `Threads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ThreadItems`
--

LOCK TABLES `ThreadItems` WRITE;
/*!40000 ALTER TABLE `ThreadItems` DISABLE KEYS */;
/*!40000 ALTER TABLE `ThreadItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Threads`
--

DROP TABLE IF EXISTS `Threads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Threads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) NOT NULL,
  `riderId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `driverId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `messageUpdatedDate` datetime DEFAULT NULL,
  `riderUnreadCount` int(11) DEFAULT '0',
  `driverUnreadCount` int(11) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Threads`
--

LOCK TABLES `Threads` WRITE;
/*!40000 ALTER TABLE `Threads` DISABLE KEYS */;
/*!40000 ALTER TABLE `Threads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TransactionHistory`
--

DROP TABLE IF EXISTS `TransactionHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TransactionHistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) NOT NULL,
  `driverId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `riderId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `amount` float NOT NULL,
  `currency` varchar(255) NOT NULL,
  `transactionId` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TransactionHistory`
--

LOCK TABLES `TransactionHistory` WRITE;
/*!40000 ALTER TABLE `TransactionHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `TransactionHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `phoneDialCode` varchar(255) NOT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `userStatus` enum('pending','active','inactive') DEFAULT 'pending',
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `isBan` tinyint(1) NOT NULL DEFAULT '0',
  `userType` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `activeStatus` enum('active','inactive') DEFAULT 'active',
  `overallRating` float DEFAULT '0',
  `phoneCountryCode` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserLogin`
--

DROP TABLE IF EXISTS `UserLogin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserLogin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` mediumtext,
  `userId` char(36) DEFAULT NULL,
  `deviceType` varchar(255) DEFAULT NULL,
  `deviceDetail` mediumtext,
  `deviceId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `UserLogin_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserLogin`
--

LOCK TABLES `UserLogin` WRITE;
/*!40000 ALTER TABLE `UserLogin` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserLogin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserProfile`
--

DROP TABLE IF EXISTS `UserProfile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserProfile` (
  `profileId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` char(36) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `preferredCurrency` varchar(255) DEFAULT 'USD',
  `preferredLanguage` varchar(255) DEFAULT 'en',
  `preferredPaymentMethod` tinyint(1) DEFAULT '1',
  `paymentCustomerId` varchar(255) DEFAULT NULL,
  `licenceFront` varchar(255) DEFAULT NULL,
  `licenceBack` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `cardLastFour` int(11) DEFAULT NULL,
  `cardToken` varchar(255) DEFAULT NULL,
  `sourceId` varchar(255) DEFAULT NULL,
  `walletBalance` float DEFAULT '0',
  `walletUsed` float DEFAULT '0',
  `paymentMethodId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`profileId`),
  UNIQUE KEY `profileId` (`profileId`),
  KEY `userId` (`userId`),
  CONSTRAINT `UserProfile_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserProfile`
--

LOCK TABLES `UserProfile` WRITE;
/*!40000 ALTER TABLE `UserProfile` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserProfile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserVerifiedInfo`
--

DROP TABLE IF EXISTS `UserVerifiedInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserVerifiedInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` char(36) NOT NULL,
  `isEmailConfirmed` tinyint(1) DEFAULT '0',
  `isLicenseFrontVerified` tinyint(1) DEFAULT '0',
  `isLicenseBackVerified` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `UserVerifiedInfo_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserVerifiedInfo`
--

LOCK TABLES `UserVerifiedInfo` WRITE;
/*!40000 ALTER TABLE `UserVerifiedInfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserVerifiedInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Vehicles`
--

DROP TABLE IF EXISTS `Vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` char(36) NOT NULL,
  `vehicleName` varchar(255) DEFAULT NULL,
  `vehicleNumber` varchar(255) DEFAULT NULL,
  `availableSeats` int(11) DEFAULT NULL,
  `vehicleType` int(11) DEFAULT NULL,
  `vehicleStatus` enum('pending','active','inactive') NOT NULL DEFAULT 'pending',
  `vehicleRC` varchar(255) DEFAULT NULL,
  `vehicleInsurance` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `vehicleType` (`vehicleType`),
  CONSTRAINT `Vehicles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Vehicles_ibfk_2` FOREIGN KEY (`vehicleType`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Vehicles`
--

LOCK TABLES `Vehicles` WRITE;
/*!40000 ALTER TABLE `Vehicles` DISABLE KEYS */;
/*!40000 ALTER TABLE `Vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WalletHistory`
--

DROP TABLE IF EXISTS `WalletHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WalletHistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `transactionId` varchar(255) NOT NULL,
  `cardLast4Digits` varchar(255) DEFAULT NULL,
  `customerId` varchar(255) DEFAULT NULL,
  `amount` float NOT NULL DEFAULT '0',
  `currency` varchar(255) NOT NULL DEFAULT 'USD',
  `paidBy` tinyint(4) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WalletHistory`
--

LOCK TABLES `WalletHistory` WRITE;
/*!40000 ALTER TABLE `WalletHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `WalletHistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-12 18:13:14
