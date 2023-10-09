import { fibonacci } from '../lib.js'

// this process_child listen to parent process messages
process.on('message', reqMessage => {
  const { n } = reqMessage
  const result = fibonacci(+n)

  // send response message to the parent process
  const resMessage = { result, pid: process.pid }
  process.send?.(resMessage)

  process.exit() // prevent orphaned processes
})
