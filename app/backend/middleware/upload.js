import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

const storage = multer.memoryStorage()
export const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only images are allowed'))
    }
  }
})
// profile-pictures, logos, flyers
export const uploadToS3 = async (file, folder) => {
  const key = `${folder}/${Date.now()}-${file.originalname}`
  
  const uploader = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    }
  })

  await uploader.done()
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}


// we're returning the URL of the uploaded file to s3. so what we'd usually do in production is the following:
// user presses button to upload a file -> we call uploadToS3(file, profile-pictures) -> we get back a URL -> we save that URL in our database -> we use that url for displaying the image