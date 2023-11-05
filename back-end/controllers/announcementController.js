import asyncHandler from "express-async-handler";

import { Announcement, Notification, User } from "../models/index.js";

import { Vonage } from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: "3b512d6d",
  apiSecret: "P9NIWAIw3F0puho2",
});

// @desc    Fetch announcements
// @route   POST /api/announcement/fetch-announcements
// @access  Public
const fetchAnnouncements = asyncHandler(async (req, res) => {
  // const announcements = await Announcement.find({});
    const announcements = await Announcement.find({ isHide: false });
  return res.status(200).json(announcements);


  
});

// @desc    Fetch announcement
// @route   POST /api/announcement/fetch-announcement
// @access  Public
const fetchAnnouncement = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  const announcement = await Announcement.findOne({ _id });

  return res.status(200).json(announcement);
});

// @desc    Post announcement
// @route   POST /api/announcement/post-announcement
// @access  Public
const postAnnouncement = asyncHandler(async (req, res) => {
  const {
    heading,
    body,
    isPin,
    // emailAddress,
    postedBy,
  } = req.body;

  // Copy pictureArr values into an array
  const imageArray = Object.keys(req.body).reduce((arr, key) => {
    const match = key.match(/images\[(\d+)\]\[(\w+)\]/);

    if (match) {
      const index = Number(match[1]);
      const property = match[2];

      if (!arr[index]) {
        arr[index] = {};
      }

      arr[index][property] = req.body[key];
    }

    return arr;
  }, []);

  console.log(req.body, imageArray);

  const io = req.app.locals.io; // Get the io object from app.locals

  // const user = await User.findOne({ emailAddress })

  // Check if there's an announcement pinned
  const announcementPinned = await Announcement.findOne({ isPin: true });

  if (announcementPinned) {
    const announcement = await Announcement.create({
      // postedBy: user._id,
      postedBy,
      heading,
      images: imageArray,
      body,
      datePosted: Date.now(),
      isPin,
    });
    const notification = await Notification.create({
      type: "announcement",
      heading: "New Announcement Posted!",
      body: "New announcement posted! Check it out to stay updated.",
      dateCreated: Date.now(),
      otherDetails: {
        announcementId: announcement._id,
      },
    });

    await User.updateMany(
      { type: { $in: ["admin", "security","resident"] } },
      {
        $push: {
          notifications: {
            notificationId: notification._id,
            type: "announcement",
            heading: "New Announcement Posted!",
            body: "New announcement posted! Check it out to stay updated.",
            dateCreated: Date.now(),
            isRead: false,
            otherDetails: {
              announcementId: announcement._id,
            },
          },
        },
      }
    );

    if (announcement) {
      const from = "Vonage APIs";
      const to = "639081772497";
      const text = "A text message sent using the Vonage SMS API";

      async function sendSMS() {
        await vonage.sms
          .send({ to, from, text })
          .then((resp) => {
            console.log("Message sent successfully");
            console.log(resp);
          })
          .catch((err) => {
            console.log("There was an error sending the messages.");
            console.error(err);
          });
      }

      //sendSMS();

      io.emit("announcement", announcement);
      io.emit("notification", {
        notificationId: notification._id,
        type: "announcement",
        heading: "New Announcement Posted!",
        body: "New announcement posted! Check it out to stay updated.",
        dateCreated: Date.now(),
        isRead: false,
        otherDetails: {
          announcementId: announcement._id,
        },
      });

      return res.status(200).json(announcement);
    }
  } else {
    const announcement = await Announcement.create({
      // postedBy: user._id,
      postedBy,
      heading,
      body,
      datePosted: Date.now(),
      isPin,
    });
    const notification = await Notification.create({
      type: "announcement",
      heading: "New Announcement Posted!",
      body: "New announcement posted! Check it out to stay updated.",
      dateCreated: Date.now(),
      otherDetails: {
        announcementId: announcement._id,
      },
    });

    await User.updateMany(
      { type: { $in: ["admin", "security","resident"] } },
      {
        $push: {
          notifications: {
            notificationId: notification._id,
            type: "announcement",
            heading: "Announcement",
            body: "New announcement posted! Check it out to stay updated.",
            dateCreated: Date.now(),
            isRead: false,
            otherDetails: {
              announcementId: announcement._id,
            },
          },
        },
      }
    );

    if (announcement) {
      const from = "Vonage APIs";
      const to = "639081772497";
      const text = "A text message sent using the Vonage SMS API";

      async function sendSMS() {
        await vonage.sms
          .send({ to, from, text })
          .then((resp) => {
            console.log("Message sent successfully");
            console.log(resp);
          })
          .catch((err) => {
            console.log("There was an error sending the messages.");
            console.error(err);
          });
      }

      //sendSMS();

      io.emit("announcement", announcement);
      io.emit("notification", {
        notificationId: notification._id,
        type: "announcement",
        heading: "Announcement",
        body: "New announcement posted! Check it out to stay updated.",
        dateCreated: Date.now(),
        isRead: false,
        otherDetails: {
          announcementId: announcement._id,
        },
      });

      return res.status(200).json(announcement);
    }
  }

  res
    .status(400)
    .json({ errorMessage: `Error. There's a problem encountered.` });
  throw new Error("Error.");
});
const editAnnouncement = asyncHandler(async (req, res) => {
  const {
    announcementId,
    heading,
    body,
    isPin,
    postedBy,
  } = req.body;

  // Copy pictureArr values into an array
  const imageArray = Object.keys(req.body).reduce((arr, key) => {
    const match = key.match(/images\[(\d+)\]\[(\w+)\]/);

    if (match) {
      const index = Number(match[1]);
      const property = match[2];

      if (!arr[index]) {
        arr[index] = {};
      }

      arr[index][property] = req.body[key];
    }

    return arr;
  }, []);

  const io = req.app.locals.io; // Get the io object from app.locals

  try {
    const editedAnnouncement = await Announcement.findById(announcementId);

    if (!editedAnnouncement) {
      return res.status(404).json({ errorMessage: 'Announcement not found' });
    }

    // Only update isPin if it's different from the current value
    if (isPin !== editedAnnouncement.isPin) {
      // If the edited announcement isPin is true, set all other announcements' isPin to false
      if (isPin) {
        await Announcement.updateMany(
          { _id: { $ne: announcementId } },
          { $set: { isPin: false } }
        );
      }
    }

    const updateFields = {
      heading,
      body,
      isPin,
    };

    // Only update images if imageArray is not empty
    if (imageArray.length > 0) {
      updateFields.images = imageArray;
    }

    const announcement = await Announcement.findByIdAndUpdate(
      announcementId,
      updateFields,
      { new: true }
    );

    if (announcement) {
      io.emit('announcement', announcement);
      return res.status(200).json(announcement);
    }
  } catch (error) {
    res.status(400).json({ errorMessage: `Error. There's a problem encountered.` });
    throw new Error(error);
  }
});


