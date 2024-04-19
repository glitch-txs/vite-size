# Vite Size (WIP)

Check the bundle size of the output build of any package with Vite.

## Install
```sh
pnpm i vite-size
```

## Run

In your package.json add the following script

```sh
"size": "npx tsc && vite-size"
```

You can also add external packages so they are not bundled

_`--externals` should always be the **last** flag in the script._

```sh
"size": "npx tsc && vite-size --externals <package-name> <another-package-name>"
```

Run the script

```sh
pnpm run size
```

## Typescript Only

Use `--lib` if you're not using an `index.html` file. 

```sh
"size": "npx tsc && vite-size --lib --externals <package-name> <another-package-name>"
```