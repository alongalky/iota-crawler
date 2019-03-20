const argv = require('yargs')
  .option('direction', {
    alias: 'd',
    describe: 'direction to scan',
    choices: ['future', 'past', 'both'],
    default: 'both'
  })
  .option('hash', {
    alias: 'h',
    describe: 'hash of the transaction you would like to start the crawl from',
    demandOption: true
  })
  .option('max', {
    alias: 'm',
    describe: 'maximum number of transactions to scan',
    number: true
  })
  .help()
  .version('0.0.1')
  .argv

const { composeAPI } = require('@iota/core')
const iota = composeAPI({
  provider: 'http://localhost:14265'
})
const { getApprovees, getApprovers, toZmqFormat } = require('./src/utils.js')(iota)

const getNext = hash => {
  const getters = argv.direction === 'future' ? [getApprovers]
    : argv.direction === 'past' ? [getApprovees] : [getApprovees, getApprovers]

  return Promise.all(getters.map(f => f(hash)))
    .then(responses => responses.reduce((prev, val) => prev.concat(val), []))
}

const { bfs } = require('./src/bfs.js')({ getNext })

const zmq = require('zeromq')
const sock = zmq.socket('pub')
const zmqPort = 5556
sock.bindSync(`tcp://127.0.0.1:${zmqPort}`)

const handleTx = hash =>
  iota.getTransactionObjects([hash])
    .then(txs => {
      console.log('Sending tx', txs[0].hash)
      sock.send(toZmqFormat(txs[0]))
    })

const cleanup = () => {
  sock.close()
}

bfs({ start: argv.hash, max: argv.max || 50, f: handleTx })
  .then(cleanup)
