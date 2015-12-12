# Guardian.gg HTTP Client

This repository hosts the front-end client for [Guardian.gg](https://guardian.gg). The application is primarily built 
on Angular.js, underscore.js and Bootstrap. The backend is a suite of APIs written in [Go](https://golang.org/) and 
is not open source at this time.

## Contributing
Contributions of any level are welcome. Our short term road map is available on the 
[milestones page](https://github.com/guardiangg/http-client/milestones) hosted on GitHub. We are open to ideas and 
bug reports from anybody though, [open an issue](https://github.com/guardiangg/http-client/issues?q=is:open%20is:issue) 
if you want to chat about it!

If you want to contribute, fork the repository and make all submissions in the form of pull requests.

## Coding Style
Contributions are expected to remain under a consistent coding style.

- 4 space indentation
- No hard tabs
- Any static English string must use the `translate` directive to provide localization support. We may choose to delay 
a feature until we can get full localization for all strings in it.
- Angular dependencies must be explicitly provided in an array to allow proper minification, the following example 
illustrates the style we use in any angular component.

```js
var app = angular.module('app');

app.controller('foobar', [
    '$scope',
    
    function($scope) {
    }
]);
```

- Re-usable components like an API service should be put in the `app/shared` directory. All other highly 
context-specific code like a profile controller should be put in the `app/component` directory.

## Setting up development environment
```sh
git clone git@github.com:guardiangg/http-client
cd http-client
npm install
bower install
```
Copy the file `src/app/config.json.dist` to `src/app/config.json`
```sh
gulp build && gulp watch
```
Any changes you make to files in the `src` directory be automatically built and reflected in the `build` directory. 
You should point your browser/server to the `build` directory. If new files are added to or removed from the 
repository, the gulp build and watch commands will need to be run again.
