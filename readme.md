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

### Externals

You can also add external packages so they are not bundled

```sh
"size": "npx tsc && vite-size --externals <package-name> <another-package-name>"
```

_`--externals` should always be the **last** flag in the script._

### Frameworks

To support different frameworks with Vite plugins add the `--react` or `--vue` flag in the script.

### Run the script

```sh
pnpm run size
```

## Lib mode

Use `--lib` if you're not using an `index.html` file. 

```sh
"size": "npx tsc && vite-size --lib --externals <package-name> <another-package-name>"
```
