# Developers recommended practices
When you participate in autodox please follow these instructions carefully
1. Pluginzation: Keep each part of your code in a separate place and don't disturbed the main functionalities
   1. Examples
      1. Put styles and dark mode logic only in css files and don't use tsx components
      2. Notice I put the text editor in a separated package and separated repository
      3. If you have a code that handle tests or generating candid it is better to be operated in a different repository as well
   2. Benefits:
      1. Developers can easily focus on the central code instead of being disrupted by the secondary issues
      2. Each developer can work on specific repository
      3. Community and all develops can be easily introduced to the main code because it has smaller size and also each person can be easily introduced to any eternal repo without being distributed by other repos
      4. Unlike mono-repo the main code will have smaller size and make it easier to focus, that is way I am anti mono-repo

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
