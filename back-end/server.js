import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import path from 'path'

import dbConnect from './config/database.js'
import { 
  announcementRoutes,
  guestRoutes, 
  userRoutes 
} from './routes/index.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your client's origin
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
})



const _dirname = path.dirname("")
const buildPath = path.join(_dirname , "../front-end/build");


// Middlewares
app.use(cors({ 
  origin: '*', 
  credentials: true 
})) // Allow CORS for all routes

app.use(express.static(buildPath))

app.get("/*", function(req, res){

    res.sendFile(
        path.join(__dirname, "../front-end/build/index.html"),
        function (err) {
          if (err) {
            res.status(500).send(err);
          }
        }
      );

})



app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.locals.io = io

// Database Connection
dbConnect()

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('A client connected.')

  // Join a room based on the user ID
  socket.on('join', (userId) => {
    socket.join(userId)
  })

  // Handle 'guest' event
  socket.on('guest', (data) => {
    const { guest } = data
    socket.broadcast.emit('guest', guest)
  })

  // Handle 'announcement' event
  socket.on('announcement', (announcement) => {
    // Broadcast the announcement to all connected clients
    socket.broadcast.emit('announcement', announcement)
  })

  // Handle 'notification' event
  socket.on('notification', (notification) => {
    // Broadcast the notification to all connected clients
    socket.broadcast.emit('notification', notification)
  })

  // Handle disconnection event
  socket.on('disconnect', () => {
    console.log('A client disconnected.')
  })
})

// User Routes
app.use('/api/user', userRoutes)

// Guest Routes
app.use('/api/guest', guestRoutes)

// Announcement Routes
app.use('/api/announcement', announcementRoutes)

app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello World' })
})

// Start the server
server.listen(port, () => console.log(`Server started on port ${port}`))
