# Api Designer

## Setup:
```bash
# (Pre-requisite) need to be logged in into the Mulesoft npm repository (using github credentials with out two factor authetication)
npm login --registry=https://npm.mulesoft.com --scope=@mulesoft

# install all other designer dependencies
npm install
```

## Developing

- Run `npm start` to start the app.
- Watches all .js and .scss files
- Includes code linting.

## Building

### Standalone

- Run `npm build`
- Output will be left in the build directory

### Component

- Run `npm component`
- Output will be left in the dist directory
- `npm component-main` for just packing the src dir and `npm component-worker` for the src-worker dir
