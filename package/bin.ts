#!/usr/bin/env node

import { run } from "./index.js"

const res = await run(process)

console.log(JSON.stringify(res))