// const editAnnouncement = asyncHandler(async (req, res) => {
//   const {
//     announcementId,
//     heading,
//     body,
//     isPin,
//     postedBy,
//   } = req.body;

//   // Copy pictureArr values into an array
//   const imageArray = Object.keys(req.body).reduce((arr, key) => {
//     const match = key.match(/images\[(\d+)\]\[(\w+)\]/);

//     if (match) {
//       const index = Number(match[1]);
//       const property = match[2];

//       if (!arr[index]) {
//         arr[index] = {};
//       }

//       arr[index][property] = req.body[key];
//     }

//     return arr;
//   }, []);

//   console.log(req.body, imageArray);

//   const io = req.app.locals.io; // Get the io object from app.locals

//   try {
//     if (isPin) {
//       await Announcement.updateMany({ isPin: true }, { $set: { isPin: false } });
//     }

//     const updateFields = {
//       heading,
//       body,
//       isPin,
//     };

//     // Only update images if imageArray is not empty
//     if (imageArray.length > 0) {
//       updateFields.images = imageArray;
//     }

//     const announcement = await Announcement.findByIdAndUpdate(
//       announcementId,
//       updateFields,
//       { new: true }
//     );

//     if (announcement) {
//       io.emit("announcement", announcement);
//       return res.status(200).json(announcement);
//     }
//   } catch (error) {
//     res.status(400).json({ errorMessage: `Error. There's a problem encountered.` });
//     throw new Error(error);
//   }
// });

const deleteAnnouncement = asyncHandler(async (req, res) => {
  const {
    announcementId,

  } = req.body;
  const io = req.app.locals.io; // Get the io object from app.locals

  try {

    const announcement = await Announcement.findByIdAndUpdate(
      announcementId,
      { $set: { isHide: true } },
      { new: true }
    );

    if (announcement) {
      io.emit("announcement", announcement);
      return res.status(200).json(announcement);
    }
  } catch (error) {
    res.status(400).json({ errorMessage: `Error. There's a problem encountered.` });
    throw new Error(error);
  }
});



export { fetchAnnouncements, fetchAnnouncement, postAnnouncement,editAnnouncement,deleteAnnouncement };

// import asyncHandler from 'express-async-handler'

// import { Announcement, Notification, User } from '../models/index.js'

// import {Vonage} from '@vonage/server-sdk'

// const vonage = new Vonage({
//   apiKey: "3b512d6d",
//   apiSecret: "P9NIWAIw3F0puho2"
// })

