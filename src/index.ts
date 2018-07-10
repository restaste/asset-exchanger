import { App } from './App'
import { FilenameProcessor } from './FilenameProcessor'

const port = process.env.PORT || 3000

const app = new App(
  'F:/DigitalKingdom/AssetExchanger/staging',
  'F:/DigitalKingdom/AssetExchanger/uploads', 
  [
    new FilenameProcessor()
  ]
  )

app.express.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is running on ${port}`)
})
