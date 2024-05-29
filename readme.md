# Vite Size

Check the bundle size of the output build of any package with Vite.

## Install
```sh
pnpm i --save-dev vite-size
```

## Create a script

In your package.json add the following script

```sh
"size": "npx tsc && vite-size"
```

## Total

As default the script will show you the list of different chunks and their sizes. By using `--total` you will get the sum of all the chunks as output.

```sh
"size": "npx tsc && vite-size --total"
```

### Externals

You can also add external packages so they are not bundled

```sh
"size": "npx tsc && vite-size --total --externals <package-name> <another-package-name>"
```

_`--externals` should always be the **last** flag in the script._

### Frameworks

To support different frameworks with Vite plugins add the `--react` or `--vue` flag in the script.

```sh
"size": "npx tsc && vite-size --total --react --externals react react-dom"
```

### Lib mode

Use `--lib` if you're not using an `index.html` file. 

```sh
"size": "npx tsc && vite-size --total --lib --externals <package-name> <another-package-name>"
```

### Run the script

```sh
pnpm run size
```

## GitHub Action

Use with [GitHub Actions](https://github.com/glitch-txs/vite-size-action).
