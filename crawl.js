const argv = require('yargs').argv
const { composeAPI } = require('@iota/core')
const iota = composeAPI({
  provider: 'http://localhost:14265'
})
const { getApprovees, getApprovers, toZmqFormat } = require('./src/utils.js')(iota)

const getNext = hash => {
  return Promise.all([getApprovees(hash), getApprovers(hash)])
    .then(([approvees, approvers]) => {
      return [].concat(approvees, approvers)
    })
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
