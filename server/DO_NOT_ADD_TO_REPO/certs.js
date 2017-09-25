const fs = require('fs')

exports.SSLCerts = {
  key: fs.readFileSync('../../etc/letsencrypt/live/tpot.space/privkey.pem'),
  cert: fs.readFileSync('../../etc/letsencrypt/live/tpot.space/cert.pem'),
  ca: fs.readFileSync('../../etc/letsencrypt/live/tpot.space/chain.pem')
};