# Snapshot report for `test/no-single-promise-in-promise-methods.js`

The actual snapshot is saved in `no-single-promise-in-promise-methods.js.snap`.

Generated by [AVA](https://avajs.dev).

## invalid(1): await Promise.race([(0, promise)])

> Input

    `␊
      1 | await Promise.race([(0, promise)])␊
    `

> Output

    `␊
      1 | await (0, promise)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([(0, promise)])␊
        |                    ^^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(2): async function * foo() {await Promise.race([yield promise])}

> Input

    `␊
      1 | async function * foo() {await Promise.race([yield promise])}␊
    `

> Output

    `␊
      1 | async function * foo() {await (yield promise)}␊
    `

> Error 1/1

    `␊
    > 1 | async function * foo() {await Promise.race([yield promise])}␊
        |                                            ^^^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(3): async function * foo() {await Promise.race([yield* promise])}

> Input

    `␊
      1 | async function * foo() {await Promise.race([yield* promise])}␊
    `

> Output

    `␊
      1 | async function * foo() {await (yield* promise)}␊
    `

> Error 1/1

    `␊
    > 1 | async function * foo() {await Promise.race([yield* promise])}␊
        |                                            ^^^^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(4): await Promise.race([() => promise,],)

> Input

    `␊
      1 | await Promise.race([() => promise,],)␊
    `

> Output

    `␊
      1 | await (() => promise)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([() => promise,],)␊
        |                    ^^^^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(5): await Promise.race([a ? b : c,],)

> Input

    `␊
      1 | await Promise.race([a ? b : c,],)␊
    `

> Output

    `␊
      1 | await (a ? b : c)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([a ? b : c,],)␊
        |                    ^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(6): await Promise.race([x ??= y,],)

> Input

    `␊
      1 | await Promise.race([x ??= y,],)␊
    `

> Output

    `␊
      1 | await (x ??= y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x ??= y,],)␊
        |                    ^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(7): await Promise.race([x ||= y,],)

> Input

    `␊
      1 | await Promise.race([x ||= y,],)␊
    `

> Output

    `␊
      1 | await (x ||= y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x ||= y,],)␊
        |                    ^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(8): await Promise.race([x &&= y,],)

> Input

    `␊
      1 | await Promise.race([x &&= y,],)␊
    `

> Output

    `␊
      1 | await (x &&= y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x &&= y,],)␊
        |                    ^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(9): await Promise.race([x |= y,],)

> Input

    `␊
      1 | await Promise.race([x |= y,],)␊
    `

> Output

    `␊
      1 | await (x |= y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x |= y,],)␊
        |                    ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(10): await Promise.race([x ^= y,],)

> Input

    `␊
      1 | await Promise.race([x ^= y,],)␊
    `

> Output

    `␊
      1 | await (x ^= y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x ^= y,],)␊
        |                    ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(11): await Promise.race([x ??= y,],)

> Input

    `␊
      1 | await Promise.race([x ??= y,],)␊
    `

> Output

    `␊
      1 | await (x ??= y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x ??= y,],)␊
        |                    ^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(12): await Promise.race([x ||= y,],)

> Input

    `␊
      1 | await Promise.race([x ||= y,],)␊
    `

> Output

    `␊
      1 | await (x ||= y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x ||= y,],)␊
        |                    ^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(13): await Promise.race([x &&= y,],)

> Input

    `␊
      1 | await Promise.race([x &&= y,],)␊
    `

> Output

    `␊
      1 | await (x &&= y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x &&= y,],)␊
        |                    ^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(14): await Promise.race([x | y,],)

> Input

    `␊
      1 | await Promise.race([x | y,],)␊
    `

> Output

    `␊
      1 | await (x | y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x | y,],)␊
        |                    ^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(15): await Promise.race([x ^ y,],)

> Input

    `␊
      1 | await Promise.race([x ^ y,],)␊
    `

> Output

    `␊
      1 | await (x ^ y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x ^ y,],)␊
        |                    ^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(16): await Promise.race([x & y,],)

> Input

    `␊
      1 | await Promise.race([x & y,],)␊
    `

> Output

    `␊
      1 | await (x & y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x & y,],)␊
        |                    ^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(17): await Promise.race([x !== y,],)

> Input

    `␊
      1 | await Promise.race([x !== y,],)␊
    `

