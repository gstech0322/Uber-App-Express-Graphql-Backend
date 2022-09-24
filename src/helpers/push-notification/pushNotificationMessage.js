/*

Supported languages

English - en
Spanish - es
French - fr
Russian - ru
Japanese - ja	
Indonesian - id
Croatian - hr
arabic - ar
*/

export async function pushNotificationMessage(type, requestData, lang) {
    let title = '', message = '', requestLang;
    let supportedLang = ['en', 'es', 'fr', 'ru', 'ja', 'id', 'hr', 'ar'];
    requestLang = lang ? lang : 'en'; 
    requestLang = (supportedLang.indexOf(requestLang) >= 0) ? requestLang : 'en';
    
    // Driver Notifications
    if (type === 'tripRequest') {
        if (requestLang == 'en') {
            title = 'Hurray! You got a new trip!';
            message = 'Hurray! You got a new trip request, kindly Accept / Decline the request.';
        } else if (requestLang == 'es') {
            title = '¡Hurra! Tienes un nuevo viaje!';
            message = '¡Hurra! Recibió una nueva solicitud de viaje, acepte / rechace la solicitud.';
        } else if (requestLang == 'fr') {
            title = 'Hourra! Vous avez un nouveau voyage!';
            message = 'Hourra! Vous avez reçu une nouvelle demande de voyage, veuillez accepter / refuser la demande.';
        } else if (requestLang == 'ru') {
            title = 'Ура! Вы получили новую поездку!';
            message = 'Ура! Вы получили новый запрос на поездку. Примите / отклоните запрос.';
        } else if (requestLang == 'ja') {
            title = 'ほら！あなたは新しい旅行を得ました！';
            message = 'ほら！新しい旅行リクエストを受け取りました。リクエストを承諾/拒否してください。';
        } else if (requestLang == 'id') {
            title = 'Hore! Anda mendapat perjalanan baru!';
            message = 'Hore! Anda mendapat permintaan perjalanan baru, silakan Terima / Tolak permintaan.';
        } else if (requestLang == 'hr') {
            title = 'Hura! Dobili ste novo putovanje!';
            message = 'Hura! Dobili ste novi zahtjev za putovanje, ljubazno Prihvati / odbij zahtjev.';
        } else if (requestLang == 'ar') {
            title = 'يا هلا! لقد حصلت على رحلة جديدة!';
            message = 'يا هلا! لقد تلقيت طلب رحلة جديد ، برجاء قبول / رفض الطلب.';
        }
    }

    if (type === 'scheduleInitiate') {
        if (requestLang == 'en') {
            title = 'Oing-Oing! We are finding a driver for your ride!';
            message = 'Oing-Oing! We are finding a driver for your ride. Your booking ID #' + requestData['bookingId'];
        } else if (requestLang == 'es') {
            title = '¡Oing-¡Oing! Estamos encontrando un conductor para su viaje!';
            message = '¡Oing-¡Oing! Estamos encontrando un conductor para su viaje. Su identificación de reserva #' + requestData['bookingId'];
        } else if (requestLang == 'fr') {
            title = 'Oing-Oing! Nous recherchons un chauffeur pour votre trajet!';
            message = 'Oing-Oing! Nous recherchons un chauffeur pour votre trajet. Votre identifiant de réservation #' + requestData['bookingId'];
        } else if (requestLang == 'ru') {
            title = 'Ой-Ой! Мы ищем водителя для вашей поездки!';
            message = 'Ой-Ой! Мы ищем водителя для вашей поездки. Ваш номер бронирования #' + requestData['bookingId'];
        } else if (requestLang == 'ja') {
            title = 'Oing-Oing！私たちはあなたの乗車のためのドライバーを探しています!';
            message = 'Oing-Oing！私たちはあなたの乗車のためのドライバーを探しています. 予約ID #' + requestData['bookingId'];
        } else if (requestLang == 'id') {
            title = 'Oing-Oing! Kami mencari pengemudi untuk perjalanan Anda!';
            message = 'Oing-Oing! Kami mencari pengemudi untuk perjalanan Anda. ID pemesanan Anda #' + requestData['bookingId'];
        } else if (requestLang == 'hr') {
            title = 'Oing-Oing! Pronalazimo vozača za vašu vožnju!';
            message = 'Oing-Oing! Pronalazimo vozača za vašu vožnju. Vaš rezervacijski ID #' + requestData['bookingId'];
        } else if (requestLang == 'ar') {
            title = 'أوينج! أوينج! نحن نبحث عن سائق لرحلتك!';
            message = 'أوينج! أوينج! نحن نبحث عن سائق لرحلتك. معرف الحجز الخاص بك #' + requestData['bookingId'];
        }
    }


    if (type === 'scheduleFailed') {
        if (requestLang == 'en') {
            title = 'Sorry! No drivers available for your scheduled ride!';
            message = 'Sorry! No drivers available for your scheduled ride. Your booking ID #' + requestData['bookingId'];
        } else if (requestLang == 'es') {
            title = '¡Lo siento! ¡No hay conductores disponibles para su viaje programado!';
            message = '¡Lo siento! ¡No hay conductores disponibles para su viaje programado. Su identificación de reserva #' + requestData['bookingId'];
        } else if (requestLang == 'fr') {
            title = 'Pardon! Aucun chauffeur disponible pour votre trajet prévu!';
            message = 'Pardon! Aucun chauffeur disponible pour votre trajet prévu. Votre identifiant de réservation #' + requestData['bookingId'];
        } else if (requestLang == 'ru') {
            title = 'Сожалею! Нет доступных водителей для вашей запланированной поездки!';
            message = 'Сожалею! Нет доступных водителей для вашей запланированной поездки. Ваш номер бронирования #' + requestData['bookingId'];
        } else if (requestLang == 'ja') {
            title = 'ごめんなさい！予定されている乗車に利用できるドライバーはありません!';
            message = 'ごめんなさい！予定されている乗車に利用できるドライバーはありません. 予約ID #' + requestData['bookingId'];
        } else if (requestLang == 'id') {
            title = 'Maaf! Tidak ada pengemudi yang tersedia untuk perjalanan terjadwal Anda!';
            message = 'Maaf! Tidak ada pengemudi yang tersedia untuk perjalanan terjadwal Anda. ID pemesanan Anda #' + requestData['bookingId'];
        } else if (requestLang == 'hr') {
            title = 'Oprosti! Nema vozača za vašu zakazanu vožnju!';
            message = 'Oprosti! Nema vozača za vašu zakazanu vožnju. Vaš rezervacijski ID #' + requestData['bookingId'];
        } else if (requestLang == 'ar') {
            title = 'آسف! لا يوجد سائقون متاحون لرحلتك المجدولة';
            message = 'آسف! لا يوجد سائقون متاحون لرحلتك المجدولة. معرف الحجز الخاص بك #' + requestData['bookingId'];
        }
    }

    if (type === 'scheduleCancelled') {
        if (requestLang == 'en') {
            title = 'Oops! Your scheduled ride has been cancelled!';
            message = `Oops! Your scheduled ride(#${requestData['bookingId']}) has been cancelled as you are in an active ride at the moment.`;
        } else if (requestLang == 'es') {
            title = '¡Ups! ¡Tu viaje programado ha sido cancelado!';
            message = `¡Ups! Tu viaje programado (#${requestData['bookingId']}) ha sido cancelado porque estás en un viaje activo en este momento.`;
        } else if (requestLang == 'fr') {
            title = 'Oops! Votre trajet programmé a été annulé!';
            message = `Oops! Votre course programmée (#${requestData['bookingId']}) a été annulée car vous êtes actuellement dans une course active.`;
        } else if (requestLang == 'ru') {
            title = 'Ой! Ваша запланированная поездка отменена!';
            message = `Ой! Ваша запланированная поездка (#${requestData['bookingId']}) была отменена, поскольку в данный момент вы находитесь в активной поездке.`;
        } else if (requestLang == 'ja') {
            title = 'おっと！予定の乗車はキャンセルされました！';
            message = `おっと！現在アクティブなライドを行っているため、スケジュールされたライド（＃${requestData['bookingId']}）はキャンセルされました。`;
        } else if (requestLang == 'id') {
            title = 'Ups! Perjalanan terjadwal Anda telah dibatalkan!';
            message = `Ups! Perjalanan terjadwal Anda (#${requestData['bookingId']}) telah dibatalkan karena Anda dalam perjalanan aktif saat ini.`;
        } else if (requestLang == 'hr') {
            title = 'Ups! Vaša zakazana vožnja je otkazana!';
            message = `Ups! Vaša zakazana vožnja (#${requestData['bookingId']}) otkazana je jer ste trenutno u aktivnoj vožnji.`;
        } else if (requestLang == 'ar') {
            title = 'وجه الفتاة! تم إلغاء رحلتك المجدولة!';
            message = `وجه الفتاة! تم إلغاء رحلتك المجدولة (${requestData['bookingId']}#) لأنك في رحلة نشطة في الوقت الحالي.`;
        }
    }

    if (type === 'missedTrip') {
        if (requestLang == 'en') {
            title = 'Oops! You have missed the trips!';
            message = 'Oops! You have missed ' + requestData['missedTrips'] + ' trip requests. Get back soon to get on the wheels!';
        } else if (requestLang == 'es') {
            title = '¡Uy! Te has perdido los viajes!';
            message = '¡Uy! Te has perdido ' + requestData['missedTrips'] + ' solicitudes de viaje. ¡Vuelve pronto para ponerte en marcha!';
        } else if (requestLang == 'fr') {
            title = 'Oups! Vous avez manqué les voyages!';
            message = 'Oups! Vous avez manqué ' + requestData['missedTrips'] + ' demandes de voyage. Revenez bientôt pour monter sur les roues!';
        } else if (requestLang == 'ru') {
            title = 'К сожалению! Вы пропустили поездки!';
            message = 'К сожалению! Вы пропустили ' + requestData['missedTrips'] + ' запросы на поездку. Возвращайся скорее, чтобы сесть на колеса!';
        } else if (requestLang == 'ja') {
            title = 'おっとっと！あなたは旅行を逃しました！';
            message = 'おっとっと！あなたが逃した ' + requestData['missedTrips'] + ' 旅行リクエスト。すぐに戻って車輪に乗ってください！';
        } else if (requestLang == 'id') {
            title = 'Ups! Anda telah melewatkan perjalanan!';
            message = 'Ups! Kamu telah melewatkan ' + requestData['missedTrips'] + ' permintaan perjalanan. Dapatkan segera kembali untuk mendapatkan di atas roda!';
        } else if (requestLang == 'hr') {
            title = 'Uh! Promašili ste putovanja!';
            message = 'Uh! Promašili ste ' + requestData['missedTrips'] + ' zahtjevi za putovanje. Vratite se uskoro da biste stali na kotače!';
        } else if (requestLang == 'ar') {
            title = 'وجه الفتاة! لقد فاتتك الرحلات!';
            message = 'وجه الفتاة! لقد فاتك' + requestData['missedTrips'] + ' طلبات الرحلة. نعود قريبا للحصول على عجلات!';
        }
    }

    if (type === 'cancelledByRider') {
        if (requestLang == 'en') {
            title = 'Oops! your rider has cancelled the trip!';
            message = "Unfortunately, your rider had to cancel the trip. Please wait, we'll get you moving shortly!";
        } else if (requestLang == 'es') {
            title = '¡Uy! ¡su jinete ha cancelado el viaje!';
            message = "Desafortunadamente, su jinete tuvo que cancelar el viaje. ¡Por favor espere, lo pondremos en movimiento en breve!";
        } else if (requestLang == 'fr') {
            title = 'Oups! votre cavalier a annulé le voyage!';
            message = "Desafortunadamente, su jinete tuvo que cancelar el viaje. ¡Por favor espere, lo pondremos en movimiento en breve!";
        } else if (requestLang == 'ru') {
            title = 'К сожалению! Ваш райдер отменил поездку!';
            message = "К сожалению, вашему гонщику пришлось отменить поездку. Пожалуйста, подождите, мы скоро переедем!";
        } else if (requestLang == 'ja') {
            title = 'おっとっと！ライダーが旅行をキャンセルしました！';
            message = "残念ながら、ライダーは旅行をキャンセルしなければなりませんでした。お待ちください、まもなく移動します！";
        } else if (requestLang == 'id') {
            title = 'Ups! pengendara Anda telah membatalkan perjalanan!';
            message = "Sayangnya, pengendara Anda harus membatalkan perjalanan. Harap tunggu, kami akan membuat Anda bergerak segera!";
        } else if (requestLang == 'hr') {
            title = 'Uh! vaš jahač otkazao putovanje!';
            message = "Nažalost, vaš jahač morao je otkazati putovanje. Molimo pričekajte, ubrzo ćemo vas premjestiti!";
        } else if (requestLang == 'ar') {
            title = 'وجه الفتاة! الراكب الخاص بك قد ألغى الرحلة!';
            message = "لسوء الحظ ، كان على الراكب الخاص بك إلغاء الرحلة. يُرجى الانتظار ، سنساعدك على الانتقال قريبًا";
        }
    }

    if (type === 'cancelledByDriver') {
        if (requestLang == 'en') {
            title = 'Oops! your driver has cancelled the trip!';
            message = "Unfortunately, Your driver had to cancel the trip. Please request a new ride and we'll get you moving shortly!";
        } else if (requestLang == 'es') {
            title = '¡Uy! su conductor ha cancelado el viaje!';
            message = "Desafortunadamente, su conductor tuvo que cancelar el viaje. ¡Solicite un nuevo viaje y lo pondremos en movimiento en breve!";
        } else if (requestLang == 'fr') {
            title = 'Oups! votre chauffeur a annulé le voyage!';
            message = "Malheureusement, votre chauffeur a dû annuler le voyage. Veuillez demander un nouveau trajet et nous vous ferons bouger sous peu!";
        } else if (requestLang == 'ru') {
            title = 'К сожалению! Ваш водитель отменил поездку!';
            message = "К сожалению, Вашему водителю пришлось отменить поездку. Пожалуйста, запросите новую поездку, и мы отправим вас в ближайшее время!";
        } else if (requestLang == 'ja') {
            title = 'おっとっと！運転手が旅行をキャンセルしました！';
            message = "残念ながら、運転手は旅行をキャンセルしなければなりませんでした。新しい乗車をリクエストしてください。すぐに移動できます。";
        } else if (requestLang == 'id') {
            title = 'Ups! pengemudi Anda telah membatalkan perjalanan!';
            message = "Sayangnya, pengemudi Anda harus membatalkan perjalanan. Silakan minta tumpangan baru dan kami akan segera membantu Anda bergerak!";
        } else if (requestLang == 'hr') {
            title = 'Uh! vaš vozač otkazao putovanje!';
            message = "Nažalost, vaš vozač morao je otkazati putovanje. Zahtijevajte novu vožnju i uskoro ćemo vas premjestiti!";
        } else if (requestLang == 'ar') {
            title = 'وجه الفتاة! لقد ألغى سائقك الرحلة!';
            message = "لسوء الحظ ، اضطر سائقك إلى إلغاء الرحلة. الرجاء طلب مشوار جديد وسنساعدك على التحرك قريبًا";
        }
    }

    if (type === 'paymentSuccess') {
        if (requestLang == 'en') {
            title = 'Yay! Your ride is completed!';
            if (requestData['paymentType'] === 1) {
                message = formatAmount(requestData['amount'], requestData['currency'], requestLang);
                message = message + ' is cash payable by the rider. Please get the total trip amount from the rider!!';
            } else {
                message = 'You will receive ' + formatAmount(requestData['driverTotalFare'], requestData['currency'], requestLang); 
                message = message + ' for your trip! We will payout the trip amount to your bank account shortly!';
            }
        } else if (requestLang == 'es') {
            title = '¡Hurra! ¡Tu paseo está completo!';
            if (requestData['paymentType'] === 1) {
                message = formatAmount(requestData['amount'], requestData['currency'], requestLang);
                message = message + ' es efectivo a cargo del jinete. ¡Obtenga el monto total del viaje del jinete!!';
            } else {
                message = 'Usted recibirá ' + formatAmount(requestData['driverTotalFare'], requestData['currency'], requestLang); 
                message = message + ' para tu viaje! ¡Pagaremos el monto del viaje a su cuenta bancaria en breve!';
            }
        } else if (requestLang == 'fr') {
            title = 'Yay! Votre balade est terminée!';
            if (requestData['paymentType'] === 1) {
                message = formatAmount(requestData['amount'], requestData['currency'], requestLang);
                message = message + ' est payable en espèces par le coureur. Veuillez obtenir le montant total du voyage du cavalier !!';
            } else {
                message = 'Vous allez recevoir ' + formatAmount(requestData['driverTotalFare'], requestData['currency'], requestLang); 
                message = message + ' pour votre voyage! Nous verserons le montant du voyage sur votre compte bancaire sous peu!';
            }
        } else if (requestLang == 'ru') {
            title = 'Ура! Ваша поездка завершена!';
            if (requestData['paymentType'] === 1) {
                message = formatAmount(requestData['amount'], requestData['currency'], requestLang);
                message = message + ' наличными оплачивает гонщик. Пожалуйста, получите общую сумму поездки от гонщика!!';
            } else {
                message = 'Ты получишь ' + formatAmount(requestData['driverTotalFare'], requestData['currency'], requestLang); 
                message = message + ' для вашей поездки! Мы скоро выплатим сумму на ваш банковский счет!';
            }
        } else if (requestLang == 'ja') {
            title = 'わーい！乗車が完了しました！';
            if (requestData['paymentType'] === 1) {
                message = formatAmount(requestData['amount'], requestData['currency'], requestLang);
                message = message + ' ライダーが支払う現金です。ライダーから合計旅行量を取得してください!!';
            } else {
                message = '受け取ります ' + formatAmount(requestData['driverTotalFare'], requestData['currency'], requestLang); 
                message = message + ' あなたの旅行に！旅行金額はすぐにあなたの銀行口座に支払われます！';
            }
        } else if (requestLang == 'id') {
            title = 'Yay! Perjalanan Anda selesai!';
            if (requestData['paymentType'] === 1) {
                message = formatAmount(requestData['amount'], requestData['currency'], requestLang);
                message = message + ' adalah uang tunai yang dibayarkan oleh pengendara. Silakan dapatkan jumlah total perjalanan dari pengendara!!';
            } else {
                message = 'Anda akan menerima ' + formatAmount(requestData['driverTotalFare'], requestData['currency'], requestLang); 
                message = message + ' untuk perjalanan Anda! Kami akan segera membayar jumlah perjalanan ke rekening bank Anda!';
            }
        } else if (requestLang == 'hr') {
            title = 'Yay! Vaša vožnja je završena!';
            if (requestData['paymentType'] === 1) {
                message = formatAmount(requestData['amount'], requestData['currency'], requestLang);
                message = message + ' je gotovina koju plaća vozač. Molimo uzmite ukupni iznos putovanja od vozača !!';
            } else {
                message = 'Dobit ćete ' + formatAmount(requestData['driverTotalFare'], requestData['currency'], requestLang); 
                message = message + ' za vaše putovanje! Iznos putovanja uskoro ćemo uplatiti na vaš bankovni račun!';
            }
        } if (requestLang == 'ar') {
            title = 'ياي! اكتملت رحلتك!';
            if (requestData['paymentType'] === 1) {
                message = formatAmount(requestData['amount'], requestData['currency'], requestLang);
                message = message + ' هو نقد يدفعه الراكب. الرجاء الحصول على المبلغ الإجمالي للرحلة من الراكب !!';
            } else {
                message = 'ستستلم ' + formatAmount(requestData['driverTotalFare'], requestData['currency'], requestLang); 
                message = message + 'لرحلتك! سنقوم بدفع مبلغ الرحلة إلى حسابك المصرفي قريبًا!';
            }
        }
    }

    if (type === 'tripAccept') {
        if (requestLang == 'en') {
            title = 'Yay! your booking request has been confirmed and the driver is on your way!';
            message = 'Hi ' + requestData['name'] + ', your booking request has been confirmed. Your booking ID #';
            message = message + requestData['bookingId'] + ', your vehicle number ' + requestData['vehicleNumber'] + '.';
            message = message  + ' and your vehicle model ' + requestData['vehicleModel'] + '.';
        } else if (requestLang == 'es') {
            title = '¡Hurra! su solicitud de reserva ha sido confirmada y el conductor está en camino!';
            message = 'Hola ' + requestData['name'] + ', su solicitud de reserva ha sido confirmada. Su identificación de reserva #';
            message = message + requestData['bookingId'] + ' y tu número de vehículo ' + requestData['vehicleNumber'] + '.';
        } else if (requestLang == 'fr') {
            title = 'Yay! votre demande de réservation a été confirmée et le chauffeur est en route!';
            message = 'Salut ' + requestData['name'] + ', votre demande de réservation a été confirmée. Votre identifiant de réservation #';
            message = message + requestData['bookingId'] + ' et votre numéro de véhicule ' + requestData['vehicleNumber'] + '.';
        } else if (requestLang == 'ru') {
            title = 'Ура! Ваш запрос на бронирование подтвержден, и водитель уже в пути!';
            message = 'Здравствуй ' + requestData['name'] + ', Ваш запрос на бронирование был подтвержден. Ваш номер бронирования #';
            message = message + requestData['bookingId'] + ' и номер вашего автомобиля ' + requestData['vehicleNumber'] + '.';
        } else if (requestLang == 'ja') {
            title = 'わーい！予約リクエストが確認され、運転手があなたを待っています！';
            message = 'こんにちは ' + requestData['name'] + ', 予約リクエストが確認されました。予約ID #';
            message = message + requestData['bookingId'] + ' そしてあなたの車両番号 ' + requestData['vehicleNumber'] + '.';
        } else if (requestLang == 'id') {
            title = 'Yay! permintaan pemesanan Anda telah dikonfirmasi dan pengemudi sedang dalam perjalanan!';
            message = 'Hai ' + requestData['name'] + ', permintaan pemesanan Anda telah dikonfirmasi. ID pemesanan Anda #';
            message = message + requestData['bookingId'] + ' dan nomor kendaraan Anda ' + requestData['vehicleNumber'] + '.';
        } else if (requestLang == 'hr') {
            title = 'Yay! vaš zahtjev za rezervacijom je potvrđen i vozač je na putu!';
            message = 'Bok ' + requestData['name'] + ', vaš zahtjev za rezervacijom je potvrđen. Vaš rezervacijski ID #';
            message = message + requestData['bookingId'] + ' i vaš broj vozila ' + requestData['vehicleNumber'] + '.';
        } else if (requestLang == 'ar') {
            title = 'ياي! تم تأكيد طلب الحجز الخاص بك والسائق في طريقك!';
            message = 'هاي ' + requestData['name'] + ', تم تأكيد طلب الحجز الخاص بك. معرف الحجز الخاص بك # ';
            message = message + requestData['bookingId'] + ' ورقم سيارت' + requestData['vehicleNumber'] + '.';
        }
    }

    if (type === 'tripStart') {
        if (requestLang == 'en') {
            title = 'Yay! your trip is started!';
            message = 'May your journey be free from stress and bring you home safely. Safe Travels!';
        } else if (requestLang == 'es') {
            title = '¡Hurra! tu viaje ha comenzado!';
            message = 'Que su viaje esté libre de estrés y lo lleve a casa de manera segura. ¡Viajes seguros!';
        } else if (requestLang == 'fr') {
            title = 'Yay! votre voyage est commencé!';
            message = 'Que votre voyage soit sans stress et vous ramène chez vous en toute sécurité. Bon voyage!';
        } else if (requestLang == 'ru') {
            title = 'Ура! Ваша поездка началась!';
            message = 'Пусть ваше путешествие будет свободным от стресса и безопасно доставит вас домой. Безопасные путешествия!';
        } else if (requestLang == 'ja') {
            title = 'わーい！旅行が始まりました！';
            message = 'あなたの旅がストレスから解放され、安全に家に帰ることができますように。安全な旅行！';
        } else if (requestLang == 'id') {
            title = 'Yay! perjalanan Anda dimulai!';
            message = 'Semoga perjalanan Anda bebas dari stres dan membawa Anda pulang dengan selamat. Perjalanan aman!';
        } else if (requestLang == 'hr') {
            title = 'Yay! vaše putovanje je započelo!';
            message = 'Neka se vaše putovanje oslobodi stresa i sigurno vas odvede kući. Sigurna putovanja!';
        } else if (requestLang == 'ar') {
            title = ' ياي! بدأت رحلتك!';
            message = ' قد تكون رحلتك خالية من التوتر وتعود بك إلى المنزل بأمان. رحلات آمنة!';
        }
    }

    if (type === 'tripComplete') {
        if (requestLang == 'en') {
            title = 'Ta Da! you are at your destination!';
            message = formatAmount(requestData['amount'], requestData['currency'], requestLang);

            if (requestData['paymentType'] === 1) {
                message = message + ' is cash payable for your ride!'; 
            } else if (requestData['paymentType'] === 3) {
                    message = message + ' is deducted from your wallet balance for your ride!'; 
                
            } else {
                message = message + ' is card payable for your ride!';
            }

            message = message + ' Hope you had a great journey!!';
        } else if (requestLang == 'es') {
            title = 'Ta Da! estás en tu destino!';
            message = formatAmount(requestData['amount'], requestData['currency'], requestLang);

            if (requestData['paymentType'] === 1) {
                message = message + ' es efectivo a pagar por su viaje!'; 
            } else if (requestData['paymentType'] === 3) {
                    message = message + ' se deduce del saldo de su billetera para su viaje!'; 
                
            } else {
                message = message + ' es la tarjeta pagadera por su viaje!';
            }

            message = message + ' Espero que hayas tenido un gran viaje !!';
        } else if (requestLang == 'fr') {
            title = 'Ta Da! vous êtes à destination!';
            message = formatAmount(requestData['amount'], requestData['currency'], requestLang);

            if (requestData['paymentType'] === 1) {
                message = message + ' est payable en espèces pour votre trajet!'; 
            } else if (requestData['paymentType'] === 3) {
                message = message + ' est déduit de votre solde de portefeuille pour votre trajet!';
            } else {
                message = message + ' est la carte à payer pour votre trajet!';
            }

            message = message + " J'espère que vous avez fait un excellent voyage !!";
        } else if (requestLang == 'ru') {
            title = 'Та Да! Вы находитесь в пункте назначения!';
            message = formatAmount(requestData['amount'], requestData['currency'], requestLang);

            if (requestData['paymentType'] === 1) {
                message = message + ' наличными за вашу поездку!'; 
            } else if (requestData['paymentType'] === 3) {
                    message = message + ' вычитается из баланса вашего кошелька за поездку!'; 
                
            } else {
                message = message + ' карта оплачивается за поездку!';
            }

            message = message + ' Надеюсь, у вас было отличное путешествие!';
        } else if (requestLang == 'ja') {
            title = 'タダ！あなたは目的地にいます！';
            message = formatAmount(requestData['amount'], requestData['currency'], requestLang);

            if (requestData['paymentType'] === 1) {
                message = message + ' 乗車時に現金で支払う必要があります！'; 
            } else if (requestData['paymentType'] === 3) {
                message = message + ' 乗車時にウォレットの残高から差し引かれます！';
            } else {
                message = message + ' 乗車時に支払われるカードです！';
            }

            message = message + ' あなたが素晴らしい旅をしたことを願っています!!';
        } else if (requestLang == 'id') {
            title = 'Ta Da! Anda berada di tempat tujuan!';
            message = formatAmount(requestData['amount'], requestData['currency'], requestLang);

            if (requestData['paymentType'] === 1) {
                message = message + ' dibayar tunai untuk perjalanan Anda!'; 
            } else if (requestData['paymentType'] === 3) {
                    message = message + ' dikurangkan dari saldo dompet Anda untuk perjalanan Anda!';
            } else {
                message = message + ' dibayar kartu untuk perjalanan Anda!';
            }

            message = message + ' Semoga Anda memiliki perjalanan yang luar biasa !!';
        } else if (requestLang == 'hr') {
            title = 'Ta Da! na odredištu ste!';
            message = formatAmount(requestData['amount'], requestData['currency'], requestLang);

            if (requestData['paymentType'] === 1) {
                message = message + ' plaća se gotovina za vašu vožnju!'; 
            } else if (requestData['paymentType'] === 3) {
                    message = message + ' oduzima se od vašeg novčanika za vašu vožnju!'; 
                
            } else {
                message = message + ' plaća se kartica za vašu vožnju!';
            }

            message = message + ' Nadam se da ste imali veliko putovanje !!';
        } else if (requestLang == 'ar') {
            title = 'تا دا! انت في وجهتك!';
            message = formatAmount(requestData['amount'], requestData['currency'], requestLang);

            if (requestData['paymentType'] === 1) {
                message = message + ' هو الدفع النقدي لركوبك!'; 
            } else if (requestData['paymentType'] === 3) {
                    message = message + ' يتم خصمه من رصيد محفظتك لرحلتك! '; 
                
            } else {
                message = message + ' هي بطاقة مدفوعة لرحلتك!';
            }

            message = message + ' أتمنى أن تكون قد حظيت برحلة رائعة !!';
        }
    }

    if (type === 'tipsReceived') {
        if (requestLang == 'en') {
            title = 'Hurray! You got a tip!';
            message = 'Hurray! You got a tip.';
        } else if (requestLang == 'es') {
            title = '¡Viva! ¡Tienes un consejo!';
            message = '¡Viva! ¡Tienes un consejo.';
        } else if (requestLang == 'fr') {
            title = 'Hourra! Vous avez un pourboire!';
            message = 'Hourra! Vous avez un pourboire.';
        } else if (requestLang == 'ru') {
            title = 'Ура! У тебя есть подсказка!';
            message = 'Ура! У тебя есть подсказка.';
        } else if (requestLang == 'ja') {
            title = 'ばんざーい！ヒントが出ました！';
            message = 'ばんざーい！ヒントが出ました.';
        } else if (requestLang == 'id') {
            title = 'Hore! Anda mendapat tip!';
            message = 'Hore! Anda mendapat tip.';
        } else if (requestLang == 'hr') {
            title = 'Ura! Dobili ste savjet!';
            message = 'Ura! Dobili ste savjet.';
        } else if (requestLang == 'ar') {
            title = 'يا هلا! لقد تلقيت نصيحة!';
            message = 'يا هلا! لقد حصلت على معلومات سرية.';
        }
    }

    if (type === 'forceUpdate') { // App FORCE UPDATE
        if (requestLang == 'en') {
            message = 'The using application version is no longer supported. Please upgrade to a newer version.';
        } else if (requestLang == 'es') {
            message = 'La versión de la aplicación que usa ya no es compatible. Actualice a una versión más reciente.';
        } else if (requestLang == 'fr') {
            message = "La version de l'application en cours d'utilisation n'est plus prise en charge. Veuillez passer à une version plus récente.";
        } else if (requestLang == 'ru') {
            message = 'Используемая версия приложения больше не поддерживается. Пожалуйста, обновитесь до более новой версии.';
        } else if (requestLang == 'ja') {
            message = '使用しているアプリケーションのバージョンはサポートされなくなりました。新しいバージョンにアップグレードしてください。';
        } else if (requestLang == 'id') {
            message = 'Versi aplikasi yang menggunakan tidak lagi didukung. Harap tingkatkan ke versi yang lebih baru.';
        } else if (requestLang == 'hr') {
            message = 'Verzija aplikacije koja se koristi više nije podržana. Molimo nadogradite na noviju verziju.';
        } else if (requestLang == 'ar') {
            message = 'لم يعد إصدار التطبيق المستخدم مدعومًا. الرجاء الترقية إلى إصدار أحدث.';
        }
    }


    return {
        title,
        message
    };
}

export function formatAmount(amount, currency, locale) {
    let convertCurrency = 'USD';
    if (amount) {
        convertCurrency = currency ? currency : convertCurrency;
        return amount.toLocaleString(locale, { style: 'currency', currency: convertCurrency });
    } else {
        return null;
    }
}