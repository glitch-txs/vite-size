import { build, filesSizeStore } from '@glitch-txs/vite'

filesSizeStore.sub.filesSize((file)=>{
  console.log("file",file)
})

const res = await build({
  root: './dist',
  build: {
    minify: true,
    outDir: './distVite',
    lib: {
      entry: 'test.js',
      formats: ['es']
    }
  }
})

if(Array.isArray(res) && res.length){
  console.log(res[0]?.output[0].modules)
}else{
  console.log(res)
}