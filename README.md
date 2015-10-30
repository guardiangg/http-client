# Guardian.gg HTTP Client

This repository hosts the front-end client for [Guardian.gg](https://guardian.gg). The application is primarily built 
on Angular.js, underscore.js and Bootstrap. The backend is a suite of APIs written in [Go](https://golang.org/) and 
is not open source at this time.

## Contributing
Contributions of any level are welcome. Our short term road map is available on the 
[milestones page](https://github.com/guardiangg/http-client/milestones) hosted on GitHub. We are open to ideas and 
bug reports from anybody though, [open an issue](https://github.com/guardiangg/http-client/issues?q=is:open%20is:issue) 
if you want to chat about it!

If you want to contribute, fork the repository and make all submissions in the form of pull requests. New features 
should be submitted to the `develop` branch. Bug fixes on production code can be submitted to `master`

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
