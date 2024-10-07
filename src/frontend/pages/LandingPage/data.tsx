import SmartContractIcon from "@mui/icons-material/AccountBalanceWallet";
import ProfileIcon from "@mui/icons-material/Person";
import TaskIcon from "@mui/icons-material/Assignment";
import FormulaIcon from "@mui/icons-material/Functions";
import ViewIcon from "@mui/icons-material/Visibility";
import SocialIcon from "@mui/icons-material/Share";
import DesktopIcon from "@mui/icons-material/DesktopWindows";
import ProtectionIcon from "@mui/icons-material/Security";

const features = [
  {
    title: "Smart Contracts",
    content: `ODOC decentralizes freelance contracts with smart contracts, 
       providing freedom and trust for freelancers in challenging regions.`,
    icon: <SmartContractIcon className="feature-card-icon" />,
  },
  {
    title: "Profile Trust Score",
    content: `User profiles feature reliability histories and public ratings,
       fostering trust and accountability by showcasing contract details.`,
    icon: <ProfileIcon className="feature-card-icon" />,
  },
  {
    title: "Task Management",
    content: `Our encrypted task management app supports spreadsheets, text styling,
       and grammar correction, ensuring privacy and suitability for sensitive organizations.`,
    icon: <TaskIcon className="feature-card-icon" />,
  },
  {
    title: "Formulas and Tables",
    content: `Our platform supports spreadsheet formulas and can serve as a backend,
       interacting seamlessly with frontend components.`,
    icon: <FormulaIcon className="feature-card-icon" />,
  },
  {
    title: "Views",
    content: `View data in various formats like charts or galleries, offering clean,
       expressive presentations to enhance the visual experience.`,
    icon: <ViewIcon className="feature-card-icon" />,
  },
  {
    title: "Social Platform",
    content: `Post job listings or seek employment opportunities,
       fostering a vibrant job market and community interaction within our platform.`,
    icon: <SocialIcon className="feature-card-icon" />,
  },
  {
    title: "Desktop Version",
    content: `The desktop version focuses on productivity, offering web2 features
       like note-taking without transaction functionalities.`,
    icon: <DesktopIcon className="feature-card-icon" />,
  },
  {
    title: "Minorities Protection",
    content: `Our SNS-migration system allows migration or retention on old canisters,
       with inactive canisters being automatically deleted for efficiency.`,
    icon: <ProtectionIcon className="feature-card-icon" />,
  },
];

const roadMap = [
  {
    is_done: true,
    title: "Payment contract",
    content:
      "Transfer USDT between the Odoc users. Off-chain (they are off the Eth chain but they happen on the ICP canister) usdt transaction." +
      "In the release column by default, they are false but when I click it, I should see a popup that asks me for confirmation, and then I can click conform",
  },
  {
    is_done: true,
    title: "Shares contract",
    content:
      "When the user transfer to an accumulative contract part of the payment will go to one person and the other part will go to the other person\n" +
      "The creator of the accumulative contract can’t update the contract after it gets approved by any of the parties.\n" +
      "The creator of the accumulative contract/or any one of the parties can make changes but these changes will not be applied till the other party accept/approved them\n" +
      "Users will be notified when others release them a payment in the payment contract (note accumulative contract will not have transaction notification)\n",
  },
  {
    is_done: true,
    title: "Custom contract",
    content:
      "Custom contract where people can have a formula that automatically executes a transaction\n" +
      "From the left sidebar, As the user clicks on create button, they can select the option custom contract\n" +
      "As they select a custom contract they can enter the name and then hit Enter to create a new contract.\n" +
      "In the custom contract, people can write a formula that looks like this if ( now() == “2022-08-03” ) { transfer_USDT({from @ali, to:@john}}\n",
  },
  {
    is_done: true,
    title: "Notifications",
    content:
      "Users should be notified about their friend requests (WebSockets)\n",
  },
  {
    is_done: true,
    title: "Rich editor",
    content:
      "In the text editor you can change text font, color, format, background, and lights it" +
      "",
  },
  {
    is_done: true,
    title: "Group chats",
    content:
      "You can create a group chat and add people to it, as you create group-chat you will automatically get a channel where only admins can post in it",
  },
  {
    is_done: true,
    title: "Workspaces",
    content:
      "If you are working with different contentpanes, you can categorize your files and chat groups into different spaces.",
    //     not just files and chats but also groups names should not be accessible from different workspaces
  },
  {
    is_done: false,
    title: "Upload files in chat",
    content:
      "You can share your files in the chat and you can get a short link for your files to share it in other platforms",
  },
  {
    is_done: false,
    title: "USDC wallet",
    content: "User can deposit USDC and withdraw to external wallets",
  },
  {
    is_done: false,
    title: "USDT wallet",
    content: "User can deposit USDT and withdraw to external wallets",
  },
  {
    is_done: false,
    title: "ICP wallet",
    content: "User can deposit USDT and withdraw to external wallets",
  },
  {
    is_done: false,
    title: "Group permissions",
    content:
      "In the tables and documents where you set who can view and who can edite you can set a group in addition to the options EveryOneCanView, EveryOneCanEdite, UserCanView, UserCanEdite you can have GroupCanView, GrouCanEdite. For exampl,e PerusesCanView, DoctorsCanEdite if you are managing hospital",
  },
  {
    is_done: false,
    title: "Live collaboration on editor",
    content: "as user edite the text others should see the updates live",
  },
  {
    is_done: false,
    title: "Table views",
    content: "You can view your data as chart, salary, todo list, or timeline",
  },
  {
    is_done: false,
    title: "Custom views",
    content: "You can customize your video with simple css editor.",
  },
  // {
  //     is_done: false,
  //     title: "Plugins",
  //     content: "You can install, 3 types of plugins\n" +
  //         "1. Components plugins\n" +
  //         "2. Formula plugins\n" +
  //         "3. View plugins\n" + "For example you can install google translator formula and use it in the table. Or pi char plugins for the views or a grammar correction plugin for the text editor. etc..."
  // },
];

export { features, roadMap };
