[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
<a href="https://circleci.com/gh/badges/shields/tree/master">
<img src="https://img.shields.io/circleci/project/github/badges/shields/master" alt="build status"></a>
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- PROJECT LOGO -->
<br />
<p align="center">
  
  <h3 align="center">ReactJS Typescript Rust Boilerplate + Authentication</h3>
  <br />
  <strong>Node version: v16.14.0 </strong>
  <strong>Updated for dfx 0.14.0 and @dfinity packages: 0.14.0 </strong>

</p>

## About The Project

Boilerplate ReactJS/Typescript with authentication to a local II

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Installation

1. Install NPM packages
   ```sh
   yarn
   ```
2. Start dfx
   ```sh
   dfx start
   ```
3. Update `.env` with the II canister id eg: `Installing code for canister internet_identity, with the canister_id from internet-identity/.dfx/local/canister_ids.json -> local:  eg: rwlgt-iiaaa-aaaaa-aaaaa-cai
`

4. Deploy
   ```sh
   dfx deploy
   ```
5. Manual Deploy (replaces point 4)

```
dfx canister create --all
dfx generate
dfx build
dfx canister install --all
```

<!-- USAGE EXAMPLES -->

## Usage

Copy front-end canister id from .dfx/local/canister_ids.json and replace in the url below

Navigate to http://<frontend_canister_id>.localhost:8000/

Or navigate to http://localhost:5173 after `yarn start` command

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Get started
1. $`sudo yarn add tsc -g`
2. $`yarn install`
3. $`yarn run build`
4. `dfx start --backgroun --clean`
   1. If you already have a dfx running run $`kill -INT $(lsof -t -i :4943)` then re-run `dfx start --backgroun --clean`
5. $`dfx deploy`
