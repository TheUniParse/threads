import express from 'express'
import { fibonacci, fibonacciPromise } from '../lib.js'

const app = express()

app.get('/', (req, res) => res.send('home'))

// heavy task ~5000ms
// http://localhost:3000/fib?n=42
// block other tasks
// use only one core of cpu
app.get('/fib', (req, res) => {
  const { n } = req.query

  const startTime = Date.now()
  const result = fibonacci(+n)
  const endTime = Date.now()

  const time = endTime - startTime
  res.json(`fibonacci(${n}) = ${result} : ${time}ms`)
})

// heavy task ~5000ms
// http://localhost:3000/async_fib?n=42
// even with promiss
// it still block other tasks
// because promise executor run synchronously on curren thread
app.get('/async_fib', async (req, res) => {
  const { n } = req.query

  const startTime = Date.now()
  const result = await fibonacciPromise(+n)
  const endTime = Date.now()

  const time = endTime - startTime
  res.json(`fibonacci(${n}) = ${result} : ${time}ms`)
})

app.listen(3000, () =>
  console.log('listen on http://localhost:3000')
)