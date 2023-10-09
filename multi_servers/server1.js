import express from 'express'

const app = express()

app.get('/', (req, res) =>
  res.send(`server1 ${process.pid} say Hi!!`)
)

// heavy task ~5000ms
// http://localhost:3000/fib?n=42
// don't block other tasks
// because the task execute on another server
app.get('/fib', async (req, res) => {
  const { n } = req.query
  const server2Origin = `http://localhost:3001`
  const url = `${server2Origin}/fib?n=${n}`

  const startTime = Date.now()
  const response = await fetch(url)
  const { result, pid } = await response.json()
  const endTime = Date.now()

  const time = endTime - startTime
  res.send(
    `server2 ${pid} says:
    <br>
    fibonacci(${n}) = ${result} : ${time}ms`
  )
})

app.listen(3000, () =>
  console.log(`server1 ${process.pid} listen on port 3000`)
)
