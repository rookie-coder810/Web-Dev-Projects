const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const compression = require('compression')
const PORT = process.env.PORT || 3000
let data = [[], []]

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(compression({
    level: 6,
    threshold: 0,
}))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomID, userID) => {
        socket.join(roomID)

        data[0].push(socket.id)
        data[1].push(roomID)

        let userData = socket.id + " " + roomID
        io.to(socket.id).emit('name room', userData)
        socket.on('send object', function (objectJSON) {
            socket.to(roomID).emit('get object', objectJSON)
        })
        socket.on('send command', function (command) {
            socket.to(roomID).emit('get command', command)
        })
        socket.on('disconnect', () => {
            socket.to(roomID).emit('user-disconnected', userID)
            let user = data[0].indexOf(socket.id)
            let room = data[1].indexOf(roomID)
            data[0].splice(user, 1)
            data[1].splice(room, 1)
        })
    })
})

server.listen(PORT, () => {
    console.log('Running on port ' + PORT)
});