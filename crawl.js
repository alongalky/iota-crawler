const argv = require('yargs').argv
const { composeAPI } = require('@iota/core')
const iota = composeAPI({
  provider: 'http://localhost:14265'
})
const { getApprovees } = require('./utils.js')(iota)
const { bfs } = require('./bfs.js')({ getApprovees })

bfs({ start: argv.hash, max: argv.max || 50, f: console.log })
