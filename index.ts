import { build, type InlineConfig } from 'vite'
import { promisify } from 'node:util'
import zlib from 'node:zlib'

const gzip = promisify(zlib.gzip)

interface FileInfo {
  name: string
  size: string | number
  gzip: string | number
}

export async function buildVite(inlineConfig?:InlineConfig){
  
  const filesInfo: FileInfo[] = []

  type Return = Awaited<ReturnType<typeof build>>

  const res: Omit<Return, 'RollupWatcher'> = await build({
    root: './dist',
    build: {
      minify: true,
      outDir: './distVite',
      lib: {
        entry: 'test.js',
        formats: ['es']
      }
    },
    ...inlineConfig
  })


  const { output } = (Array.isArray(res) ? res[0] : res)
  
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

const filesInfo = await buildVite()

console.log(filesInfo)