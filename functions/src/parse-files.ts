import Busboy from 'busboy';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { Request } from 'firebase-functions/lib/providers/https';

export type File = {
  path: string;
  type: string;
  name: string;
  encoding: string;
  file: NodeJS.ReadableStream;
};

export type ParseFilesResponse = {
  files: Record<string, File>;
  fields: Record<string, string>;
};

export const parseFiles = (req: Request): Promise<ParseFilesResponse> => {
  if (req.method !== 'POST' || !req.headers['content-type']) {
    return new Promise(resolve => resolve({ files: {}, fields: {} }));
  }
  // eslint-disable-next-line consistent-return
  return new Promise(masterResolve => {
    const busboy = new Busboy({ headers: req.headers });
    const tmpdir = os.tmpdir();

    // This object will accumulate all the fields, keyed by their name
    const fields = {};

    // This object will accumulate all the uploaded files, keyed by their name.
    const files: Record<string, File> = {};

    // This code will process each non-file field in the form.
    busboy.on('field', (fieldName, val) => {
      // TODO(developer): Process submitted field values here
      fields[fieldName] = val;
    });

    const fileWrites: Array<Promise<any>> = [];

    // This code will process each file uploaded.
    busboy.on('file', (fieldName, file, filename, encoding, mime) => {
      // Note: os.tmpdir() points to an in-memory file system on GCF
      // Thus, any files in it must fit in the instance's memory.
      const filePath = path.join(tmpdir, filename);
      files[fieldName] = {
        path: filePath,
        type: mime,
        encoding,
        name: filename,
        file,
      };

      const writeStream = fs.createWriteStream(filePath);
      file.pipe(writeStream);

      // File was processed by Busboy; wait for it to be written to disk.
      const promise = new Promise((resolve, reject) => {
        file.on('end', () => {
          writeStream.end();
        });
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
      fileWrites.push(promise);
    });

    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on('finish', async () => {
      if (fileWrites && Object.keys(files).length) {
        await Promise.all(fileWrites);
      }
      masterResolve({ files, fields });
    });

    busboy.end(req.rawBody);
  });
};

export const cleanFiles = (files: Record<string, File>): void => {
  Object.values(files).forEach((file: File) => {
    try {
      fs.unlinkSync(file.path);
    } catch (error) {
      // catching errors when file doesn't exists
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  });
};
