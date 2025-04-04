# Snapshot report for `test/prefer-import-meta-properties.js`

The actual snapshot is saved in `prefer-import-meta-properties.js.snap`.

Generated by [AVA](https://avajs.dev).

## invalid(1): import path from "path"; import { fileURLToPath } from "url"; const dirname = path.dirname(fileURLToPath(import.meta.url));

> Input

    `␊
      1 | import path from "path";␊
      2 | import { fileURLToPath } from "url";␊
      3 | const dirname = path.dirname(fileURLToPath(import.meta.url));␊
    `

> Output

    `␊
      1 | import path from "path";␊
      2 | import { fileURLToPath } from "url";␊
      3 | const dirname = import.meta.dirname;␊
    `

> Error 1/1

    `␊
      1 | import path from "path";␊
      2 | import { fileURLToPath } from "url";␊
    > 3 | const dirname = path.dirname(fileURLToPath(import.meta.url));␊
        |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct dirname.␊
    `

## invalid(2): import path from "path"; const dirname = path.dirname(import.meta.filename);

> Input

    `␊
      1 | import path from "path";␊
      2 | const dirname = path.dirname(import.meta.filename);␊
    `

> Output

    `␊
      1 | import path from "path";␊
      2 | const dirname = import.meta.dirname;␊
    `

> Error 1/1

    `␊
      1 | import path from "path";␊
    > 2 | const dirname = path.dirname(import.meta.filename);␊
        |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct dirname.␊
    `

## invalid(3): import { fileURLToPath } from "url"; const dirname = fileURLToPath(new URL(".", import.meta.url));

> Input

    `␊
      1 | import { fileURLToPath } from "url";␊
      2 | const dirname = fileURLToPath(new URL(".", import.meta.url));␊
    `

> Output

    `␊
      1 | import { fileURLToPath } from "url";␊
      2 | const dirname = import.meta.dirname;␊
    `

> Error 1/1

    `␊
      1 | import { fileURLToPath } from "url";␊
    > 2 | const dirname = fileURLToPath(new URL(".", import.meta.url));␊
        |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct dirname.␊
    `

## invalid(4): import { fileURLToPath } from "url"; const dirname = fileURLToPath(new URL("./", import.meta.url));

> Input

    `␊
      1 | import { fileURLToPath } from "url";␊
      2 | const dirname = fileURLToPath(new URL("./", import.meta.url));␊
    `

> Output

    `␊
      1 | import { fileURLToPath } from "url";␊
      2 | const dirname = import.meta.dirname;␊
    `

> Error 1/1

    `␊
      1 | import { fileURLToPath } from "url";␊
    > 2 | const dirname = fileURLToPath(new URL("./", import.meta.url));␊
        |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct dirname.␊
    `

## invalid(5): import { fileURLToPath } from "url"; const filename = fileURLToPath(import.meta.url);

> Input

    `␊
      1 | import { fileURLToPath } from "url";␊
      2 | const filename = fileURLToPath(import.meta.url);␊
    `

> Output

    `␊
      1 | import { fileURLToPath } from "url";␊
      2 | const filename = import.meta.filename;␊
    `

> Error 1/1

    `␊
      1 | import { fileURLToPath } from "url";␊
    > 2 | const filename = fileURLToPath(import.meta.url);␊
        |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct filename using \`fileURLToPath()\`.␊
    `

## invalid(6): import { fileURLToPath } from "url"; const filename = fileURLToPath(new URL(import.meta.url));

> Input

    `␊
      1 | import { fileURLToPath } from "url";␊
      2 | const filename = fileURLToPath(new URL(import.meta.url));␊
    `

> Output

    `␊
      1 | import { fileURLToPath } from "url";␊
      2 | const filename = import.meta.filename;␊
    `

> Error 1/1

    `␊
      1 | import { fileURLToPath } from "url";␊
    > 2 | const filename = fileURLToPath(new URL(import.meta.url));␊
        |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct filename using \`fileURLToPath()\`.␊
    `

## invalid(7): import path from "node:path"; import { fileURLToPath } from "node:url"; const dirname = path.dirname(fileURLToPath(import.meta.url));

> Input

    `␊
      1 | import path from "node:path";␊
      2 | import { fileURLToPath } from "node:url";␊
      3 | const dirname = path.dirname(fileURLToPath(import.meta.url));␊
    `

> Output

    `␊
      1 | import path from "node:path";␊
      2 | import { fileURLToPath } from "node:url";␊
      3 | const dirname = import.meta.dirname;␊
    `

> Error 1/1

    `␊
      1 | import path from "node:path";␊
      2 | import { fileURLToPath } from "node:url";␊
    > 3 | const dirname = path.dirname(fileURLToPath(import.meta.url));␊
        |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct dirname.␊
    `

## invalid(8): import { fileURLToPath } from "node:url"; const filename = fileURLToPath(import.meta.url);

> Input

    `␊
      1 | import { fileURLToPath } from "node:url";␊
      2 | const filename = fileURLToPath(import.meta.url);␊
    `

> Output

    `␊
      1 | import { fileURLToPath } from "node:url";␊
      2 | const filename = import.meta.filename;␊
    `

> Error 1/1

    `␊
      1 | import { fileURLToPath } from "node:url";␊
    > 2 | const filename = fileURLToPath(import.meta.url);␊
        |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct filename using \`fileURLToPath()\`.␊
    `

## invalid(9): import * as path from "node:path"; import url from "node:url"; const dirname = path.dirname(url.fileURLToPath(import.meta.url));

> Input

    `␊
      1 | import * as path from "node:path";␊
      2 | import url from "node:url";␊
      3 | const dirname = path.dirname(url.fileURLToPath(import.meta.url));␊
    `

> Output

    `␊
      1 | import * as path from "node:path";␊
      2 | import url from "node:url";␊
      3 | const dirname = import.meta.dirname;␊
    `

> Error 1/1

    `␊
      1 | import * as path from "node:path";␊
      2 | import url from "node:url";␊
    > 3 | const dirname = path.dirname(url.fileURLToPath(import.meta.url));␊
        |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct dirname.␊
    `

## invalid(10): import url from "node:url"; const filename = url.fileURLToPath(import.meta.url);

> Input

    `␊
      1 | import url from "node:url";␊
      2 | const filename = url.fileURLToPath(import.meta.url);␊
    `

> Output

    `␊
      1 | import url from "node:url";␊
      2 | const filename = import.meta.filename;␊
    `

> Error 1/1

    `␊
      1 | import url from "node:url";␊
    > 2 | const filename = url.fileURLToPath(import.meta.url);␊
        |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct filename using \`fileURLToPath()\`.␊
    `

## invalid(11): import path from "node:path"; import { fileURLToPath } from "node:url"; const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);

> Input

    `␊
      1 | import path from "node:path";␊
      2 | import { fileURLToPath } from "node:url";␊
      3 | const __filename = fileURLToPath(import.meta.url);␊
      4 | const __dirname = path.dirname(__filename);␊
    `

> Output

    `␊
      1 | import path from "node:path";␊
      2 | import { fileURLToPath } from "node:url";␊
      3 | const __filename = import.meta.filename;␊
      4 | const __dirname = import.meta.dirname;␊
    `

> Error 1/2

    `␊
      1 | import path from "node:path";␊
      2 | import { fileURLToPath } from "node:url";␊
    > 3 | const __filename = fileURLToPath(import.meta.url);␊
        |                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct filename using \`fileURLToPath()\`.␊
      4 | const __dirname = path.dirname(__filename);␊
    `

> Error 2/2

    `␊
      1 | import path from "node:path";␊
      2 | import { fileURLToPath } from "node:url";␊
      3 | const __filename = fileURLToPath(import.meta.url);␊
    > 4 | const __dirname = path.dirname(__filename);␊
        |                   ^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct dirname.␊
    `

## invalid(12): import path from "node:path"; const __filename = import.meta.filename; const __dirname = path.dirname(__filename);

> Input

    `␊
      1 | import path from "node:path";␊
      2 | const __filename = import.meta.filename;␊
      3 | const __dirname = path.dirname(__filename);␊
    `

> Output

    `␊
      1 | import path from "node:path";␊
      2 | const __filename = import.meta.filename;␊
      3 | const __dirname = import.meta.dirname;␊
    `

> Error 1/1

    `␊
      1 | import path from "node:path";␊
      2 | const __filename = import.meta.filename;␊
    > 3 | const __dirname = path.dirname(__filename);␊
        |                   ^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct dirname.␊
    `

## invalid(13): const path = process.getBuiltinModule("node:path"); const { fileURLToPath } = process.getBuiltinModule("node:url"); const filename = fileURLToPath(import.meta.url); const dirname = path.dirname(filename);

> Input

    `␊
      1 | const path = process.getBuiltinModule("node:path");␊
      2 | const { fileURLToPath } = process.getBuiltinModule("node:url");␊
      3 | const filename = fileURLToPath(import.meta.url);␊
      4 | const dirname = path.dirname(filename);␊
    `

> Output

    `␊
      1 | const path = process.getBuiltinModule("node:path");␊
      2 | const { fileURLToPath } = process.getBuiltinModule("node:url");␊
      3 | const filename = import.meta.filename;␊
      4 | const dirname = import.meta.dirname;␊
    `

> Error 1/2

    `␊
      1 | const path = process.getBuiltinModule("node:path");␊
      2 | const { fileURLToPath } = process.getBuiltinModule("node:url");␊
    > 3 | const filename = fileURLToPath(import.meta.url);␊
        |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct filename using \`fileURLToPath()\`.␊
      4 | const dirname = path.dirname(filename);␊
    `

> Error 2/2

    `␊
      1 | const path = process.getBuiltinModule("node:path");␊
      2 | const { fileURLToPath } = process.getBuiltinModule("node:url");␊
      3 | const filename = fileURLToPath(import.meta.url);␊
    > 4 | const dirname = path.dirname(filename);␊
        |                 ^^^^^^^^^^^^^^^^^^^^^^ Do not construct dirname.␊
    `

## invalid(14): const { fileURLToPath: renamed } = process.getBuiltinModule("node:url"); const filename = renamed(import.meta.url);

> Input

    `␊
      1 | const { fileURLToPath: renamed } = process.getBuiltinModule("node:url");␊
      2 | const filename = renamed(import.meta.url);␊
    `

> Output

    `␊
      1 | const { fileURLToPath: renamed } = process.getBuiltinModule("node:url");␊
      2 | const filename = import.meta.filename;␊
    `

> Error 1/1

    `␊
      1 | const { fileURLToPath: renamed } = process.getBuiltinModule("node:url");␊
    > 2 | const filename = renamed(import.meta.url);␊
        |                  ^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct filename using \`fileURLToPath()\`.␊
    `

## invalid(15): import { fileURLToPath as renamed } from "node:url"; const filename = renamed(import.meta.url);

> Input

    `␊
      1 | import { fileURLToPath as renamed } from "node:url";␊
      2 | const filename = renamed(import.meta.url);␊
    `

> Output

    `␊
      1 | import { fileURLToPath as renamed } from "node:url";␊
      2 | const filename = import.meta.filename;␊
    `

> Error 1/1

    `␊
      1 | import { fileURLToPath as renamed } from "node:url";␊
    > 2 | const filename = renamed(import.meta.url);␊
        |                  ^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct filename using \`fileURLToPath()\`.␊
    `

## invalid(16): const path = process.getBuiltinModule("path"); const { fileURLToPath } = process.getBuiltinModule("url"); const filename = fileURLToPath(import.meta.url); const dirname = path.dirname(filename);

> Input

    `␊
      1 | const path = process.getBuiltinModule("path");␊
      2 | const { fileURLToPath } = process.getBuiltinModule("url");␊
      3 | const filename = fileURLToPath(import.meta.url);␊
      4 | const dirname = path.dirname(filename);␊
    `

> Output

    `␊
      1 | const path = process.getBuiltinModule("path");␊
      2 | const { fileURLToPath } = process.getBuiltinModule("url");␊
      3 | const filename = import.meta.filename;␊
      4 | const dirname = import.meta.dirname;␊
    `

> Error 1/2

    `␊
      1 | const path = process.getBuiltinModule("path");␊
      2 | const { fileURLToPath } = process.getBuiltinModule("url");␊
    > 3 | const filename = fileURLToPath(import.meta.url);␊
        |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct filename using \`fileURLToPath()\`.␊
      4 | const dirname = path.dirname(filename);␊
    `

> Error 2/2

    `␊
      1 | const path = process.getBuiltinModule("path");␊
      2 | const { fileURLToPath } = process.getBuiltinModule("url");␊
      3 | const filename = fileURLToPath(import.meta.url);␊
    > 4 | const dirname = path.dirname(filename);␊
        |                 ^^^^^^^^^^^^^^^^^^^^^^ Do not construct dirname.␊
    `

## invalid(17): const filename = process.getBuiltinModule("node:url").fileURLToPath(import.meta.url); const dirname = process.getBuiltinModule("node:path").dirname(filename);

> Input

    `␊
      1 | const filename = process.getBuiltinModule("node:url").fileURLToPath(import.meta.url);␊
      2 | const dirname = process.getBuiltinModule("node:path").dirname(filename);␊
    `

> Output

    `␊
      1 | const filename = import.meta.filename;␊
      2 | const dirname = import.meta.dirname;␊
    `

> Error 1/2

    `␊
    > 1 | const filename = process.getBuiltinModule("node:url").fileURLToPath(import.meta.url);␊
        |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct filename using \`fileURLToPath()\`.␊
      2 | const dirname = process.getBuiltinModule("node:path").dirname(filename);␊
    `

> Error 2/2

    `␊
      1 | const filename = process.getBuiltinModule("node:url").fileURLToPath(import.meta.url);␊
    > 2 | const dirname = process.getBuiltinModule("node:path").dirname(filename);␊
        |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Do not construct dirname.␊
    `
