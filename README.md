# Polymer 3 example

This is an example repo that uses the latest version of polymer 3. There are several example components included.
Some other technologies used are webpack, lerna, and yarn workspaces to keep it a monorepo, but still allows you to
publish out the individual components or javascript modules to npm for consumption.

### Prerequisites

You will need to install webpack and lerna in order to use this repo.

```
>npm install webpack@3.10.0
>npm install lerna@2.9.0
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Once you've cloned it, do:
```
>cd js
>yarn
>lerna bootstrap
>cd packages/client
>npm run serve
```

It should not be running on localhost, the bundles and the build folder is at:
/js/packages/dist/**

## Authors

* **Eric Moore**


## Acknowledgments

* Lerna - https://github.com/lerna/lerna
* Webpack - https://webpack.js.org/
* And of course the awesome Polymer team - https://www.polymer-project.org/
