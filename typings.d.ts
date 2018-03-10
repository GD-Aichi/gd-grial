declare module 'merge-graphql-schemas' {
  export function fileLoader(folderPath: string, options: any): string[];
  export function mergeTypes(types: string[], options: any): string;
  export function mergeResolvers(types: string[], options: any): string;
}