// // @desc    Fetch announcements
// // @route   POST /api/announcement/fetch-announcements
// // @access  Public
// const fetchAnnouncements = asyncHandler(async (req, res) => {
//   const announcements = await Announcement.find({})

//   return res.status(200).json(announcements)
// })

// // @desc    Fetch announcement
// // @route   POST /api/announcement/fetch-announcement
// // @access  Public
// const fetchAnnouncement = asyncHandler(async (req, res) => {
//   const { _id } = req.body
//   const announcement = await Announcement.findOne({ _id })

//   return res.status(200).json(announcement)
// })

// // @desc    Post announcement
// // @route   POST /api/announcement/post-announcement
// // @access  Public
// const postAnnouncement = asyncHandler(async (req, res) => {
//   const {
//     heading,
//     body,
//     isPin,
//     emailAddress
//   } = req.body

//   const io = req.app.locals.io // Get the io object from app.locals

//   const user = await User.findOne({ emailAddress })

//   // Check if there's an announcement pinned
//   const announcementPinned = await Announcement.findOne({ isPin: true })

//   if (announcementPinned) {
//     const announcement = await Announcement.create({
//       postedBy: user._id,
//       heading,
//       body,
//       datePosted: Date.now(),
//       isPin: false
//     })
//     const notification = await Notification.create({
//       type: 'announcement',
//       heading: 'New Announcement Posted!',
//       body: 'New announcement posted! Check it out to stay updated.',
//       dateCreated: Date.now(),
//       otherDetails: {
//         announcementId: announcement._id
//       }
//     })

//     await User.updateMany(
//       { type: { $ne: 'admin' } },
//       { $push: { notifications: {
//         notificationId: notification._id,
//         type: 'announcement',
//         heading: 'New Announcement Posted!',
//         body: 'New announcement posted! Check it out to stay updated.',
//         dateCreated: Date.now(),
//         isRead: false,
//         otherDetails: {
//           announcementId: announcement._id
//         }
//       }}}
//     )

//     if (announcement) {

//       const from = "Vonage APIs"
//       const to = "639081772497"
//       const text = 'A text message sent using the Vonage SMS API'

//       async function sendSMS() {
//           await vonage.sms.send({to, from, text})
//               .then(resp => { console.log('Message sent successfully'); console.log(resp); })
//               .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
//       }

//       //sendSMS();

//       io.emit('announcement', announcement)
//       io.emit('notification', {
//         notificationId: notification._id,
//         type: 'announcement',
//         heading: 'New Announcement Posted!',
//         body: 'New announcement posted! Check it out to stay updated.',
//         dateCreated: Date.now(),
//         isRead: false,
//         otherDetails: {
//           announcementId: announcement._id
//         }
//       })

//       return res.status(200).json(announcement)
//     }
//   } else {
//     const announcement = await Announcement.create({
//       postedBy: user._id,
//       heading,
//       body,
//       datePosted: Date.now(),
//       isPin
//     })
//     const notification = await Notification.create({
//       type: 'announcement',
//       heading: 'New Announcement Posted!',
//       body: 'New announcement posted! Check it out to stay updated.',
//       dateCreated: Date.now(),
//       otherDetails: {
//         announcementId: announcement._id
//       }
//     })

//     await User.updateMany(
//       { type: { $ne: 'admin' } },
//       { $push: { notifications: {
//         notificationId: notification._id,
//         type: 'announcement',
//         heading: 'Announcement',
//         body: 'New announcement posted! Check it out to stay updated.',
//         dateCreated: Date.now(),
//         isRead: false,
//         otherDetails: {
//           announcementId: announcement._id
//         }
//       }}}
//     )

//     if (announcement) {

//             const from = "Vonage APIs"
//       const to = "639081772497"
//       const text = 'A text message sent using the Vonage SMS API'

//       async function sendSMS() {
//           await vonage.sms.send({to, from, text})
//               .then(resp => { console.log('Message sent successfully'); console.log(resp); })
//               .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
//       }

//       //sendSMS();

//       io.emit('announcement', announcement)
//       io.emit('notification', {
//         notificationId: notification._id,
//         type: 'announcement',
//         heading: 'Announcement',
//         body: 'New announcement posted! Check it out to stay updated.',
//         dateCreated: Date.now(),
//         isRead: false,
//         otherDetails: {
//           announcementId: announcement._id
//         }
//       })

//       return res.status(200).json(announcement)
//     }
//   }

//   res.status(400).json({ errorMessage: `Error. There's a problem encountered.` })
//   throw new Error('Error.')
// })

// export {
//   fetchAnnouncements,
//   fetchAnnouncement,
//   postAnnouncement
// }
