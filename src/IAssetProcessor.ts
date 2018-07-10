export interface IAssetProcessor {
  supportsExtension (extension: string): boolean;
  reportErrors (filepath): string[];
}