## old version of Odoc can be found [here](https://github.com/aliscie/Odoc-old)
## to get started first download the pocketic
1. https://github.com/dfinity/pocketic/releases
2. in your .env file add
   1. `POCKET_IC_BIN=/<path to>/pocket-ic`
   2. `USER_CANISTER_WASM=/<ur dir>/odoc/target/wasm32-unknown-unknown/release/user_canister.wasm`
   4. `VITE_DFX_NETWORK='local'`
   5. `VITE_DFX_PORT=<the port from dfx deploy urls>`
   6. `VITE_IC_HOST='http://localhost:<the porst of your host canisters>`
3. read this https://crates.io/crates/pocket-ic
4. and read this https://www.npmjs.com/package/@hadronous/pic
## TO get started
  1. `dfx start --background --clean`
  2. `dfx deploy`
  3. `dfx deploy generate`
  4. `yarn start`
  5. open http://127.0.0.1:5173/
  6. You should see this page <img width="1280" alt="Screenshot 2023-06-06 at 10 36 20 AM" src="https://github.com/aliscie/Odoc/assets/58806996/301e5cc2-3be0-44b4-92ba-05a565e169e9">
<hr/>

<h1 align="center">Odoc</h1>
<h3 align="center">SAVES YOUR TIME</h3>



<img align="left" src="https://i.ibb.co/xzJXxWK/logo2.png" style="width:100%">
Odoc

This app is Notion.so clone, roam research clone and obsidian clone. The main purpose of this app is not to just clone these note-taking apps but to make an all-in-one **Open source note-taking app** with automation features.

