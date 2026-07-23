import { Injectable } from '@nestjs/common';

import cloudinary from './cloudinary.config';



@Injectable()
export class CloudinaryService {


async uploadImage(file:Express.Multer.File){


return new Promise((resolve,reject)=>{


const upload =
cloudinary.uploader.upload_stream(

{
folder:"movie-production-system"
},

(error,result)=>{


if(error)
{
reject(error);
}

else
{
resolve(result);
}


}

);


upload.end(file.buffer);



});


}


}