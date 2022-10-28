import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import fs from 'fs-extra';
import { createCustomRunner } from 'nx-remotecache-custom';

export interface FileSystemCacheRunnerOptions {
  /** Target cache location */
  cacheLocation?: string;
  /** Path to config file which exports FileSystemCacheRunnerOptions */
  configFile?: string;
  /** When stored the file, execute chmod with given number on target file */
  chmod?: number;
}

const fileSystemCacheRunner = createCustomRunner(
  async (options: FileSystemCacheRunnerOptions) => {
    const { cacheLocation = '', chmod = -1 } = {
      ...{
        cacheLocation: process.env['NX_CACHE_FS_CACHE_LOCATION'],
        chmod:
          process.env['NX_CACHE_FS_CHMOD'] &&
          Number(process.env['NX_CACHE_FS_CHMOD']),
      },
      ...options,
      ...(options.configFile && readConfigFile(options.configFile)),
    };
    if (!cacheLocation) {
      throw new Error(
        'cacheLocation not present. Please specify cacheLocation via options.cacheLocation or provide a configFile which exports a cacheLocation.'
      );
    }
    await fs.ensureDir(cacheLocation);

    return {
      // name is used for logging purposes
      name: 'filesystem-cache',

      // fileExists checks whether a file exists on your remote storage
      fileExists: (filename: string) =>
        fs.pathExists(path.join(cacheLocation, filename)),

      // retrieveFile downloads a file from your remote storage
      retrieveFile: async (filename: string): Promise<Readable> =>
        fs.createReadStream(path.join(cacheLocation, filename)),

      // storeFile uploads a file from a buffer to your remote storage
      storeFile: async (filename: string, stream: Readable) => {
        const filePath = path.join(cacheLocation, filename);
        const target = fs.createWriteStream(filePath);
        await pipeline(stream, target);
        if (chmod > 0) await fs.chmod(filePath, chmod);
      },
    };
  }
);

function readConfigFile(configFile: string) {
  return require(path.join(process.cwd(), configFile));
}

export default fileSystemCacheRunner;
