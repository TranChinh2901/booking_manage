import multer from "multer";

import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(
        new AppError(
          ErrorMessages.INVALID_IMAGE_FILE,
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_IMAGE_FILE
        )
      );
      return;
    }

    callback(null, true);
  },
});
