import { type LibraryOptions, build } from 'vite'
import { promisify } from 'node:util'
import zlib from 'node:zlib'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'

const gzip = promisify(zlib.gzip)

interface FileInfo {
  name: string
  size: string | number
  gzip: string | number
}

function disableLogs(){
  const log = console.log
  const warn = console.warn
  console.log = function(){}
  console.warn = function(){}

  return ()=>{
    console.log = log
    console.warn = warn
  }
}

export async function run(process: NodeJS.Process){
  function hasProp(prop: string){
    return process.argv.includes(prop)
  }

  let lib: LibraryOptions | undefined = undefined
  let plugins: ReturnType<(typeof react | typeof vue)>[] = []

  if(hasProp('--lib')){
    const pkgJSONPath = resolve(process.cwd(), 'package.json')
    const pkgJSON = JSON.parse(await readFile(pkgJSONPath, 'utf8'))

    lib = {
      entry: pkgJSON.main,
      formats: ['es']
    }
  }
  
  if(hasProp('--react')){
    plugins.push(react())
  }

  if(hasProp('--vue')){
    plugins.push(vue())
  }

  const external = hasProp('--externals') ? 
  process.argv.slice(process.argv.indexOf('--externals') + 1) : undefined

  const filesInfo: FileInfo[] = []

  type Return = Awaited<ReturnType<typeof build>>

  const enableLogs = disableLogs()
  const res: Omit<Return, 'RollupWatcher'> = await build({
    plugins: plugins.length ? plugins : undefined,
    build: {
      minify: true,
      outDir: './dist',
      lib,
      rollupOptions: {
        external
      },
    },
  })
  enableLogs()

  const { output } = Array.isArray(res) ? res[0] : res
  
  for (const chunkOrAsset of output) {
    const source = chunkOrAsset.type === 'chunk' ? 'code' : 'source'
    const res = await gzip(Buffer.from(chunkOrAsset[source]))

    filesInfo.push({
      name: chunkOrAsset.fileName,
      size: Buffer.byteLength(chunkOrAsset[source]) / 1000,
      gzip: res.length / 1000
    })
  }

  return filesInfo
}