import { Resident,Guest,Notification,User,Worker } from '../models/index.js';
import { 
  emailTemplate, 
  mailer 
} from '../utils/index.js'
import mongoose from 'mongoose';

//baasta
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import http from 'http';



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
        
        if (host) {

          
       
          const from = "Vonage APIs"
          const to = "639081772497"
          const text = 'A text message sent using the Vonage SMS API'
          
          async function sendSMS() {
              await vonage.sms.send({to, from, text})
                  .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                  .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
          }
          
          sendSMS();



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
            { _id: hostId },
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
        if (host) {



          const from = "Vonage APIs"
          const to = "639081772497"
          const text = 'A text message sent using the Vonage SMS API'
          
          async function sendSMS() {
              await vonage.sms.send({to, from, text})
                  .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                  .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
          }
          
          sendSMS();




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
          { _id: hostId },
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
        
        if (host) {


          const from = "Vonage APIs"
          const to = "639081772497"
          const text = 'A text message sent using the Vonage SMS API'
          
          async function sendSMS() {
              await vonage.sms.send({to, from, text})
                  .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                  .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
          }
          
          sendSMS();



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
            { _id: hostId },
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
