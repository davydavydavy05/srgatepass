import { Resident,Guest,Notification,User,Worker } from '../models/index.js';
import { 
  emailTemplate, 
  mailer 
} from '../utils/index.js'
import mongoose from 'mongoose';



import admin from 'firebase-admin'
import { getMessaging } from "firebase-admin/messaging";

//baasta
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import http from 'http';

const firebaseAdminCred = {
  "type": "service_account",
  "project_id": "sr-notifications",
  "private_key_id": "22d170a5681b1aaac3d7cf8b3949ee237b3f61a4",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCnZELuTtnQrvlZ\nJP5YMYN6M8DXR3rRJmpkkXCAtJH19nQZ8tnbp06tH7HX3FMPNa56qrTFHnDKZTDD\nk9VM0ukskksxLlyTH96XhC33I4lBoINCoBBijUoWr5C2gIiILmKdZFF51EgKVAqV\nhE2+tYDfZud8CA1Gk+T27omCB1quixcrjXpNMNZkKrJnxfSjZAKdG3yBO2QoxeKj\nf5TDx3CJk3c4lZFig01b1Q2gkUIlkQVQNO2eiPc0yxd0Br8H+4XgbBCGuGAgtbjG\noZJA1R0TMDw4W40Cnok5MTy8qrbCZ8R/GxGeq8skMVVbkWjbULFjL8B+P5vARupT\nWO2uA0uPAgMBAAECggEABJoLWP/OmcplonS+OpsfMS8rtaoKZKY4teEQWwlxGyDr\nr4GZ9Ew/gR+Q77fn31ArfBsl8xFTf8zpBUdoIr+IQihswW0JMHuSI/ox7/cIdpxn\nX1/ac3XM5p4W+AgajhvbAYFY2A+Pl3EYsA7ouuhvIt/HrK+P+zO6T1Y0GOCuNoQi\n/BeHk6wRgUxouh55vcDStOajf0pZXdnmevORVcKBgWyR6zmTl+eiuG6OqRWspKuo\njYl7/tcwQRAM2OnVEkkIgqqr7UNAus4c6CMz4Ic+YmV5uRZLn9Uj2nn6wy+tjlNC\njqBpdabFzuByTNRCEQTXZEZnRw2yL50KFavgc2gz2QKBgQDTyngT6LccgXmWnBSU\nLh53I0PGdCCyFEG4nKHi75D8ahLgoGlu28PzvP5MEiznmnc+XUxty481BC20obRc\nFzNtLCU1/m+yf02pWShTQd1W24oV6wHLtgn+LhrcUI8Q0S0QnIWKADopU19HZw8N\nCEsUYj3yl0wpoKMPHI4v/JiXtQKBgQDKVTeMfdFrEVtsnhmw8ZFzXBi7adEL8p0H\nwbVY+ctr8GmFVfuEsKG01UR7+5CVIWPGTiwnTYa/E1kl3q6O4JGD7jlRbJkaRjTm\ntO3+wwkrS4Om6LNQLUJRODOExiGCtA/O2d+kN63ob+0Gz7kgM5v7Sblc+Eouigiw\nV//Rc19YswKBgDIKq/agTOvKV+1TMbWVdBNYXMI+XB9Xk/PH5qRVUJ+jfJRgsqjD\n+nfT1w4oWT3cDILKzq0+pLa1JwuADbqYrMkF3kD0vnWhiLsT2uhZLrBALU9ieMkm\nWRQa1rPpwPQLSKedJBxoU1XCYkffvPmqVPsa/2Ibh55qWzzN1XbXK0LlAoGAfRak\nKgpbHyty7zrrPTaLqttEOxGXeSB8LqB2glSki83tHs7imc0tnAPBvDjx0RD8g0wv\nBflrFdRbaAs8tf5mWD8+VnWiTdkbuYogHUHs+EROVzFEMoxYlKf/SdXIP+scXtDZ\n78ewj6Qq0Ow5Uow1oeyZWb3y9sTFzGgLMy11w/sCgYAbcTuDJcLvR8uB1SLff1mP\nTeApAyTI+x37jrbXKRwzMLDtYc2f6XD1rmof5iduIQx1t17CQ5TuBjsgObdcIJPP\nRRZWmlTickPwbiMkiEVgPRks6CwUtRz8S7+VNKevrMnb1aubpeUJDlTSOxkmns/1\n6/nlLhtMby7kGJqXwvTlCA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-6ur7d@sr-notifications.iam.gserviceaccount.com",
  "client_id": "102682704007318658024",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6ur7d%40sr-notifications.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
admin.initializeApp({
  // credential: applicationDefault(),
  credential: admin.credential.cert(firebaseAdminCred),
  //projectId: 'sr-notifications',
});


import {Vonage} from '@vonage/server-sdk'

const vonage = new Vonage({
  apiKey: "3b512d6d",
  apiSecret: "P9NIWAIw3F0puho2"
})



const writeFileAsync = fs.promises.writeFile;
const { ObjectId } = mongoose.Types;
const isInternetConnected = async () => {
  return new Promise((resolve) => {
    http
      .get('http://www.google.com', (res) => {
        resolve(res.statusCode === 200);
      })
      .on('error', () => {
        resolve(false);
      });
  });
};

const writeUserIdToFile = async (userId) => {
  const folderPath = path.join(process.cwd(), 'user_ids');
  const filePath = path.join(folderPath, 'offline_scans.txt');

  try {
    // Check for internet connection
    const internetConnected = await isInternetConnected();

    // Get the current date and time
    const currentDate = new Date();
    const dateTimeString = currentDate.toISOString();

    // Store the user ID and timestamp offline if there's no internet connection
    if (!internetConnected) {
      // Create the 'user_ids' folder if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Create the entry with userId and timestamp
      const entry = `${userId},${dateTimeString}\n`;

      // Append the entry to the file
      await writeFileAsync(filePath, entry, { flag: 'a' });

      console.log('User ID and timestamp stored offline successfully.');
    }
  } catch (error) {
    console.log('Error storing user ID and timestamp offline:', error);
  }
};

const getResidentProfileQr = async (req, res) => {
  try {
    const { userId } = req.body;
    const io = req.app.locals.io
    console.log('Received userId:', userId);

    let residentProfile;

    if (ObjectId.isValid(userId)) {
      // If the userId is a valid ObjectId, search for Resident
      residentProfile = await Resident.findOne({ userId: userId });
  
    } 
    else {
      // If it's a string, search for Guest
      residentProfile = await Worker.findOne({ username: userId });
     
 
      if(!residentProfile)
      {
        residentProfile = await Guest.findOne({ bookingNumber: userId });

        const hostId = residentProfile.host; // Assuming there is a field called "hostId" in the Guest model
        const host = await Resident.findOne({ _id: hostId });

        const ResidentUserId = host.userId
        const hostUserId = await User.findOne({ _id: ResidentUserId });
        const userResidentId = hostUserId._id
        const userResidentToken = hostUserId.fmcToken
        console.log("userId",userResidentId )
        console.log("userToken",userResidentToken )

        if (host) {

          
       
          const from = "Vonage APIs"
          const to = "639081772497"
          const text = 'A text message sent using the Vonage SMS API'
          
          async function sendSMS() {
              await vonage.sms.send({to, from, text})
                  .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                  .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
          }
          
          //sendSMS();



          const hostEmail = host.emailAddress; // Assuming there is a field called "email" in the Resident model
          console.log(hostEmail);
          console.log(hostId);
          console.log(residentProfile._id);
          const emailSubject = 'Guest Profile Search Notification';
          const emailBody = `A guest profile with booking number ${residentProfile.bookingNumber} has been successfully searched.`;
  
          // Use the mailer function to send the email
          await mailer({
            receiver: hostEmail,
            subject: emailSubject,
            body: emailBody
          });
  
          const notification = await Notification.create({
            type: 'guest',
            heading: 'Guest Arrived!',
            body: 'New Guest Arrived!',
            dateCreated: Date.now(),
            otherDetails: {
              guestId: residentProfile._id,
            }
          })
    
          await User.updateOne(
            { _id: userResidentId },
            { $push: { notifications: {
              notificationId: notification._id,
              type: 'guest',
              heading: 'Guest Arrived!',
              body: 'Guest Arrived!',
              dateCreated: Date.now(),
              isRead: false,
              otherDetails: {
                guestId: residentProfile._id,
              }
            }}}
          )
          io.emit('notification', notification)

          if(notification){
            const message = {
              notification: {
                title: "Guest Arrived!",
                body: 'Guest Arrived!',
                image: "logo192.png"
              },
              webpush: {
                fcmOptions: {
                  link: 'https://srgatepass-43131.web.app',
                },
                // headers: {
                //   image: 'http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png'
                // },
                notification: {
                  icon:"favicon.ico",
                  default_sound:true
                  }
              },  
              // android: {
              //   notification: {
              //   imageUrl:"http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png",
              //   default_sound:true,
              //   icon:"http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png",
              //   color:'#7e55c3'
              //   }
              // },
              token: userResidentToken,
            };
            
            getMessaging()
              .send(message)
              .then((response) => {
                // res.status(200).json({
                //   message: "Successfully sent message",message,
                //   token: receivedToken,
                // });
                console.log("Successfully sent message:", response);
              })
              .catch((error) => {
                // res.status(400);
                // res.send(error);
                console.log("Error sending message:", error);
              });
          }
        }
      }
      
    }

    console.log('Resident profile:', residentProfile);

    if (residentProfile) {
        // Update the timeArrived for the Guest or Resident if found
        if (residentProfile instanceof Guest || residentProfile instanceof Resident || residentProfile instanceof Worker) {
          residentProfile.timeArrived = new Date(); // Assuming timestamp is in a valid date format
          await residentProfile.save();
        }
        res.status(200).json(residentProfile);
        console.log('Resident profile:', residentProfile);
    } else {
      res.status(404).json({ errorMessage: 'Profile not found.' });
      // Store the user ID offline
      await writeUserIdToFile(userId);
    }
  } catch (error) {
    console.log('Error fetching profile:', error);
    res.status(500).json({ errorMessage: 'Internal server error.' });
    // Store the user ID offline
    await writeUserIdToFile(req.body.userId);
  }
};

const fetchResidentProfileOffline = async (req, res) => {
  const folderPath = path.join(process.cwd(), 'user_ids');
  const filePath = path.join(folderPath, 'offline_scans.txt');
  const io = req.app.locals.io
  try {
    const internetConnected = await isInternetConnected();

    if (!internetConnected) {
      console.log('No internet connection.');
      return;
    }

    const data = await fs.promises.readFile(filePath, 'utf8');
    const entries = data.trim().split('\n');

    // Process each entry and fetch the resident profile
    for (const entry of entries) {
      const [userId, timestamp] = entry.split(',');


      let residentProfile;

      if (ObjectId.isValid(userId)) {
        // If the userId is a valid ObjectId, search for Resident
        residentProfile = await Resident.findOne({ userId: userId });
      } else {  
        // If it's a string, search for Guest
       
        residentProfile = await Worker.findOne({ username: userId });

        if(!residentProfile)
        {
          residentProfile = await Guest.findOne({ bookingNumber: userId });

        const hostId = residentProfile.host; // Assuming there is a field called "hostId" in the Guest model

        const host = await Resident.findOne({ _id: hostId });

        const ResidentUserId = host.userId
        const hostUserId = await User.findOne({ _id: ResidentUserId });
        const userResidentId = hostUserId._id
        const userResidentToken = hostUserId.fmcToken
        console.log("userId",userResidentId )
        console.log("userToken",userResidentToken )


        if (host) {



          const from = "Vonage APIs"
          const to = "639081772497"
          const text = 'A text message sent using the Vonage SMS API'
          
          async function sendSMS() {
              await vonage.sms.send({to, from, text})
                  .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                  .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
          }
          
          //sendSMS();




          const hostEmail = host.emailAddress; // Assuming there is a field called "email" in the Resident model
          console.log(hostEmail);
          console.log(residentProfile._id);
          const emailSubject = 'Guest Profile Search Notification';
          const emailBody = `A guest profile with booking number ${residentProfile.bookingNumber} has been successfully searched.`;
  
          // Use the mailer function to send the email
          await mailer({
            receiver: hostEmail,
            subject: emailSubject,
            body: emailBody
          });
        }

        const notification = await Notification.create({
          type: 'guest',
          heading: 'Guest Arrived!',
          body: 'New Guest Arrived!',
          dateCreated: Date.now(),
          otherDetails: {
            guestId: residentProfile._id,
          }
        })
  
        await User.updateOne(
          { _id: userResidentId },
          { $push: { notifications: {
            notificationId: notification._id,
            type: 'guest',
            heading: 'Guest Arrived!',
            body: 'Guest Arrived!',
            dateCreated: Date.now(),
            isRead: false,
            otherDetails: {
              guestId: residentProfile._id,
            }
          }}}
        )

        io.emit('notification', notification)

        if(notification){
          const message = {
            notification: {
              title: "Guest Arrived!",
              body: 'Guest Arrived!',
              image: "logo192.png"
            },
            webpush: {
              fcmOptions: {
                link: 'https://srgatepass-43131.web.app',
              },
              // headers: {
              //   image: 'http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png'
              // },
              notification: {
                icon:"favicon.ico",
                default_sound:true
                }
            },  
            // android: {
            //   notification: {
            //   imageUrl:"http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png",
            //   default_sound:true,
            //   icon:"http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png",
            //   color:'#7e55c3'
            //   }
            // },
            token: userResidentToken,
          };
          
          getMessaging()
            .send(message)
            .then((response) => {
              // res.status(200).json({
              //   message: "Successfully sent message",message,
              //   token: receivedToken,
              // });
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              // res.status(400);
              // res.send(error);
              console.log("Error sending message:", error);
            });
        }

      }
    }
      
      if (residentProfile) {
        console.log('Arrived at',timestamp );

        // Update the timeArrived for the Guest or Resident if found
        if (residentProfile instanceof Guest || residentProfile instanceof Resident  || residentProfile instanceof Worker) {
          residentProfile.timeArrived = new Date(timestamp); // Assuming timestamp is in a valid date format
          await residentProfile.save();
        }

        res.status(200).json(residentProfile);
        // Delete the entry from the file if the profile is found online
        const newData = data.replace(`${entry}\n`, '');
        await fs.promises.writeFile(filePath, newData, 'utf8');

        console.log(`Resident profile found online for userId: ${userId}`);
        console.log('Resident profile:', residentProfile);
      }
    }
  } catch (error) {
    console.log('Error fetching resident profile offline:', error);
  }
};

const getResidentProfileRfid = async (req, res) => {
  try {
    const { userId } = req.body;
    
    console.log('Received userId:', userId);

    const residentProfile = await Resident.findOne({ userId });
    console.log('Resident profile:', residentProfile);

    if (residentProfile) {
      res.status(200).json(residentProfile);
    } else {
      res.status(404).json({ errorMessage: 'Resident profile not found.' });
    }
  } catch (error) {
    console.log('Error fetching resident profile:', error);
    res.status(500).json({ errorMessage: 'Internal server error.' });
  }
};

const getResidentProfileBookingNum = async (req, res) => {
  try {
    const { bookingNumber } = req.body;
    const io = req.app.locals.io
    console.log('Received userId:', bookingNumber);

    let residentProfile;

    if (ObjectId.isValid(bookingNumber)) {
      // If the userId is a valid ObjectId, search for Resident
      residentProfile = await Resident.findOne({ userId: bookingNumber });
  
    } 
    else {
      // If it's a string, search for Guest
      residentProfile = await Worker.findOne({ username: bookingNumber });
     

      if(!residentProfile)
      {
        residentProfile = await Guest.findOne({ bookingNumber: bookingNumber });

        const hostId = residentProfile.host; // Assuming there is a field called "hostId" in the Guest model
        const host = await Resident.findOne({ _id: hostId });

        const ResidentUserId = host.userId
        const hostUserId = await User.findOne({ _id: ResidentUserId });
        const userResidentId = hostUserId._id
        const userResidentToken = hostUserId.fmcToken
        console.log("userId",userResidentId )
        console.log("userToken",userResidentToken )
       
        
        if (host) {


          const from = "Vonage APIs"
          const to = "639081772497"
          const text = 'A text message sent using the Vonage SMS API'
          
          async function sendSMS() {
              await vonage.sms.send({to, from, text})
                  .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                  .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
          }
          
          //sendSMS();



          const hostEmail = host.emailAddress; // Assuming there is a field called "email" in the Resident model
          console.log(hostEmail);
          console.log(hostId);
          console.log(residentProfile._id);
          const emailSubject = 'Guest Profile Search Notification';
          const emailBody = `A guest profile with booking number ${residentProfile.bookingNumber} has been successfully searched.`;
  
          // Use the mailer function to send the email
          await mailer({
            receiver: hostEmail,
            subject: emailSubject,
            body: emailBody
          });
  
          const notification = await Notification.create({
            type: 'guest',
            heading: 'Guest Arrived!',
            body: 'New Guest Arrived!',
            dateCreated: Date.now(),
            otherDetails: {
              guestId: residentProfile._id,
            }
          })
    
          await User.updateOne(
            { _id: userResidentId },
            { $push: { notifications: {
              notificationId: notification._id,
              type: 'guest',
              heading: 'Guest Arrived!',
              body: 'Guest Arrived!',
              dateCreated: Date.now(),
              isRead: false,
              otherDetails: {
                guestId: residentProfile._id,
              }
            }}}
          )
  
          io.emit('notification', notification)

          if(notification){
            const message = {
              notification: {
                title: "Guest Arrived!",
                body: 'Guest Arrived!',
                image: "logo192.png"
              },
              webpush: {
                fcmOptions: {
                  link: 'https://srgatepass-43131.web.app',
                },
                // headers: {
                //   image: 'http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png'
                // },
                notification: {
                  icon:"favicon.ico",
                  //default_sound:true,
                  sound: "srnotif.mp3"
                  }
              },  
              // android: {
              //   notification: {
              //   imageUrl:"http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png",
              //   default_sound:true,
              //   icon:"http://www.homerictours.com/images/icons/DryIcons/balloonica-icons-set/png/24x24/accept.png",
              //   color:'#7e55c3'
              //   }
              // },
              token: userResidentToken,
            };
            
            getMessaging()
              .send(message)
              .then((response) => {
                // res.status(200).json({
                //   message: "Successfully sent message",message,
                //   token: receivedToken,
                // });
                console.log("Successfully sent message:", response);
              })
              .catch((error) => {
                // res.status(400);
                // res.send(error);
                console.log("Error sending message:", error);
              });
          }
        }
      }
      
    }

    console.log('Resident profile:', residentProfile);

    if (residentProfile) {
        // Update the timeArrived for the Guest or Resident if found
        if (residentProfile instanceof Guest || residentProfile instanceof Resident || residentProfile instanceof Worker) {
          residentProfile.timeArrived = new Date(); // Assuming timestamp is in a valid date format
          await residentProfile.save();
        }
        res.status(200).json(residentProfile);
        console.log('Resident profile:', residentProfile);
    } else {
      res.status(404).json({ errorMessage: 'Profile not found.' });
      // Store the user ID offline
      await writeUserIdToFile(bookingNumber);
    }
  } catch (error) {
    console.log('Error fetching profile:', error);
    res.status(500).json({ errorMessage: 'Internal server error.' });
    // Store the user ID offline
    await writeUserIdToFile(req.body.bookingNumber);
  }
};

// const getResidentProfileBookingNum = async (req, res) => {
//   try {
//     const { bookingNumber } = req.body;
//     const io = req.app.locals.io
//     console.log('Received bookingNumber:', bookingNumber);

//     const residentProfile = await Guest.findOne({ bookingNumber });
//     console.log('Resident profile:', residentProfile);

//     if (residentProfile) {
//      // Send email to the host
//       const hostId = residentProfile.host; // Assuming there is a field called "hostId" in the Guest model
//       const host = await Resident.findOne({ userId: hostId });
//       if (host) {
//         const hostEmail = host.emailAddress; // Assuming there is a field called "email" in the Resident model
//         console.log(hostEmail);
//         const emailSubject = 'Guest Profile Search Notification';
//         const emailBody = `A guest profile with booking number ${bookingNumber} has been successfully searched.`;

//         // Use the mailer function to send the email
//         await mailer({
//           receiver: hostEmail,
//           subject: emailSubject,
//           body: emailBody
//         });

//         const notification = await Notification.create({
//           type: 'guest',
//           heading: 'Guest Arrived!',
//           body: 'New Guest Arrived!',
//           dateCreated: Date.now(),
//           otherDetails: {
//             guestId: residentProfile._id,
//           }
//         })
  
//         await User.updateOne(
//           { _id: hostId },
//           { $push: { notifications: {
//             notificationId: notification._id,
//             type: 'guest',
//             heading: 'Guest Arrived!',
//             body: 'Guest Arrived!',
//             dateCreated: Date.now(),
//             isRead: false,
//             otherDetails: {
//               guestId: residentProfile._id,
//             }
//           }}}
//         )

//         io.emit('notification', notification)

//       }
//        // Update the timeArrived for the Guest or Resident if found
//        if (residentProfile instanceof Guest || residentProfile instanceof Resident) {
//         residentProfile.timeArrived = new Date(); // Assuming timestamp is in a valid date format
//         await residentProfile.save();
//       }
//       res.status(200).json(residentProfile);
//       console.log('Resident profile:', residentProfile);

//     } else {
//       return res.status(404).json({ errorMessage: 'Resident profile not found.' });
//     }
//   } catch (error) {
//     console.log('Error fetching resident profile:', error);
//     return res.status(500).json({ errorMessage: 'Internal server error.' });
//   }
// };

export { getResidentProfileRfid,getResidentProfileQr,getResidentProfileBookingNum,fetchResidentProfileOffline,isInternetConnected };

  // import { Resident} from '../models/index.js'

  // const getResidentProfile = async (req, res) => {
  //   try {
  //     const { userId } = req.body;
  //     const residentProfile = await Resident.findOne({ userId });

  //     if (residentProfile) {
  //       res.status(200).json(residentProfile);
  //     } else {
  //       res.status(404).json({ errorMessage: 'Resident profile not found.' });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ errorMessage: 'Internal server error.' });
  //   }
  // };

  // export { getResidentProfile };