> Output

    `␊
      1 | await (x !== y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x !== y,],)␊
        |                    ^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(18): await Promise.race([x == y,],)

> Input

    `␊
      1 | await Promise.race([x == y,],)␊
    `

> Output

    `␊
      1 | await (x == y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x == y,],)␊
        |                    ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(19): await Promise.race([x in y,],)

> Input

    `␊
      1 | await Promise.race([x in y,],)␊
    `

> Output

    `␊
      1 | await (x in y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x in y,],)␊
        |                    ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(20): await Promise.race([x >>> y,],)

> Input

    `␊
      1 | await Promise.race([x >>> y,],)␊
    `

> Output

    `␊
      1 | await (x >>> y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x >>> y,],)␊
        |                    ^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(21): await Promise.race([x + y,],)

> Input

    `␊
      1 | await Promise.race([x + y,],)␊
    `

> Output

    `␊
      1 | await (x + y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x + y,],)␊
        |                    ^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(22): await Promise.race([x / y,],)

> Input

    `␊
      1 | await Promise.race([x / y,],)␊
    `

> Output

    `␊
      1 | await (x / y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x / y,],)␊
        |                    ^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(23): await Promise.race([x ** y,],)

> Input

    `␊
      1 | await Promise.race([x ** y,],)␊
    `

> Output

    `␊
      1 | await (x ** y)␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([x ** y,],)␊
        |                    ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(24): await Promise.race([promise,],)

> Input

    `␊
      1 | await Promise.race([promise,],)␊
    `

> Output

    `␊
      1 | await promise␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([promise,],)␊
        |                    ^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(25): await Promise.race([getPromise(),],)

> Input

    `␊
      1 | await Promise.race([getPromise(),],)␊
    `

> Output

    `␊
      1 | await getPromise()␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([getPromise(),],)␊
        |                    ^^^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(26): await Promise.race([promises[0],],)

> Input

    `␊
      1 | await Promise.race([promises[0],],)␊
    `

> Output

    `␊
      1 | await promises[0]␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([promises[0],],)␊
        |                    ^^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(27): await Promise.race([await promise])

> Input

    `␊
      1 | await Promise.race([await promise])␊
    `

> Output

    `␊
      1 | await await promise␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([await promise])␊
        |                    ^^^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(28): await Promise.any([promise])

> Input

    `␊
      1 | await Promise.any([promise])␊
    `

> Output

    `␊
      1 | await promise␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.any([promise])␊
        |                   ^^^^^^^^^ Wrapping single-element array with \`Promise.any()\` is unnecessary.␊
    `

## invalid(29): await Promise.race([promise])

> Input

    `␊
      1 | await Promise.race([promise])␊
    `

> Output

    `␊
      1 | await promise␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([promise])␊
        |                    ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(30): await Promise.race([new Promise(() => {})])

> Input

    `␊
      1 | await Promise.race([new Promise(() => {})])␊
    `

> Output

    `␊
      1 | await new Promise(() => {})␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([new Promise(() => {})])␊
        |                    ^^^^^^^^^^^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(31): +await Promise.race([+1])

> Input

    `␊
      1 | +await Promise.race([+1])␊
    `

> Output

    `␊
      1 | +await +1␊
    `

