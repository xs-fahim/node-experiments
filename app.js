// import {add} from "./math"
// import {hello} from "./react"
(async () => {
    const { add } = await import("./math")
    const { hello } = await import("./react")
    add(5,6)
    hello()
})()