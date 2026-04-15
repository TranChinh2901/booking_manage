import { UploadApiResponse } from "cloudinary";

import { AppError } from "@/common/error.response";
import { cloudinary } from "@/config/cloudinary";
import { loadedEnv } from "@/config/load-env";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

import { UploadImageResponseDto } from "./dto/upload.dto";

export class UploadService {
  async uploadImage(
    file: Express.Multer.File,
    folder?: string
  ): Promise<UploadImageResponseDto> {
    this.ensureConfigured();

    const result = await this.uploadBuffer(file.buffer, folder);

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  }

  async uploadImages(
    files: Express.Multer.File[],
    folder?: string
  ): Promise<UploadImageResponseDto[]> {
    return await Promise.all(files.map((file) => this.uploadImage(file, folder)));
  }

  private uploadBuffer(
    buffer: Buffer,
    folder?: string
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.resolveFolder(folder),
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed"));
            return;
          }

          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });
  }

  private resolveFolder(folder?: string): string {
    const cleanFolder = folder?.replace(/[^a-zA-Z0-9/_-]/g, "");
    return cleanFolder || loadedEnv.cloudinary.folder;
  }

  private ensureConfigured(): void {
    if (
      !loadedEnv.cloudinary.cloudName ||
      !loadedEnv.cloudinary.apiKey ||
      !loadedEnv.cloudinary.apiSecret
    ) {
      throw new AppError(
        ErrorMessages.CLOUDINARY_NOT_CONFIGURED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.CLOUDINARY_NOT_CONFIGURED
      );
    }
  }
}

export default new UploadService();
