import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const URI = process.env.DATABASE_URI

const dbConnect = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('MongoDB Connected')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default dbConnect