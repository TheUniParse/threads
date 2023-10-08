import express from 'express'
import { fork } from 'child_process'
import { eventPromise } from '../lib.js'
import path from 'path'

const childPath = path.join(
  process.cwd(),
  'process_child',
  'child.js'
)

const app = express()

app.get('/', (req, res) => res.send('home'))

// heavy task ~5000ms
// http://localhost:3000/fib?n=42
// don't block other tasks
// because the task execute on child_process
app.get("/fib", async (req, res) => {
  const { n } = req.query

  const childProcess = fork(childPath)

  // this parent-process send message to child-process by IPC
  const reqMessage = { n }
  childProcess.send(reqMessage)

  // this parent-process listen to child-process messages
  const startTime = Date.now()
  const resMessage = await eventPromise(childProcess, 'message')
  const endTime = Date.now()

  const time = endTime - startTime
  const { result } = resMessage
  res.json(`fibonacci(${n}) = ${result} : ${time}ms`)
})

app.listen(3000, () =>
  console.log('listen on http://localhost:3000')
)