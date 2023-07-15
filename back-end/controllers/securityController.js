import { Resident } from '../models/index.js';

import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const getResidentProfile = async (req, res) => {
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

const getResidentProfileQr = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Received userId:', userId);

    const residentProfile = await Resident.findOne({ userId: userId });
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

export { getResidentProfile,getResidentProfileQr };

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
