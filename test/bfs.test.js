const mockGetNext = jest.fn()
let { bfs } = require('../src/bfs.js')({ getNext: mockGetNext })

afterEach(() => {
  mockGetNext.mockClear()
})

test('happy flow for single tx', done => {
  const hash = 'abc'
  mockGetNext.mockReturnValueOnce(Promise.resolve([]))
  const f = jest.fn()

  bfs({ start: hash, max: 50, f })
    .then(() => {
      expect(mockGetNext.mock.calls.length).toBe(1)
      expect(f.mock.calls.length).toBe(1)
      done()
    })
})

test('halts for loop', done => {
  const hashes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  mockGetNext.mockImplementation(idx => Promise.resolve([(idx + 1) % hashes.length]))
  const f = jest.fn()

  bfs({ start: hashes[0], max: 50, f })
    .then(() => {
      expect(mockGetNext.mock.calls.length).toBe(hashes.length)
      expect(f.mock.calls.length).toBe(hashes.length)
      done()
    })
})

test('happy flow for diamond', done => {
  mockGetNext.mockImplementation(hash =>
    Promise.resolve(hash === 'top' ? ['left', 'right']
      : hash === 'left' || hash === 'right' ? ['bottom'] : []))
  const f = jest.fn()

  bfs({ start: 'top', max: 50, f })
    .then(() => {
      // expect(mockGetApprovees.mock.calls.length).toBe(4)
      expect(f.mock.calls.length).toBe(4)
      done()
    })
})
