import express from 'express'
import { fibonacci } from '../lib.js'

const app = express()

app.get('/fib', (req, res) => {
  const { n } = req.query
  const result = fibonacci(+n)
  res.json(result)
})

app.listen(3001, () =>
  console.log('listen on http://localhost:3001')
)