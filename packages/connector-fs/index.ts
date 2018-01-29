import * as fs from 'fs';
import { Stats } from 'fs';
import { promisify } from 'util';

const existFile = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlinkFile = promisify(fs.unlink);

export const filesystem = async () => {
  return {
    async write(filePath: string, data: any, options: string = 'utf8'): Promise<any> {
      await writeFile(filePath, data, options);
      return data;
    },

    async read(filePath: string, options: string = 'utf8'): Promise<string> {
      return readFile(filePath, options);
    },

    async delete(filePath: string): Promise<boolean> {
      await unlinkFile(filePath);
      return true;
    },

    async check(filePath: string): Promise<Stats> {
      return existFile(filePath);
    }
  };
};
