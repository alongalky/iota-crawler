const asyncLoop = (step, condition) =>
  step().then(() => condition() ? asyncLoop(step, condition) : Promise.resolve())

const bfs = ({ getNext }) => ({ start, f = console.log, max = 10 }) => {
  const queue = [start]
  const visited = { [start]: true }

  const addNext = hash =>
    getNext(hash)
      .then(next => {
        for (const tx of next) {
          if (!visited[tx]) {
            queue.push(tx)
            visited[tx] = true
          }
        }
      })

  const scan = () => {
    const current = queue.shift()
    f(current)
    return addNext(current)
  }

  return asyncLoop(scan, () => queue.length > 0 && Object.keys(visited).length < max)
}

module.exports = ({ getNext }) => ({
  bfs: bfs({ getNext })
})
