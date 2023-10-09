import os from 'os'
import path from 'path'
import { Worker } from 'worker_threads'

const workerPath = path.join(
  process.cwd(),
  'worker_threads',
  'worker.js'
)

export async function sumPrimes_multiTheread(start, end) {
  const sums = await divideWorkPromise(start, end)
  const sum = sums.reduce((sums, { sum }) => sums + sum, 0)
  return sum
}

function divideWorkPromise(start, end) {
  const cores = os.cpus().length
  const items = end - start + 1
  const coreItems = Math.floor(items / cores)
  // const remainderItems = items % cores

  const workersPromises = new Array(cores)
    .fill(null)
    .map((_, i) => {
      const itemsDone = i * coreItems
      const workerStart = start + itemsDone

      const isLastWorker = i + 1 === cores
      const workerEnd = isLastWorker
        ? end // includes remainderItems
        : workerStart + coreItems - 1

      const length = workerEnd - workerStart + 1
      console.log(
        `core${i + 1
        }: start ${workerStart}, end ${workerEnd}, length ${length}`
      )

      const workerData = { start: workerStart, end: workerEnd }
      return workerPromise(workerData)
    })

  return Promise.all(workersPromises)
  /** start=50 end=100 cores=4
   *  items=51 coreItemes=12 remainderItems=3
   *            start   |      end      |   range   | length
   * core1: 50 + 0 * 12 | (50) + 12 - 1 | [50, 61]  |   12
   * core2: 50 + 1 * 12 | (62) + 12 - 1 | [62, 73]  |   12
   * core3: 50 + 2 * 12 | (74) + 12 - 1 | [74, 85]  |   12
   * core4: 50 + 3 * 12 | 101           | [86, 100] |   15
   */
}

function workerPromise(workerData) {
  return new Promise((rs, rj) => {
    const worker = new Worker(workerPath, { workerData })
    worker.on('message', rs)
    worker.on('error', rj)
    worker.on('exit', code => {
      if (code === 0) return
      rj(new Error(`Worker stopped with exit code ${code}`))
    })
  })
}
