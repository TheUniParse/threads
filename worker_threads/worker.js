import { sumPrimes } from '../lib.js'
import { workerData, parentPort } from 'worker_threads'

const { start, end } = workerData
const sum = sumPrimes(start, end)
parentPort?.postMessage({ sum })
