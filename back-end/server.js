import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import admin from 'firebase-admin'
import { getMessaging } from "firebase-admin/messaging";

import dbConnect from './config/database.js'
import { 
  announcementRoutes,
  guestRoutes, 
  profileRoutes, 
  userRoutes, securityRoutes
} from './routes/index.js'

// const firebaseAdminCred = {
//   "type": "service_account",
//   "project_id": "sr-notifications",
//   "private_key_id": "22d170a5681b1aaac3d7cf8b3949ee237b3f61a4",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCnZELuTtnQrvlZ\nJP5YMYN6M8DXR3rRJmpkkXCAtJH19nQZ8tnbp06tH7HX3FMPNa56qrTFHnDKZTDD\nk9VM0ukskksxLlyTH96XhC33I4lBoINCoBBijUoWr5C2gIiILmKdZFF51EgKVAqV\nhE2+tYDfZud8CA1Gk+T27omCB1quixcrjXpNMNZkKrJnxfSjZAKdG3yBO2QoxeKj\nf5TDx3CJk3c4lZFig01b1Q2gkUIlkQVQNO2eiPc0yxd0Br8H+4XgbBCGuGAgtbjG\noZJA1R0TMDw4W40Cnok5MTy8qrbCZ8R/GxGeq8skMVVbkWjbULFjL8B+P5vARupT\nWO2uA0uPAgMBAAECggEABJoLWP/OmcplonS+OpsfMS8rtaoKZKY4teEQWwlxGyDr\nr4GZ9Ew/gR+Q77fn31ArfBsl8xFTf8zpBUdoIr+IQihswW0JMHuSI/ox7/cIdpxn\nX1/ac3XM5p4W+AgajhvbAYFY2A+Pl3EYsA7ouuhvIt/HrK+P+zO6T1Y0GOCuNoQi\n/BeHk6wRgUxouh55vcDStOajf0pZXdnmevORVcKBgWyR6zmTl+eiuG6OqRWspKuo\njYl7/tcwQRAM2OnVEkkIgqqr7UNAus4c6CMz4Ic+YmV5uRZLn9Uj2nn6wy+tjlNC\njqBpdabFzuByTNRCEQTXZEZnRw2yL50KFavgc2gz2QKBgQDTyngT6LccgXmWnBSU\nLh53I0PGdCCyFEG4nKHi75D8ahLgoGlu28PzvP5MEiznmnc+XUxty481BC20obRc\nFzNtLCU1/m+yf02pWShTQd1W24oV6wHLtgn+LhrcUI8Q0S0QnIWKADopU19HZw8N\nCEsUYj3yl0wpoKMPHI4v/JiXtQKBgQDKVTeMfdFrEVtsnhmw8ZFzXBi7adEL8p0H\nwbVY+ctr8GmFVfuEsKG01UR7+5CVIWPGTiwnTYa/E1kl3q6O4JGD7jlRbJkaRjTm\ntO3+wwkrS4Om6LNQLUJRODOExiGCtA/O2d+kN63ob+0Gz7kgM5v7Sblc+Eouigiw\nV//Rc19YswKBgDIKq/agTOvKV+1TMbWVdBNYXMI+XB9Xk/PH5qRVUJ+jfJRgsqjD\n+nfT1w4oWT3cDILKzq0+pLa1JwuADbqYrMkF3kD0vnWhiLsT2uhZLrBALU9ieMkm\nWRQa1rPpwPQLSKedJBxoU1XCYkffvPmqVPsa/2Ibh55qWzzN1XbXK0LlAoGAfRak\nKgpbHyty7zrrPTaLqttEOxGXeSB8LqB2glSki83tHs7imc0tnAPBvDjx0RD8g0wv\nBflrFdRbaAs8tf5mWD8+VnWiTdkbuYogHUHs+EROVzFEMoxYlKf/SdXIP+scXtDZ\n78ewj6Qq0Ow5Uow1oeyZWb3y9sTFzGgLMy11w/sCgYAbcTuDJcLvR8uB1SLff1mP\nTeApAyTI+x37jrbXKRwzMLDtYc2f6XD1rmof5iduIQx1t17CQ5TuBjsgObdcIJPP\nRRZWmlTickPwbiMkiEVgPRks6CwUtRz8S7+VNKevrMnb1aubpeUJDlTSOxkmns/1\n6/nlLhtMby7kGJqXwvTlCA==\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk-6ur7d@sr-notifications.iam.gserviceaccount.com",
//   "client_id": "102682704007318658024",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6ur7d%40sr-notifications.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }
// admin.initializeApp({
//   // credential: applicationDefault(),
//   credential: admin.credential.cert(firebaseAdminCred),
//   //projectId: 'sr-notifications',
// });


dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'https://srgatepass-43131.web.app', // Replace with your client's origin
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
})

// Middlewares
app.use(cors({ 
  origin: true, 
  credentials: true 
})) // Allow CORS for all routes
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

// Profile Routes
app.use('/api/profile', profileRoutes)

// Guest Routes
app.use('/api/guest', guestRoutes)

// Announcement Routes
app.use('/api/announcement', announcementRoutes)

// Security Routes
app.use('/api/security', securityRoutes)

app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello World' })
  
})

// app.get("/notify", function (req, res) {
//   const receivedToken = req.body.fcmToken;
//   console.log("receive token ", receivedToken);
//   const message = {
//     notification: {
//       title: "SR Gate Pass",
//       body: 'Welcome to Sr Gate Pass',
//       image: "logo192.png"
//     },
//     webpush: {
//       fcmOptions: {
//         link: 'http://localhost:3000',
//       },
//       // headers: {
//       //   image: 'http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png'
//       // },
//       notification: {
//         icon:"favicon.ico",
//         default_sound:true
//         }
//     },  
//     // android: {
//     //   notification: {
//     //   imageUrl:"http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png",
//     //   default_sound:true,
//     //   icon:"http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png",
//     //   color:'#7e55c3'
//     //   }
//     // },
//     token: " d_qa0-Hp6_0KelIAhrAIu6:APA91bHjlib6Xb_0DFcRi7lVGG9b1zvgN9g20hGNlcf0R9vcPdSMRSmSXP2bZNveVXShMX6zsXwjlOmA-uLLucXSdDsYYQs9GFnuTbPZpV_O6leoVwugVNNTp90I3HCwpR3hDxEe2X2Y",
//   };
  
//   getMessaging()
//     .send(message)
//     .then((response) => {
//       res.status(200).json({
//         message: "Successfully sent message",message,
//         token: receivedToken,
//       });
//       console.log("Successfully sent message:", response);
//     })
//     .catch((error) => {
//       res.status(400);
//       res.send(error);
//       console.log("Error sending message:", error);
//     });
  
  
// });

// Start the server
server.listen(port, () => console.log(`Server started on port ${port}`))
