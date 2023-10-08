import express from 'express'
import cluster from 'cluster'
import os from 'os'
import { fibonacci } from '../lib.js'

// fix on windows, (only one worker handle all requests)
// enabling "round-robin"
cluster.schedulingPolicy = cluster.SCHED_RR

if (cluster.isPrimary) primaryProcess()
else if (cluster.isWorker) workerProcess()

function primaryProcess() {
  console.log(`Primary process ${process.pid} is running`)

  // fork workers.
  const cors = os.cpus().length
  for (let i = 1; i <= cors; i++) {
    console.log(`Forking process number ${i}...`)
    cluster.fork() // creates new node js processes
  }

  cluster.on('exit', worker => {
    console.log(`worker ${worker.process.pid} died`)
    cluster.fork() // forks a new process if any process dies
  })
}

// workers can share TCP connection
function workerProcess() {
  const app = express()

  app.get('/', (req, res) =>
    res.send(`hello from server ${process.pid}`)
  )

  // heavy task ~5000ms
  // http://localhost:3000/fib?n=42
  // don't block other tasks
  // use all cpu cores
  // ⚠️ on windows by default is not "round-robin"
  //   block other tasks
  //   only one worker handle all requests (same process.pid)
  //   and the solution is enabling "round-robin"
  //     cluster.schedulingPolicy = cluster.SCHED_RR 
  app.get('/fib', (req, res) => {
    const { n } = req.query

    const startTime = Date.now()
    const result = fibonacci(+n)
    const endTime = Date.now()

    const time = endTime - startTime
    res.send(`server ${process.pid} says: \nfibonacci(${n}) = ${result} : ${time}ms`)
  })

  app.listen(3000, () =>
    console.log(`server ${process.pid} listening on port 3000`)
  )
}