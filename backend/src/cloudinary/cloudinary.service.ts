import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import cloudinary from './cloudinary.config';



@Injectable()
export class CloudinaryService {

private readonly logger = new Logger(CloudinaryService.name);
async uploadImage(file:Express.Multer.File)
{
    this.logger.log(
        `Uploading image: ${file.originalname}`,
      );


     return new Promise((resolve,reject)=>
        {


         const upload =cloudinary.uploader.upload_stream(

            {
                 folder:"movie-production-system"
            },
            (error, result) => {

                if (error) {
    
                  this.logger.error(
                    error.message,
                    error.stack,
                  );
    
                  reject(error);
    
                  return;
                }
    
                this.logger.log(
                  "Image uploaded successfully",
                );
    
                resolve(result);
              },
            );
            upload.end(file.buffer);
        
        
        
        });
    }



}