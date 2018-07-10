import { IAssetProcessor } from './IAssetProcessor'

export class FilenameProcessor implements IAssetProcessor {
  public supportsExtension (extension: string): boolean {
    return true
  }

  public reportErrors (filepath: string): string[] {
    return []
  }
}