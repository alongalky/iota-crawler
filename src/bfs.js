const asyncLoop = (step, condition) =>
  step().then(() => condition() ? asyncLoop(step, condition) : Promise.resolve())

const bfs = ({ getApprovees }) => ({ start, f = console.log, max = 10 }) => {
  const queue = [start]
  const visited = { [start]: true }

  const addApprovees = hash =>
    getApprovees(hash)
      .then(approvees => {
        for (const approvee of approvees) {
          if (!visited[approvee]) {
            queue.push(approvee)
            visited[approvee] = true
          }
        }
      })

  const scan = () => {
    const current = queue.shift()
    f(current)
    return addApprovees(current)
  }

  return asyncLoop(scan, () => queue.length > 0 && Object.keys(visited).length < max)
}

module.exports = ({ getApprovees }) => ({
  bfs: bfs({ getApprovees })
})
