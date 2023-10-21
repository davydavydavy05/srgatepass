import asyncHandler from "express-async-handler";

import { Guest, Notification, Resident, User } from "../models/index.js";

import { Vonage } from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: "5c8a3495",
  apiSecret: "S0OrhiGALBvfnrXe",
});
  // apiKey: "3b512d6d",
  // apiSecret: "P9NIWAIw3F0puho2",

// @desc    Fetch guests
// @route   POST /api/guest/fetch-guests
// @access  Public
const fetchGuests = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    var guests;

    // // Return all the guests with isCancel set to false
    // if (!userId) {
    //   guests = await Guest.find({ isCanceled: false }).populate("host");
    // } else {
    //   guests = await Guest.find({ host: userId, isCanceled: false });
    // }

    // Return all the guests
    if (!userId) {                                              
      guests = await Guest.find().populate('host')
    } else {
      guests = await Guest.find({ host: userId })
    }

    return res.status(200).json(guests);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch guests" });
  }
});

// @desc    Fetch guest
// @route   POST /api/guest/fetch-guest
// @access  Public
const fetchGuest = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const guest = await Guest.findOne({ _id: id }).populate("host");
  return res.status(200).json(guest);
});

// const fetchGuestNameCount = asyncHandler(async (req,res) => {
//   const { selectedDate } = req.body
//   const guestsNameCount = await Guest.findOne({ dateBooked: selectedDate })
//   console.log('count',guestsNameCount )
//   return res.status(200).json(guestsNameCount)
// })

// const fetchGuestNameCount = asyncHandler(async (req, res) => {
//   const { selectedDate } = req.body;

//   console.log('date', selectedDate);
//   // Find all guests with the selected date in the dateBooked array
//   const guestsWithSameDate = await Guest.find({ dateBooked: { $in: [selectedDate] } });

//   console.log('count', guestsWithSameDate);

//   return res.status(200).json(guestsWithSameDate);
// });

const fetchGuestNameCount = asyncHandler(async (req, res) => {
  const { selectedDate } = req.body;

  // Convert selectedDate to ISO format, and remove the time component
  const isoSelectedDate = new Date(selectedDate).toISOString().split("T")[0];

  // Find all guests with a dateBooked within the same date
  const guestsWithSameDate = await Guest.find({
    dateBooked: {
      $gte: new Date(isoSelectedDate),
      $lt: new Date(new Date(isoSelectedDate).getTime() + 24 * 60 * 60 * 1000), // Add one day to get the next day
    },
  });

  //console.log('count', guestsWithSameDate);

  let totalNameCount = 0;
  for (const guest of guestsWithSameDate) {
    totalNameCount += guest.name.length;
  }

  //console.log('Total name count', totalNameCount);

  return res.status(200).json(totalNameCount);
});

// @desc    Check if guest exists
// @route   POST /api/guest/check-if-guest-exists
// @access  Public
const checkIfGuestExists = asyncHandler(async (req, res) => {
  const { name, phoneNumber, emailAddress } = req.body;

  // Check if user exists
  const user = await User.findOne({ emailAddress });

  // Check if guest exists
  const guestExists = await Guest.findOne({
    name,
    phoneNumber,
    host: user._id,
  });

  if (!user) {
    res.status(400).json({ errorMessage: `User doesn't exist.` });
    throw new Error(`User doesn't exist.`);
  }

  if (guestExists) {
    return res.status(200).json(guestExists);
  }

  res.status(400).json({ message: "Guest does not exist" });
});

