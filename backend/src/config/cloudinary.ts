import { v2 as cloudinary } from "cloudinary";

import { loadedEnv } from "@/config/load-env";

cloudinary.config({
  cloud_name: loadedEnv.cloudinary.cloudName,
  api_key: loadedEnv.cloudinary.apiKey,
  api_secret: loadedEnv.cloudinary.apiSecret,
  secure: true,
});

export { cloudinary };
