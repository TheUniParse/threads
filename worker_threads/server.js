import express from 'express'
import { sumPrimes } from '../lib.js'
import { sumPrimes_multiTheread } from './configWorkes.js'

const app = express()

app.get('/', (req, res) => res.send('home'))

// heavy task ~ 6000ms
// http://localhost:3000/single_thread/sumPrimes?start=0&end=1e7
// block other tasks
// ⚠️ use only one core of cpu
app.get('/single_thread/sumPrimes', (req, res) => {
  const { start, end } = req.query

  const startTime = Date.now()
  const result = sumPrimes(+start, +end)
  const endTime = Date.now()

  const time = endTime - startTime
  res.json(`sumPrimes(${+start}, ${+end}) = ${result} : ${time}ms`)
})

// heavy task ~ 3000ms
// http://localhost:3000/multi_thread/sumPrimes?start=0&end=1e7
// don't block other tasks
// 💡 use all cpu cores
// for each cpu logical processor, create workers
// i5-2450M cpu: 2 physical_cores : 4 logical_processors
// 💡 the speed improved with factore of x2 (x physical_cores)
app.get('/multi_thread/sumPrimes', async (req, res) => {
  const { start, end } = req.query

  const startTime = Date.now()
  const result = await sumPrimes_multiTheread(+start, +end)
  const endTime = Date.now()

  const time = endTime - startTime
  res.json(`sumPrimes(${+start}, ${+end}) = ${result} : ${time}ms`)
})
app.listen(3000, () =>
  console.log('listen on http://localhost:3000')
)