// @desc    Book guest
// @route   POST /api/guest/book-guest
// @access  Public
const bookGuest = asyncHandler(async (req, res) => {
  const {
    bookingNumber,
    dateOfArrival,
    details,
    // name,
    phoneNumber,
    plateNumber,
    qrCodeImage,
    pin,
    emailAddress,
  } = req.body;

  const io = req.app.locals.io;

  if (!phoneNumber || !pin) {
    res.status(400);
    throw new Error("Input all the fields.");
  }
  const guestNamesArr = req.body["name[]"];

  // Extract time values
  const timeFrom = req.body["time[from]"];
  const timeTo = req.body["time[to]"];

  // Create the time object
  const timeObject = {
    from: timeFrom,
    to: timeTo,
  };
  // const guestNamesArr = Object.keys(req.body)
  // .filter(key => key.startsWith('name['))
  // .map(key => req.body[key]);

  // Copy landCertificate values into an array
  // const landCertificateArr = Object.keys(req.body)
  // .reduce((arr, key) => {
  //   const match = key.match(/landCertificate\[(\d+)\]\[(\w+)\]/)

  //   if (match) {
  //     const index = Number(match[1])
  //     const property = match[2]

  //     if (!arr[index]) {
  //       arr[index] = {}
  //     }

  //     arr[index][property] = req.body[key]
  //   }

  //   return arr
  // }, [])

  console.log("name array", guestNamesArr);
  console.log("time obj", timeObject);
  console.log("body", req.body);
  // Check if user exists
  const user = await User.findOne({ emailAddress });
  const host = await Resident.findOne({ userId: user._id });

  if (!user) {
    res.status(400).json({ errorMessage: `User doesn't exist.` });
    throw new Error(`User doesn't exist.`);
  }

  // Check if guest exists
  const guestExists = await Guest.findOne({
    guestNamesArr,
    phoneNumber,
    host: user._id,
  });

  if (guestExists) {
    // Check if guest is already booked
    var inputDate = new Date(
      guestExists.dateBooked[guestExists.dateBooked.length - 1]
    );
    var today = new Date();

    if (isNaN(inputDate)) {
      console.log("Invalid date format");
      return false;
    }

    var isSameYear = inputDate.getFullYear() === today.getFullYear();
    var isSameMonth = inputDate.getMonth() === today.getMonth();
    var isSameDay = inputDate.getDate() === today.getDate();

    if (isSameYear && isSameMonth && isSameDay) {
      res
        .status(400)
        .json({ errorMessage: "The guest is already booked today." });
      throw new Error("The guest is already booked today.");
    }

    // If not already booked
    const guest = await Guest.updateOne(
      { _id: guestExists._id },
      {
        $set: { pin },
        $push: { ["dateBooked"]: Date.now() },
      }
    );
    const guestCount = await Guest.countDocuments();

    if (guest.modifiedCount > 0) {
      const guestRes = await Guest.findOne({ _id: guestExists._id });
      const notification = await Notification.create({
        type: "guest",
        heading: "Guest Booked!",
        body: "Guest successfully booked.",
        dateCreated: Date.now(),
        otherDetails: {
          guestId: guestExists._id,
        },
      });

      await User.updateMany(
        { emailAddress },
        {
          $push: {
            notifications: {
              notificationId: notification._id,
              type: "guest",
              heading: "Your guest has been booked!",
              body: "The gate pass of your guest is valid for 24 hours only.",
              dateCreated: Date.now(),
              isRead: false,
              otherDetails: {
                guestId: guestExists._id,
              },
            },
          },
        }
      );

      io.emit("guestCount", guestCount);
      io.emit("notification", notification);
      return res.status(200).json(guestRes);
    } else {
      res
        .status(400)
        .json({ errorMessage: `Error. There's a problem encountered.` });
      throw new Error(`Error. There's a problem encountered.`);
    }
  }

  // If not exists
  const guest = await Guest.create({
    bookingNumber,
    host,
    name: guestNamesArr,
    phoneNumber,
    plateNumber,
    dateBooked: Date.now(),
    qrCodeImage,
    pin,
    dateOfArrival,
    time: [timeObject],
    details,
    type: "Guest",
  });
  const guestCount = await Guest.countDocuments();

  const guesthost = await Resident.findOne({ _id: guest.host });

  const from = "Vonage APIs";
  const to = "639319247711";
  // const text = "A text message sent using the Vonage SMS API";
  const text = `A new booking has been made by ${guesthost.firstName} ${guesthost.lastName}\n
  Name: ${guest.name[0]}
  Phone Number: ${guest.phoneNumber}
  Booking Date: ${guest.dateBooked}
  Time of Arrival: ${guest.time[0]?.from} - ${guest.time[0]?.to}
  Details: ${guest.details}\n
  Booking Number: ${guest.bookingNumber}`;


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

  // sendSMS();

  // const guestCountByName = await Guest.aggregate([
  //   {
  //     $unwind: "$name"
  //   },
  //   {
  //     $group: {
  //       _id: "$name",
  //       count: { $sum: 1 }
  //     }
  //   }
  // ]);

  // console.log(guestCountByName);

  // // Calculate the total count of names by summing up the individual counts
  // const totalGuestCount = guestCountByName.reduce((total, entry) => total + entry.count, 0);

  // console.log(totalGuestCount);

  const result = await Guest.updateOne(
    { _id: guest._id },
    { $set: { urlLink: `localhost:3000/${guest._id}` } }
  );

  if (result) {
    const notification = await Notification.create({
      type: "guest",
      heading: "Guest Booked!",
      body: "Guest successfully booked.",
      dateCreated: Date.now(),
      otherDetails: {
        guestId: guest._id,
      },
    });

    await User.updateMany(
      { emailAddress },
      {
        $push: {
          notifications: {
            notificationId: notification._id,
            type: "guest",
            heading: "Your guest has been booked!",
            body: "The gate pass of your guest is valid for 24 hours only.",
            dateCreated: Date.now(),
            isRead: false,
            otherDetails: {
              guestId: guest._id,
            },
          },
        },
      }
    );

    await User.updateMany(
      { type:  { $in: ["admin", "security"] }}, // Query to find users with type 'admin'
      {
        $push: {
          notifications: {
            notificationId: notification._id,
            type: "guest",
            heading: "New Guest Booked",
            body: "New Guest Booked.",
            dateCreated: Date.now(),
            isRead: false,
            otherDetails: {
              guestId: guest._id,
            },
          },
        },
      }
    );

    io.emit("guestCount", guestCount);
    io.emit("notification", notification);

    res.status(200).json({ guest });
  } else {
    res
      .status(400)
      .json({ errorMessage: `Error. There's a problem encountered.` });
    throw new Error(`Error. There's a problem encountered.`);
  }
});

