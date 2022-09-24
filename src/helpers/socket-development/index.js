$(function () {
    var socket = io();

    // http://localhost:4001/?id=1234&type=1

    const riderSockets = ['test', 'tripRequest', 'riderCancel', 'autoCancel', 'cancelTripRequest', 'loginCheck', 'rider'];
    const driverSockets = ['test', 'tripDecline', 'tripAccept', 'driverLocation', 'tripStart', 'driverCancel', 'tripComplete', 'loginCheck', 'driver'];
    let userId, userType;
    let queries = {};

    if (document && document.location && document.location.search && document.location.search.length > 0) {
        $.each(document.location.search.substr(1).split('&'),function(c,q){
            var i = q.split('=');
            queries[i[0].toString()] = i[1].toString();
        });
    }

    userId = queries && queries.id;
    userType = queries && queries.type;

    if (userId) { $('#userId').val(userId); }
    if (userType) { $('#userType').val(userType); }

    $('form').submit(function (e) {
        e.preventDefault();
        let eventName = $('#eventName').val() || null;
        let data = $('#data').val() || null;

        let html = '<b>' + eventName + ': </b>';
        html = html + '<span>' + JSON.stringify(data) + '</span>';

        if (userType == '1' && riderSockets.indexOf(eventName) >= 0) { // Rider Client 
            
            socket.emit(eventName, data);
            $('#responseData').append($('<li class="request">').html(html));

        } else if (userType == '2' && driverSockets.indexOf(eventName) >= 0) { // Driver Client

            socket.emit(eventName, data);
            $('#responseData').append($('<li class="request">').html(html));

        } else {
            alert("Hey buddy! you are trying an invalid request!!!");
        }

        clearFields(); // Clear the form fields
        return false;
    });

    $('#clear').click(function () { // Clear the logs
        $('#responseData').empty();
        window.scrollTo(0, 0);
    });

    function clearFields() { // Clear the fields
        // $('#eventName').val('');
        $('#data').val('');
    }

    socket.on('connect', function () {
        $('#responseData').append($('<li class="response">').text('connected with socket: ' + socket.id));
    });
    
    if (userId) {
        if (userType == '1') { // Rider events

            // Receive - Error/Trip-Decline/Driver-Location(Trip)
            socket.on('tripRequest-' + userId, async function (responseData) {
                let html = '<b>tripRequest-' + userId + ': </b>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';

                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Trip-Accept
            socket.on('tripAccept-' + userId, async function (responseData) {
                let html = '<span class="eventName">tripAccept-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Trip-Start
            socket.on('tripStart-' + userId, async function (responseData) {
                let html = '<span class="eventName">tripStart-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Error
            socket.on('riderCancel-' + userId, async function (responseData) {
                let html = '<span class="eventName">riderCancel-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Trip-Driver-Cancel
            socket.on('driverCancel-' + userId, async function (responseData) {
                let html = '<span class="eventName">driverCancel-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Trip-Complete
            socket.on('tripComplete-' + userId, async function (responseData) {
                let html = '<span class="eventName">tripComplete-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Error/Auto-Cancel
            socket.on('autoCancel-' + userId, async function (responseData) {
                let html = '<span class="eventName">autoCancel-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            socket.on('rider-' + userId, async function (responseData) {
                let html = '<span class="eventName">rider-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

        } else { // Driver events

            // Receive - New-trip/
            socket.on('tripRequest-' + userId, async function (responseData) {
                let html = '<span class="eventName">tripRequest-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Error
            socket.on('tripDecline-' + userId, async function (responseData) {
                let html = '<span class="eventName">tripDecline-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Error
            socket.on('tripAccept-' + userId, async function (responseData) {
                let html = '<span class="eventName">tripAccept-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Error
            socket.on('tripStart-' + userId, async function (responseData) {
                let html = '<span class="eventName">tripStart-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Rider-Trip-Cancel
            socket.on('riderCancel-' + userId, async function (responseData) {
                let html = '<span class="eventName">riderCancel-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Error
            socket.on('driverCancel-' + userId, async function (responseData) {
                let html = '<span class="eventName">driverCancel-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Error/Trip-Complete
            socket.on('tripComplete-' + userId, async function (responseData) {
                let html = '<span class="eventName">tripComplete-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });

            // Receive - Driver-Location-Error
            socket.on(userId, async function (responseData) {
                let html = '<span class="eventName">' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
    
                $('#responseData').append($('<li class="response">').html(html));
            });

            socket.on('driver-' + userId, async function (responseData) {
                let html = '<span class="eventName">driver-' + userId + ': </span>';
                html = html + '<span>' + JSON.stringify(responseData) + '</span>';
        
                $('#responseData').append($('<li class="response">').html(html));
            });
            
        }

        // Receive - Error/Success
        socket.on('loginCheck-' + userId, async function (responseData) {
            let html = '<span class="eventName">loginCheck-' + userId + ': </span>';
            html = html + '<span>' + JSON.stringify(responseData) + '</span>';
    
            $('#responseData').append($('<li class="response">').html(html));
        });

        // Receive - Error/Success
        socket.on('cancelTripRequest-' + userId, async function (responseData) {
            let html = '<span class="eventName">cancelTripRequest-' + userId + ': </span>';
            html = html + '<span>' + JSON.stringify(responseData) + '</span>';
    
            $('#responseData').append($('<li class="response">').html(html));
        });

        socket.on('testRequest-' + userId, async function (responseData) {
            let html = '<span class="eventName">testRequest-' + userId + ': </span>';
            html = html + '<span>' + JSON.stringify(responseData) + '</span>';
    
            $('#responseData').append($('<li class="response">').html(html));
        });
    }
});