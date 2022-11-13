// import {hello} from "./react"

// math.js
export async function add(a, b) {
    const { hello } = await import("./react")
    hello()
    return a + b;
  }