# learn about Odoc here.
1. [documentations](https://docs.google.com/document/d/1lOJONK7QhtGGkzSGia37pD7fytTbpIoh5R8lXGuJ7Hw/edit)
2. [overview](https://lnkd.in/eUh_4JfV)
3. [Custom smart contracts](https://youtu.be/HqogGj0xKuE)
4. [privacy plan](https://lnkd.in/e6wC_-fW)
5. [the code](https://lnkd.in/eQyebWnH)
6. [project plan](https://lnkd.in/eUvpVi5P)
7. [drag and drop](https://lnkd.in/e9XDMjie)
8. [live collaboration](https://lnkd.in/ekTH46iu)


## features:
1. **Plugins** : plugins or extensions are customizations that you can add to your Odoc application. For example, you can add grammar correction plugin like grammarly, or a machine learning plugin that help you abbreviation your text.
2. **Components** : In notion you may notice that you can import a table when you hit `/` then type table then hit enter. The table called a component. In Odoc you can create your own custom components. For example, you can create flash cards. Also, you can use plugins to enhance your components. For example, you can use Google translator plugin with flash card component so everytime you add a word you will get automatic translation.
3. **Services** : The is the core goal of Odoc where you can create a Google translator plugin and create flashcard components then put them all in one workspace (page) and you can publish that page so other people can use it. In other word you don't need to create new plugin and component for every user, instead one user can create all of them and share it with others.
4. **search** : We will have 6 search functionaries.
    - search for words in file
    - search for files names
    - global search for words in any files in any directory you choose
    - regular expression search.
    - save your search results and reuse them again.

5. **spreadsheet** : similar to Microsoft Excel you will have a spreadsheet where you can store your data and implement formulas. Also, with plugins you can implement custom formulas like a Google translator. Last but not least, you can use these spreadsheets as a backend for your services. In other word the components will act as a frontend that interact with this spreadsheet.
- Features:
    -  **Columns permissions**: You can decide who can see, update each column or comment on a column
    -  **Views permission**: You can decide who can see each view. Also, the views permission called rows permission because you can add a file for a view to event specific users from sewing septic rows. And this filter can't be removed by anyone so others can only add more filters but can't touch your filter.
    - **Custom smart contract**: you can write somthing like `if (approved = true) {transfer(100$).to(columns.assigned)}` this will automatically release the payment of a ser when you approve the delivery of an item.
    
1. **Ownership** : when you create a component, or a plugin or a service you will own it as an NFT. Hence, you can make money from it. There are three ways to make money with NFTs. One by selling it. Second, by getting percentage on every sell. Third, by requiring subscriptions fees like 7$ a month without selling the plugin or the service.

2. **Privacy** : You will have the option to upload your data on the blockchain internet computer in order to share it with other people.
 
## Benefits and vision
- First of all, I believe this new system will replace Microsoft Office and apple iwork.
- Users, will have safe place to store their data on the blockchain on IC.
- Users can do whatever they can imagine with all these customizations.
- there are more feature that I will work one like Real time data, so you can share your documents and update them in real time. or like page components. So, you can have an entire page as a spreadsheet.
- Success: I believe Odoc will be successful because the market is already huge, if I just take all docs apps like events, microsoft words and notion then I put all of their features in one place, of course I will get at least few users.
- Disability: Because I am using rust and wasm everything became durable and easy, even the code editor. With `rust` I can execute any program langauge seamlessly.
- I also ran few **experiment** before building this project in order to reach to the ultimate way.
    - [experiment 1](https://github.com/aliscie/Odoc-tauri-react)
    - [other experiment](https://github.com/aliscie/Odoc2)
    - [other experiment](https://github.com/aliscie/autdox)
    - [notion clone](https://github.com/aliscie/Notion.so-clone)
    - [second notion clone](https://github.com/aliscie/notion-clone-1)
    - [Other experiment](https://github.com/AlenSci/Odoc-1)
    - [experiment 2](https://github.com/aliscie/Learning-webstack-from-cloning-notion.so) 
    - [experiment 3](https://github.com/AlenSci/Odoc1) [also see demo](https://www.youtube.com/watch?v=zXdL4B73Rkc) [and this](https://www.youtube.com/playlist?list=PLZ54FkZk9dwGrJSxLIm4-NLvHlhyQKL6T)
    - [experiment 4](https://github.com/AlenSci/Odoc) 
    - [experiment 5](https://github.com/aliscie/Odoc-rust)



## Development:
- make sure to install `zstd` `llvm`, `clang` and `openssl`, `gcc`, `rocksdb` in order for the desktop app to work (surealdb requirements).
- `brew tap homebrew/versions; brew install gcc7 --use-llvm`
- [Quick Start](https://smartcontracts.org/docs/quickstart/quickstart-intro.html)
- [SDK Developer Tools](https://smartcontracts.org/docs/developers-guide/sdk-guide.html)
- [Rust Canister Development Guide](https://smartcontracts.org/docs/rust-guide/rust-intro.html)
- [ic-cdk](https://docs.rs/ic-cdk)
- [ic-cdk-macros](https://docs.rs/ic-cdk-macros)
- [Candid Introduction](https://smartcontracts.org/docs/candid-guide/candid-intro.html)
- [JavaScript API Reference](https://erxue-5aaaa-aaaab-qaagq-cai.raw.ic0.app)


## Running the project locally
### configurations
1. check [tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites/)
    especially the following prerequisites.
    1. $`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
        - or run $`curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh`
    2. install xcode
       - to check that run $`xcode-select --install`
    3. make sure to have c++ 
### running the project
1. $`cd Desktop`
2. $`git clone https://github.com/aliscie/Odoc-tauri`
3. $`cd Odoc-tauri`
4. $`cargo tauri dev`

# Dealing with  wasm32-unknown-unknown errors
`rustup target remove wasm32-unknown-unknown`
`rustup self uninstall`
`brew uninstall rust`
`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

`cargo install --locked wasm-bindgen-cli`
`rustup target add wasm32-unknown-unknown`
`cargo clean`
`cargo update`


`rm -r rustup`
`sudo port uninstall rustup`
` history | grep cargo`