> Error 1/1

    `␊
    > 1 | +await Promise.race([+1])␊
        |                     ^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(32): await Promise.race([(x,y)]) [0].toString()

> Input

    `␊
      1 | await Promise.race([(x,y)])␊
      2 | [0].toString()␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.race([(x,y)])␊
        |                    ^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
      2 | [0].toString()␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | await (x,y)␊
      2 | [0].toString()␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | await Promise.resolve((x,y))␊
      2 | [0].toString()␊
    `

## invalid(1): Promise.race([promise,],)

> Input

    `␊
      1 | Promise.race([promise,],)␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([promise,],)␊
        |              ^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | promise␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve(promise,)␊
    `

## invalid(2): foo Promise.race([(0, promise),],)

> Input

    `␊
      1 | foo␊
      2 | Promise.race([(0, promise),],)␊
    `

> Error 1/1

    `␊
      1 | foo␊
    > 2 | Promise.race([(0, promise),],)␊
        |              ^^^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | foo␊
      2 | ;(0, promise)␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | foo␊
      2 | Promise.resolve((0, promise),)␊
    `

## invalid(3): foo Promise.race([[array][0],],)

> Input

    `␊
      1 | foo␊
      2 | Promise.race([[array][0],],)␊
    `

> Error 1/1

    `␊
      1 | foo␊
    > 2 | Promise.race([[array][0],],)␊
        |              ^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | foo␊
      2 | ;[array][0]␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | foo␊
      2 | Promise.resolve([array][0],)␊
    `

## invalid(4): Promise.race([promise]).then()

> Input

    `␊
      1 | Promise.race([promise]).then()␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([promise]).then()␊
        |              ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | promise.then()␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve(promise).then()␊
    `

## invalid(5): Promise.race([1]).then()

> Input

    `␊
      1 | Promise.race([1]).then()␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([1]).then()␊
        |              ^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | (1).then()␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve(1).then()␊
    `

## invalid(6): Promise.race([1.]).then()

> Input

    `␊
      1 | Promise.race([1.]).then()␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([1.]).then()␊
        |              ^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | (1.).then()␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve(1.).then()␊
    `

## invalid(7): Promise.race([.1]).then()

> Input

    `␊
      1 | Promise.race([.1]).then()␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([.1]).then()␊
        |              ^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | (.1).then()␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve(.1).then()␊
    `

## invalid(8): Promise.race([(0, promise)]).then()

> Input

    `␊
      1 | Promise.race([(0, promise)]).then()␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([(0, promise)]).then()␊
        |              ^^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | (0, promise).then()␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve((0, promise)).then()␊
    `

## invalid(9): const _ = () => Promise.race([ a ?? b ,],)

> Input

    `␊
      1 | const _ = () => Promise.race([ a ?? b ,],)␊
    `

> Error 1/1

    `␊
    > 1 | const _ = () => Promise.race([ a ?? b ,],)␊
        |                              ^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | const _ = () => (a ?? b)␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | const _ = () => Promise.resolve( a ?? b ,)␊
    `

## invalid(10): Promise.race([ {a} = 1 ,],)

> Input

    `␊
      1 | Promise.race([ {a} = 1 ,],)␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([ {a} = 1 ,],)␊
        |              ^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | ({a} = 1)␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve( {a} = 1 ,)␊
    `

## invalid(11): Promise.race([ function () {} ,],)

> Input

    `␊
      1 | Promise.race([ function () {} ,],)␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([ function () {} ,],)␊
        |              ^^^^^^^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | (function () {})␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve( function () {} ,)␊
    `

## invalid(12): Promise.race([ class {} ,],)

> Input

    `␊
      1 | Promise.race([ class {} ,],)␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([ class {} ,],)␊
        |              ^^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | (class {})␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve( class {} ,)␊
    `

## invalid(13): Promise.race([ new Foo ,],).then()

> Input

    `␊
      1 | Promise.race([ new Foo ,],).then()␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([ new Foo ,],).then()␊
        |              ^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | (new Foo).then()␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve( new Foo ,).then()␊
    `

## invalid(14): Promise.race([ new Foo ,],).toString

> Input

    `␊
      1 | Promise.race([ new Foo ,],).toString␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([ new Foo ,],).toString␊
        |              ^^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | (new Foo).toString␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve( new Foo ,).toString␊
    `

## invalid(15): foo(Promise.race([promise]))

> Input

    `␊
      1 | foo(Promise.race([promise]))␊
    `

> Error 1/1

    `␊
    > 1 | foo(Promise.race([promise]))␊
        |                  ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | foo(promise)␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | foo(Promise.resolve(promise))␊
    `

## invalid(16): Promise.race([promise]).foo = 1

> Input

    `␊
      1 | Promise.race([promise]).foo = 1␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([promise]).foo = 1␊
        |              ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | promise.foo = 1␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve(promise).foo = 1␊
    `

## invalid(17): Promise.race([promise])[0] ||= 1

> Input

    `␊
      1 | Promise.race([promise])[0] ||= 1␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([promise])[0] ||= 1␊
        |              ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | promise[0] ||= 1␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve(promise)[0] ||= 1␊
    `

## invalid(18): Promise.race([undefined]).then()

> Input

    `␊
      1 | Promise.race([undefined]).then()␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([undefined]).then()␊
        |              ^^^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | undefined.then()␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve(undefined).then()␊
    `

## invalid(19): Promise.race([null]).then()

> Input

    `␊
      1 | Promise.race([null]).then()␊
    `

> Error 1/1

    `␊
    > 1 | Promise.race([null]).then()␊
        |              ^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | (null).then()␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | Promise.resolve(null).then()␊
    `

## invalid(1): Promise.all([promise])

> Input

    `␊
      1 | Promise.all([promise])␊
    `

> Error 1/1

    `␊
    > 1 | Promise.all([promise])␊
        |             ^^^^^^^^^ Wrapping single-element array with \`Promise.all()\` is unnecessary.␊
    `

