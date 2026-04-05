import { v2 as cloudinary } from "cloudinary";
import { env } from "../../../config/env.service.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_API_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/////////////////////////
// Uploads an image file
/////////////////////////

export const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "e-commerce",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      )
      .end(fileBuffer);
  });
};
