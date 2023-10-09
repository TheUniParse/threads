export const eventPromise = (obj, event) =>
  new Promise(rs => obj.on(event, rs))

export const fibonacci = n => n <= 1
  ? 1
  : fibonacci(n - 1) + fibonacci(n - 2)

export const fibonacciPromise = n =>
  new Promise(rs => rs(fibonacci(n)))

// prime is +integer can only be divided by itself and 1
// ex 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59 61 67 ...
export const isPrime = n => {
  if (n <= 1) return false

  if (n === 2) return true

  if (n % 2 === 0) return false

  for (let i = 3; i ** 2 <= n; i += 2)
    if (n % i === 0) return false

  return true
}

export const sumPrimes = (start, end) => {
  let sum = 0

  let oddStart
  if (start <= 2) {
    oddStart = 3
    if (start === 2) sum += 2
  }
  else if (start % 2 === 0) // even
    oddStart = start + 1
  else oddStart = start

  for (let i = oddStart; i <= end; i += 2)
    if (isPrime(i)) sum += i

  return sum
}
