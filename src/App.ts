import * as express from 'express'
import * as multer from 'multer'
import * as fs from 'fs'

import { IAssetProcessor } from './IAssetProcessor'

export class App {
  public express
  private router
  private uploadFolder: string
  private stagingFolder: string
  private assetProcessors: IAssetProcessor[]

  constructor (stagingFolder: string, uploadFolder: string, assetProcessors: IAssetProcessor[]) {
    this.express = express()
    this.router = express.Router()
    this.uploadFolder = uploadFolder
    this.stagingFolder = stagingFolder
    this.assetProcessors = assetProcessors

    this.mountRoutes()
    this.mountUploadRoute()

    this.express.use('/', this.router)
  }

  private mountRoutes (): void {
    this.router.get('/', (req, res) => {
      res.json({
        message: 'Hello World!'
      })
    })

    this.router.get('/assets/list', (req, res) => {
      this.listAssets((files) => {
        res.json({
          files: files
        })
      })
    })
  }

  private mountUploadRoute (): void {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.stagingFolder)
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname)
      }
    })

    const upload = multer({ storage: storage })
    this.router.post('/upload', upload.single('file'), (req, res) => {
      const stagingFilepath = this.stagingFolder + '/' + req.file.originalname
      const uploadedFilepath = this.uploadFolder + '/' + req.file.originalname

      this.log(`Upload request for file: '${req.file.originalname}'`)

      const errors: string[] = this.reportErrors(req.file)
      if (errors.length !== 0) {
        this.log(`Errors detected for file '${req.file.originalname}': '${errors}'`)
        fs.unlink(stagingFilepath, (err) => {
          if (err) throw err
        })
        res.json({
          message: 'Errors detected',
          errors: errors
        })
      } else {
        this.log('No errors detected.')
        // Copy file to final destination
        fs.createReadStream(stagingFilepath)
          .pipe(fs.createWriteStream(uploadedFilepath))

        res.json({
          message: `Received ${req.file.originalname}`
        })
      }
    })
  }

  private reportErrors (filename: string): string[] {
    let report: string[] = []
    const extension = filename.split('.')[1]

    this.assetProcessors.forEach((processor) => {
      if (processor.supportsExtension(extension)) {
        processor.reportErrors(filename).forEach((error) => {
          report.push(error)
        })
      }
    })

    return report
  }

  private listAssets (cb): void {
    fs.readdir(this.uploadFolder, (err, files) => {
      cb(files)
    })
  }

  private log (what: string): void {
    console.log(what)
  }
}
