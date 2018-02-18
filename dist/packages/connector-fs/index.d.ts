/// <reference types="node" />
import * as fs from 'fs';
export declare const filesystem: () => Promise<{
    write(filePath: string, data: any, options?: string): Promise<any>;
    read(filePath: string, options?: string): Promise<string>;
    delete(filePath: string): Promise<boolean>;
    check(filePath: string): Promise<fs.Stats>;
}>;
