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
  const announcements = await Announcement.find({});

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
  const { heading, body, isPin, emailAddress } = req.body;

  const io = req.app.locals.io; // Get the io object from app.locals

  const user = await User.findOne({ emailAddress });

  // Check if there's an announcement pinned
  const announcementPinned = await Announcement.findOne({ isPin: true });

  if (announcementPinned) {
    const announcement = await Announcement.create({
      postedBy: user._id,
      heading,
      body,
      datePosted: Date.now(),
      isPin: false,
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
      { type: { $ne: "admin" } },
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
      postedBy: user._id,
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
      { type: { $ne: "admin" } },
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

export { fetchAnnouncements, fetchAnnouncement, postAnnouncement };
