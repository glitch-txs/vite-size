import { build } from 'vite'
import { promisify } from 'node:util'
import zlib from 'node:zlib'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

const gzip = promisify(zlib.gzip)

interface FileInfo {
  name: string
  size: string | number
  gzip: string | number
}

export async function run(process: NodeJS.Process){

  const pkgJSONPath = resolve(process.cwd(), 'package.json')
  const pkgJSON = JSON.parse(await readFile(pkgJSONPath, 'utf8'))
  
  const external = process.argv.slice(process.argv.indexOf('--externals') + 1)

  const filesInfo: FileInfo[] = []

  type Return = Awaited<ReturnType<typeof build>>

  const res: Omit<Return, 'RollupWatcher'> = await build({
    build: {
      minify: true,
      outDir: './dist/_vite-size',
      lib: {
        entry: pkgJSON.main,
        formats: ['es']
      },
      rollupOptions: {
        external
      },
    },
  })


  const { output } = Array.isArray(res) ? res[0] : res
  
  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === 'chunk') {
      const res = await gzip(Buffer.from(chunkOrAsset.code))

      filesInfo.push({
        name: chunkOrAsset.fileName,
        size: Buffer.byteLength(chunkOrAsset.code) / 1000,
        gzip: res.length / 1000
      })

    } else {
      console.warn("Asset is WIP", Buffer.byteLength(chunkOrAsset.source))
    }
  }

  return filesInfo
}