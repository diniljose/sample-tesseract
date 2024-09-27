import { BadRequestException, Controller, Get, HttpStatus, InternalServerErrorException, Param, Post, Query, Req, Res, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';

import { FastifyRequest, FastifyReply } from 'fastify';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post('/ocr')
  async uploadDocument(
    @Req() req: FastifyRequest<{ Body: { file: any[] } }>,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
      const { file: files } = req.body;

      if (!files || files.length === 0) {
        throw new BadRequestException('File data is missing');
      }

      const file = files[0];
      if (!file || !file.data || !file.mimetype) {
        throw new BadRequestException('Invalid file data');
      }

      const bufferData = file.data; // Buffer data from the uploaded file
      const mimeType = file.mimetype;

      let extractedData;

      // Process the file based on its MIME type
      if (mimeType.startsWith('image/')) {
        extractedData = await this.appService.extractText(bufferData); // Process images
      } else if (mimeType === 'application/pdf') {
        // extractedData = await this.appService.processPdf(bufferData); // Process PDFs
      } else {
        throw new BadRequestException('Unsupported file type');
      }

      return res.status(200).send(
        {
          status:'success',
          data:extractedData
        });
    } catch (error) {
      console.log("ee",error);
      
      console.error('Error handling document upload:', error);
      res.status(error.status || 500).send({
        status:'error',
        message: error.message || 'Internal server error',
      });
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
