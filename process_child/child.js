import { eventPromise, fibonacci } from "../lib.js"

// this child process listen to parent process messages
const reqMessage = await eventPromise(process, 'message')
const { n } = reqMessage
const result = fibonacci(+n)

// send response message to the parent process
const resMessage = { result }
process.send(resMessage)

process.exit() // prevent orphaned processes