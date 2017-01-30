# Api Designer

## Setup steps:
```bash
# (Pre-requisite) need to be logged in into the Mulesoft npm repository (using github credentials with out two factor authetication)
npm login --registry=https://npm.mulesoft.com --scope=@mulesoft

# install new console dependencies using bower
bower install

# copy an internal console file to avoid a not found (tmp step)
cp bower_components/paper-autocomplete/paper-input-autocomplete.html bower_components/paper-autocomplete/paper-autocomplete.html

# install all other designer dependencies
npm install

# start app in dev mode
npm start
```
