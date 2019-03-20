const getApprovees = ({ iota }) => hash =>
  iota.getTransactionObjects([hash])
    .then(txs => {
      if (txs.length !== 1) {
        throw new Error(`Problem fetching transaction object for hash ${hash}`)
      }
      const approvees = [
        txs[0].trunkTransaction,
        txs[0].branchTransaction
      ]
      return approvees
    })

const toZmqFormat = tx => [
  'tx',
  tx.hash,
  tx.address,
  tx.value,
  tx.obsoleteTag,
  tx.timestamp,
  tx.currentIndex,
  tx.lastIndex,
  tx.bundle,
  tx.trunkTransaction,
  tx.branchTransaction,
  'arrival_time_placeholder',
  tx.tag
].join(' ')

module.exports = iota => ({
  getApprovees: getApprovees({ iota }),
  toZmqFormat
})
