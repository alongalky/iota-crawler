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

module.exports = iota => ({
  getApprovees: getApprovees({ iota })
})
