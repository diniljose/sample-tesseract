import { Injectable, InternalServerErrorException } from '@nestjs/common';
import path from 'path';
import { createWorker } from 'tesseract.js';
import * as fs from 'fs';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  worker!: Tesseract.Worker;

  constructor(){}


  async extractText(buffer: Buffer): Promise<string> {
    try {
      // Path to your custom traineddata file
  
     
  
      // Initialize the Tesseract worker with the custom options
      this.worker = await createWorker('mrz',1,{
        // langPath: '../..',
        gzip:false
      });
  

  
      // Set parameters if needed
      await this.worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<',
        tessedit_char_blacklist: '!"#$%&\'()*+,-./:;=?@[\\]^_`{|}~',
        // tessedit_page_seg_mode: Tesseract.PSM.SINGLE_BLOCK, // Uncomment if you need specific page segmentation mode
      });
  
      // Perform text recognition
      const result = await this.worker.recognize(buffer);
      const { text } = result.data;
  
      console.log('Tesseract text:', text);
      return text.trim();
    } catch (error) {
      console.error('Error extracting text:', error);
      throw new InternalServerErrorException('Error extracting text');
    } finally {
      // Clean up the worker
      if (this.worker) {
        await this.worker.terminate();
      }
    }
  }
}
