To get running:

* Install packages: `npm install`
* Watch&compile: `npm run dev`
* Test: `npm run test`
* Run: `node dist`

API endpoints:

* Hello: `curl -v localhost:3000`
* File upload: `curl -v -F file=@<file> localhost:3000/upload`
* Files listing: `curl -v localhost:3000/assets/list`
