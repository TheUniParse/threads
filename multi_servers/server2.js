import express from 'express'
import { fibonacci } from '../lib.js'

const app = express()

app.get('/fib', (req, res) => {
  const { n } = req.query
  const result = fibonacci(+n)
  res.json({ result, pid: process.pid })
})

app.listen(3001, () =>
  console.log(`server2 ${process.pid} listen on port 3001`)
)
