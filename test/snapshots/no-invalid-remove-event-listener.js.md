# Snapshot report for `test/no-invalid-remove-event-listener.js`

The actual snapshot is saved in `no-invalid-remove-event-listener.js.snap`.

Generated by [AVA](https://avajs.dev).

## invalid(1): window.removeEventListener("scroll", handler.bind(abc))

> Input

    `␊
      1 | window.removeEventListener("scroll", handler.bind(abc))␊
    `

> Error 1/1

    `␊
    > 1 | window.removeEventListener("scroll", handler.bind(abc))␊
        |                                              ^^^^ The listener argument should be a function reference.␊
    `

## invalid(2): window.removeEventListener("scroll", this.handler.bind(abc))

> Input

    `␊
      1 | window.removeEventListener("scroll", this.handler.bind(abc))␊
    `

> Error 1/1

    `␊
    > 1 | window.removeEventListener("scroll", this.handler.bind(abc))␊
        |                                                   ^^^^ The listener argument should be a function reference.␊
    `

## invalid(3): window.removeEventListener("click", () => {})

> Input

    `␊
      1 | window.removeEventListener("click", () => {})␊
    `

> Error 1/1

    `␊
    > 1 | window.removeEventListener("click", () => {})␊
        |                                        ^^ The listener argument should be a function reference.␊
    `

## invalid(4): window.removeEventListener("keydown", function () {})

> Input

    `␊
      1 | window.removeEventListener("keydown", function () {})␊
    `

> Error 1/1

    `␊
    > 1 | window.removeEventListener("keydown", function () {})␊
        |                                       ^^^^^^^^^ The listener argument should be a function reference.␊
    `

## invalid(5): el.removeEventListener("click", (e) => { e.preventDefault(); })

> Input

    `␊
      1 | el.removeEventListener("click", (e) => { e.preventDefault(); })␊
    `

> Error 1/1

    `␊
    > 1 | el.removeEventListener("click", (e) => { e.preventDefault(); })␊
        |                                     ^^ The listener argument should be a function reference.␊
    `

## invalid(6): el.removeEventListener("mouseover", fn.bind(abc))

> Input

    `␊
      1 | el.removeEventListener("mouseover", fn.bind(abc))␊
    `

> Error 1/1

    `␊
    > 1 | el.removeEventListener("mouseover", fn.bind(abc))␊
        |                                        ^^^^ The listener argument should be a function reference.␊
    `

## invalid(7): el.removeEventListener("mouseout", function (e) {})

> Input

    `␊
      1 | el.removeEventListener("mouseout", function (e) {})␊
    `

> Error 1/1

    `␊
    > 1 | el.removeEventListener("mouseout", function (e) {})␊
        |                                    ^^^^^^^^^ The listener argument should be a function reference.␊
    `

## invalid(8): el.removeEventListener("mouseout", function (e) {}, true)

> Input

    `␊
      1 | el.removeEventListener("mouseout", function (e) {}, true)␊
    `

> Error 1/1

    `␊
    > 1 | el.removeEventListener("mouseout", function (e) {}, true)␊
        |                                    ^^^^^^^^^ The listener argument should be a function reference.␊
    `

## invalid(9): el.removeEventListener("click", function (e) {}, ...moreArguments)

> Input

    `␊
      1 | el.removeEventListener("click", function (e) {}, ...moreArguments)␊
    `

> Error 1/1

    `␊
    > 1 | el.removeEventListener("click", function (e) {}, ...moreArguments)␊
        |                                 ^^^^^^^^^ The listener argument should be a function reference.␊
    `

## invalid(10): el.removeEventListener(() => {}, () => {}, () => {})

> Input

    `␊
      1 | el.removeEventListener(() => {}, () => {}, () => {})␊
    `

> Error 1/1

    `␊
    > 1 | el.removeEventListener(() => {}, () => {}, () => {})␊
        |                                     ^^ The listener argument should be a function reference.␊
    `