## invalid(2): await Promise.all([promise])

> Input

    `␊
      1 | await Promise.all([promise])␊
    `

> Output

    `␊
      1 | await promise␊
    `

> Error 1/1

    `␊
    > 1 | await Promise.all([promise])␊
        |                   ^^^^^^^^^ Wrapping single-element array with \`Promise.all()\` is unnecessary.␊
    `

## invalid(3): const foo = () => Promise.all([promise])

> Input

    `␊
      1 | const foo = () => Promise.all([promise])␊
    `

> Error 1/1

    `␊
    > 1 | const foo = () => Promise.all([promise])␊
        |                               ^^^^^^^^^ Wrapping single-element array with \`Promise.all()\` is unnecessary.␊
    `

## invalid(4): const foo = await Promise.all([promise])

> Input

    `␊
      1 | const foo = await Promise.all([promise])␊
    `

> Error 1/1

    `␊
    > 1 | const foo = await Promise.all([promise])␊
        |                               ^^^^^^^^^ Wrapping single-element array with \`Promise.all()\` is unnecessary.␊
    `

## invalid(5): foo = await Promise.all([promise])

> Input

    `␊
      1 | foo = await Promise.all([promise])␊
    `

> Error 1/1

    `␊
    > 1 | foo = await Promise.all([promise])␊
        |                         ^^^^^^^^^ Wrapping single-element array with \`Promise.all()\` is unnecessary.␊
    `

## invalid(6): const foo = await Promise.race([promise])

> Input

    `␊
      1 | const foo = await Promise.race([promise])␊
    `

> Output

    `␊
      1 | const foo = await promise␊
    `

> Error 1/1

    `␊
    > 1 | const foo = await Promise.race([promise])␊
        |                                ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(7): const foo = () => Promise.race([promise])

> Input

    `␊
      1 | const foo = () => Promise.race([promise])␊
    `

> Error 1/1

    `␊
    > 1 | const foo = () => Promise.race([promise])␊
        |                                ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 1/2: Use the value directly.␊
      1 | const foo = () => promise␊
    ␊
    --------------------------------------------------------------------------------␊
    Suggestion 2/2: Switch to \`Promise.resolve(…)\`.␊
      1 | const foo = () => Promise.resolve(promise)␊
    `

## invalid(8): foo = await Promise.race([promise])

> Input

    `␊
      1 | foo = await Promise.race([promise])␊
    `

> Output

    `␊
      1 | foo = await promise␊
    `

> Error 1/1

    `␊
    > 1 | foo = await Promise.race([promise])␊
        |                          ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(9): const results = await Promise.any([promise])

> Input

    `␊
      1 | const results = await Promise.any([promise])␊
    `

> Output

    `␊
      1 | const results = await promise␊
    `

> Error 1/1

    `␊
    > 1 | const results = await Promise.any([promise])␊
        |                                   ^^^^^^^^^ Wrapping single-element array with \`Promise.any()\` is unnecessary.␊
    `

## invalid(10): const results = await Promise.race([promise])

> Input

    `␊
      1 | const results = await Promise.race([promise])␊
    `

> Output

    `␊
      1 | const results = await promise␊
    `

> Error 1/1

    `␊
    > 1 | const results = await Promise.race([promise])␊
        |                                    ^^^^^^^^^ Wrapping single-element array with \`Promise.race()\` is unnecessary.␊
    `

## invalid(11): const [foo] = await Promise.all([promise])

> Input

    `␊
      1 | const [foo] = await Promise.all([promise])␊
    `

> Error 1/1

    `␊
    > 1 | const [foo] = await Promise.all([promise])␊
        |                                 ^^^^^^^^^ Wrapping single-element array with \`Promise.all()\` is unnecessary.␊
    `
