import {
  Reservation,
  UserProfile,
  User,
  Listing,
  ListingData,
  ThreadItems
} from '../../../../data/models';
import { sendEmail } from '../../../sendEmail';

export async function emailBroadcast(id) {
  // Get Reservation Data
  const reservation = await Reservation.findOne({
    where: { id }
  });


  if (reservation) {
    // Get Host Data
    const host = await User.findOne({
      where: {
        id: reservation.hostId,
      },
      include: [
        {
          model: UserProfile,
          as: 'profile'
        }
      ],
      // raw: true
    });

    // Get Guest Data

    const guest = await User.findOne({
      where: {
        id: reservation.guestId,
      },
      include: [
        {
          model: UserProfile,
          as: 'profile'
        }
      ],
      // raw: true
    });

    // Get List Data
    const list = await Listing.findOne({
      where: {
        id: reservation.listId
      },
      include: [
        {
          model: ListingData,
          as: 'listingData'
        }
      ],
      // raw: true
    });


    // Get Thread Data
    const threadData = await ThreadItems.findOne({
      where: { reservationId: id },
      // raw: true
    });

    let reservationId = reservation.id;
    let confirmationCode = reservation.confirmationCode;
    let hostEmail = host && host.email;
    let hostName = host && host.profile.firstName;
    let guestEmail = guest && guest.email;
    let guestName = guest && guest.profile.firstName;
    let guestLastName = guest && guest.profile.lastName;
    let guestLocation = guest && guest.profile.location;
    let guestProfilePic = guest && guest.profile.picture;
    let guestJoinedDate = guest && guest.profile.createdAt;
    let checkIn = reservation.checkIn;
    let checkOut = reservation.checkOut;
    let guests = reservation.guests;
    let listTitle = list.title;
    let listCity = list.city;
    let allowedCheckInTime = list.listingData.checkInStart;
    let allowedCheckOutTime = list.listingData.checkOutStart;
    let basePrice = reservation.basePrice;
    let total = reservation.total;
    let hostServiceFee = reservation.hostServiceFee;
    let currency = reservation.currency;
    let isTour = reservation.isTour;
    let threadId;
    let insurance = reservation.insurance;
    let tax = reservation.tax;
    let guestServiceFee = reservation.guestServiceFee;
    let hostTotal = 0;
    if (threadData) {
      threadId = threadData.threadId;
    }

    // For Booking Request
    if (reservation.reservationState === 'pending') {
      // hostTotal = total - (insurance + tax + guestServiceFee);        
      hostTotal = total;
      // Send email to host
      let contentForHost = {
        reservationId,
        confirmationCode,
        hostName,
        guestName,
        checkIn,
        checkOut,
        listTitle,
        basePrice,
        total: hostTotal,
        hostServiceFee,
        currency
      };
      if (!isTour) {
        await sendEmail(hostEmail, 'bookingRequest', contentForHost);
      } else {
        await sendEmail(hostEmail, 'bookingTourRequest', contentForHost);
      }
      // Send email to guest
      let contentForguest = {
        reservationId,
        confirmationCode,
        hostName,
        guestName,
        checkIn,
        listTitle,
        threadId
      };
      if (!isTour) {
        await sendEmail(guestEmail, 'bookingRequestGuest', contentForguest);
      } else {
        await sendEmail(guestEmail, 'bookingTourRequestGuest', contentForguest);
      }
    }

    if (reservation.reservationState === 'approved') {
      // Send email to host
      let contentForHost = {
        reservationId,
        threadId,
        confirmationCode,
        guestName,
        guestLastName,
        guestLocation,
        guestProfilePic,
        guestJoinedDate,
        checkIn,
        checkOut,
        guests,
        allowedCheckInTime,
        allowedCheckOutTime
      };
      await sendEmail(hostEmail, 'bookingConfirmedToHost', contentForHost);

      // Send email to guest
      let contentForguest = {
        reservationId,
        hostName,
        guestName,
        listTitle,
        listCity,
        threadId
      };
      await sendEmail(guestEmail, 'bookingConfirmedToGuest', contentForguest);
    }
    return {
      status: 'email is sent'
    };
  } else {
    return {
      status: 'failed to send email'
    }
  }
}