// @desc    Unlock gate pass
// @route   POST /api/guest/unlock-gate-pass
// @access  Public
const unlockGatePass = asyncHandler(async (req, res) => {
  const { id, pin } = req.body;
  const guest = await Guest.findOne({ _id: id });

  if (guest.pin === pin) {
    return res.status(200).json({ guest });
  } else {
    res.status(400).json({ errorMessage: "Invalid pin. Try again." });
    throw new Error("Invalid pin. Try again.");
  }
});

const updateUserCancelStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;

    const io = req.app.locals.io;

    const guest = await Guest.findOne({ _id: id }); // Retrieve the guest

    if (!guest) {
      console.log("Guest not found.");
      return res.status(404).json({ message: "Guest not found." });
    }

    // Update the isCanceled field to true
    guest.isCanceled = true;

    // Check and remove last element from dateOfArrival if it has more than one element
    if (guest.dateOfArrival.length > 1) {
      guest.dateOfArrival.pop();
    }

    // Check and remove last element from time if it has more than one element
    if (guest.time.length > 1) {
      guest.time.pop();
    }

    // Check and remove last element from dateBooked if it has more than one element
    if (guest.dateBooked.length > 1) {
      guest.dateBooked.pop();
    }

    // Save the updated guest
    const updatedGuest = await guest.save();

    console.log("Guest isCanceled updated:", updatedGuest);

    res.status(200).json({ message: "Guest isCancel updated successfully." });

    const guestCount = await Guest.countDocuments();
    io.emit("guestCount", guestCount);
  } catch (error) {
    console.error("Error updating guest:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// const updateUserCancelStatus = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.body;

//     const io = req.app.locals.io;
//     // Assuming you have a User model
//     const updatedGuest = await Guest.findOneAndUpdate(
//       { _id: id }, // Use your criteria to identify the user based on userId
//       { 
//         $set: { isCanceled: true }, 
//         $pop: { 
//           dateOfArrival: 1, 
//           time: 1,          
//           dateBooked: 1     
//         } 
//       },
//       { new: true }
//     );

//     if (updatedGuest) {
//       console.log("User token updated:", updatedGuest);
//       res.status(200).json({ message: "Guest isCancel updated successfully." });
//       const guestCount = await Guest.countDocuments();
//       io.emit("guestCount", guestCount);
//     } else {
//       console.log("User not found.");
//       res.status(404).json({ message: "Guest not found." });
//     }
//   } catch (error) {
//     console.error("Error updating user token:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });


// const updateUserCancelStatus = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.body;

//     const io = req.app.locals.io;
//     // Assuming you have a User model
//     const updatedGuest = await Guest.findOneAndUpdate(
//       { _id: id }, // Use your criteria to identify the user based on userId
//       { $set: { isCanceled: true }, $pop: { dateOfArrival: -1, time: -1 ,dateBooked : -1} }, // Update isCancel field to true and remove the last elements from dateOfArrival and time arrays
//       { new: true }
//     );

//     if (updatedGuest) {
//       console.log("User token updated:", updatedGuest);
//       res.status(200).json({ message: "Guest isCancel updated successfully." });
//       const guestCount = await Guest.countDocuments();
//       io.emit("guestCount", guestCount);
//     } else {
//       console.log("User not found.");
//       res.status(404).json({ message: "Guest not found." });
//     }
//   } catch (error) {
//     console.error("Error updating user token:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });


const editGuest = asyncHandler(async (req, res) => {
  try {
    const { details, _id } = req.body;
    const guestNamesArr = req.body["name[]"];
    console.log("body", req.body);
    // Check if resident profile and username already exists
    // const user = await Guest.findOne({ emailAddress })

    const profile = await Guest.updateOne(
      { _id: _id },
      {
        $set: {
          name: guestNamesArr,
          details,
        },
      }
    );
    if (profile) {
      res.status(200).json(profile);
      console.log("edited", profile);
    }
  } catch (error) {
    console.error("Error updating user token:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const reBookGuest = asyncHandler(async (req, res) => {
  const {
    bookingNumber,
    dateOfArrival,
    details,
    phoneNumber,
    plateNumber,
    pin, emailAddress
  } = req.body;

  const io = req.app.locals.io;

  if (!phoneNumber || !pin) {
    res.status(400);
    throw new Error("Input all the fields.");
  }
  
  const guestNamesArr = req.body["name[]"];
  const timeFrom = req.body["time[from]"];
  const timeTo = req.body["time[to]"];

  const timeObject = {
    from: timeFrom,
    to: timeTo,
  };

  console.log("name array", guestNamesArr);
  console.log("time obj", timeObject);
  console.log("body", req.body);

  const guest = await Guest.findOneAndUpdate(
    { bookingNumber: bookingNumber }, // Find the guest by booking number
    {
      name: guestNamesArr,
      phoneNumber,
      plateNumber,
      pin,
      $push: { time: timeObject , dateOfArrival, dateBooked: Date.now() }, // Add the new time object to the array
      details,
      isCanceled: false
    },
    { new: true } // Return the updated document
  );
  

  if (guest) {
    const notification = await Notification.create({
      type: "guest",
      heading: "Guest rebooked!",
      body: "Guest rebooked successfully.",
      dateCreated: Date.now(),
      otherDetails: {
        guestId: guest._id,
      },
    });

    await User.updateMany(
      { emailAddress },
      {
        $push: {
          notifications: {
            notificationId: notification._id,
            type: "guest",
            heading: "Your guest have been rebooked!",
            body: "The gate pass of your guest is still valid.",
            dateCreated: Date.now(),
            isRead: false,
            otherDetails: {
              guestId: guest._id,
            },
          },
        },
      }
    );

    await User.updateMany(
      { type: "admin" }, // Query to find users with type 'admin'
      {
        $push: {
          notifications: {
            notificationId: notification._id,
            type: "guest",
            heading: "Guest rebooked",
            body: "Guest rebooked successfully.",
            dateCreated: Date.now(),
            isRead: false,
            otherDetails: {
              guestId: guest._id,
            },
          },
        },
      }
    );

    io.emit("notification", notification);

    res.status(200).json({ guest });
  } else {
    res
      .status(400)
      .json({ errorMessage: `Error. Guest not found.` });
    throw new Error(`Error. Guest not found.`);
  }
});


// const reBookGuest = asyncHandler(async (req, res) => {
//   const {
//     bookingNumberToEdit,
//     dateOfArrival,
//     details,
//     // name,
//     phoneNumber,
//     plateNumber,
//     qrCodeImage,
//     pin,
//     emailAddress,
//   } = req.body;

//   const io = req.app.locals.io;

//   if (!phoneNumber || !pin) {
//     res.status(400);
//     throw new Error("Input all the fields.");
//   }
//   const guestNamesArr = req.body["name[]"];

//   // Extract time values
//   const timeFrom = req.body["time[from]"];
//   const timeTo = req.body["time[to]"];

//   // Create the time object
//   const timeObject = {
//     from: timeFrom,
//     to: timeTo,
//   };
//   // const guestNamesArr = Object.keys(req.body)
//   // .filter(key => key.startsWith('name['))
//   // .map(key => req.body[key]);

//   // Copy landCertificate values into an array
//   // const landCertificateArr = Object.keys(req.body)
//   // .reduce((arr, key) => {
//   //   const match = key.match(/landCertificate\[(\d+)\]\[(\w+)\]/)

//   //   if (match) {
//   //     const index = Number(match[1])
//   //     const property = match[2]

//   //     if (!arr[index]) {
//   //       arr[index] = {}
//   //     }

//   //     arr[index][property] = req.body[key]
//   //   }

//   //   return arr
//   // }, [])

//   console.log("name array", guestNamesArr);
//   console.log("time obj", timeObject);
//   console.log("body", req.body);

//   // If not exists
//   const guest = await Guest.create({
//     bookingNumber,
//     host,
//     name: guestNamesArr,
//     phoneNumber,
//     plateNumber,
//     dateBooked: Date.now(),
//     qrCodeImage,
//     pin,
//     dateOfArrival,
//     time: [timeObject],
//     details,
//     type: "Guest",
//   });
//   const guestCount = await Guest.countDocuments();


//   const result = await Guest.updateOne(
//     { _id: guest._id },
//     { $set: { urlLink: `localhost:3000/${guest._id}` } }
//   );

//   if (result) {
//     const notification = await Notification.create({
//       type: "guest",
//       heading: "Guest Booked!",
//       body: "Guest successfully booked.",
//       dateCreated: Date.now(),
//       otherDetails: {
//         guestId: guest._id,
//       },
//     });

//     await User.updateMany(
//       { emailAddress },
//       {
//         $push: {
//           notifications: {
//             notificationId: notification._id,
//             type: "guest",
//             heading: "Your guest has been booked!",
//             body: "The gate pass of your guest is valid for 24 hours only.",
//             dateCreated: Date.now(),
//             isRead: false,
//             otherDetails: {
//               guestId: guest._id,
//             },
//           },
//         },
//       }
//     );

//     await User.updateMany(
//       { type: "admin" }, // Query to find users with type 'admin'
//       {
//         $push: {
//           notifications: {
//             notificationId: notification._id,
//             type: "guest",
//             heading: "New Guest Booked",
//             body: "New Guest Booked.",
//             dateCreated: Date.now(),
//             isRead: false,
//             otherDetails: {
//               guestId: guest._id,
//             },
//           },
//         },
//       }
//     );

//     io.emit("guestCount", guestCount);
//     io.emit("notification", notification);

//     res.status(200).json({ guest });
//   } else {
//     res
//       .status(400)
//       .json({ errorMessage: `Error. There's a problem encountered.` });
//     throw new Error(`Error. There's a problem encountered.`);
//   }
// });

export {
  fetchGuests,
  fetchGuest,
  bookGuest,
  checkIfGuestExists,
  unlockGatePass,
  updateUserCancelStatus,
  fetchGuestNameCount,
  editGuest,reBookGuest
};

