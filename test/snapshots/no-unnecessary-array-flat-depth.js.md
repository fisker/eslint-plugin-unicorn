# Snapshot report for `test/no-unnecessary-array-flat-depth.js`

The actual snapshot is saved in `no-unnecessary-array-flat-depth.js.snap`.

Generated by [AVA](https://avajs.dev).

## invalid(1): foo.flat(1)

> Input

    `␊
      1 | foo.flat(1)␊
    `

> Output

    `␊
      1 | foo.flat()␊
    `

> Error 1/1

    `␊
    > 1 | foo.flat(1)␊
        |          ^ Passing \`1\` as the \`depth\` argument is unnecessary.␊
    `

## invalid(2): foo.flat(1.0)

> Input

    `␊
      1 | foo.flat(1.0)␊
    `

> Output

    `␊
      1 | foo.flat()␊
    `

> Error 1/1

    `␊
    > 1 | foo.flat(1.0)␊
        |          ^^^ Passing \`1\` as the \`depth\` argument is unnecessary.␊
    `

## invalid(3): foo.flat(0b01)

> Input

    `␊
      1 | foo.flat(0b01)␊
    `

> Output

    `␊
      1 | foo.flat()␊
    `

> Error 1/1

    `␊
    > 1 | foo.flat(0b01)␊
        |          ^^^^ Passing \`1\` as the \`depth\` argument is unnecessary.␊
    `

## invalid(4): foo?.flat(1)

> Input

    `␊
      1 | foo?.flat(1)␊
    `

> Output

    `␊
      1 | foo?.flat()␊
    `

> Error 1/1

    `␊
    > 1 | foo?.flat(1)␊
        |           ^ Passing \`1\` as the \`depth\` argument is unnecessary.␊
    `
