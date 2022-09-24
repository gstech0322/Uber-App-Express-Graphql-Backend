const socketNotificationRoutes = (app, io) => {
    io.on('connection', async function(socket) {
        console.log('Notification Socket Connected')
    })

    app.post('/socketNotification', async function(req, res) {
        let endpoint = req.body && req.body.endPoint;
        let data = req.body && req.body.content;
        let errorMessage = req.body && req.body.failedMessage || null;
        let socketResponse = {
            data: {
                status: (errorMessage && errorMessage.toString().trim() !== '') ? 400 : 200,
                errorMessage,
                data
            }
        };

        io.emit(endpoint, socketResponse);

        res.send({
            status: 200,
            errorMessage: null
        })
    })
}
export default socketNotificationRoutes