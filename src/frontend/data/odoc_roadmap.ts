export const roadMap = [
    {
        is_done: true,
        title: "Payment contract",
        content: "Transfer USDT between the Odoc users. Off-chain (they are off the Eth chain but they happen on the ICP canister) usdt transaction." +
            "In the release column by default, they are false but when I click it, I should see a popup that asks me for confirmation, and then I can click conform"
    },
    {
        is_done: true,
        title: "Shares contract",
        content: "When the user transfer to an accumulative contract part of the payment will go to one person and the other part will go to the other person\n" +
            "The creator of the accumulative contract can’t update the contract after it gets approved by any of the parties.\n" +
            "The creator of the accumulative contract/or any one of the parties can make changes but these changes will not be applied till the other party accept/approved them\n" +
            "Users will be notified when others release them a payment in the payment contract (note accumulative contract will not have transaction notification)\n"
    },
    {
        is_done: true,
        title: "Custom contract",
        content: "Custom contract where people can have a formula that automatically executes a transaction\n" +
            "From the left sidebar, As the user clicks on create button, they can select the option custom contract\n" +
            "As they select a custom contract they can enter the name and then hit Enter to create a new contract.\n" +
            "In the custom contract, people can write a formula that looks like this if ( now() == “2022-08-03” ) { transfer_USDT({from @ali, to:@john}}\n"
    },
    {
        is_done: true,
        title: "Notifications",
        content: "Users should be notified about their friend requests (WebSockets)\n",
    },
    {
        is_done: false,
        title: "USDC wallet",
        content: "User can deposit USDC and withdraw to external wallets"
    },
    {
        is_done: false,
        title: "USDT wallet",
        content: "User can deposit USDT and withdraw to external wallets"
    },
    {
        is_done: false,
        title: "ICP wallet",
        content: "User can deposit USDT and withdraw to external wallets"
    },
    {
        is_done: false,
        title: "Group chats",
        content: "You can create a group chat and add people to it, as you create group-chat you will automatically get a channel where only admins can post in it",
    },
    {
        is_done: false,
        title: "Group permissions",
        content: "In the tables and documents where you set who can view and who can edite you can set a group in addition to the options EveryOneCanView, EveryOneCanEdite, UserCanView, UserCanEdite you can have GroupCanView, GrouCanEdite. For exampl,e PerusesCanView, DoctorsCanEdite if you are managing hospital",
    },
    {
        is_done: false,
        title: "Workspaces",
        content: "If you are working with different contentpanes, you can categorize your files and chat groups into different spaces.",
        //     not just files and chats but also groups names should not be accessible from different workspaces
    },
    {
        is_done: false,
        title: "Live collaboration on editor",
        content: "as user edite the text others should see the updates live"
    },
    {
        is_done: false,
        title: "Table views",
        content: "You can view your data as chart, salary, todo list, or timeline"
    },
    {
        is_done: false,
        title: "Custom views",
        content: "You can customize your video with simple css editor."
    },
    // {
    //     is_done: false,
    //     title: "Plugins",
    //     content: "You can install, 3 types of plugins\n" +
    //         "1. Components plugins\n" +
    //         "2. Formula plugins\n" +
    //         "3. View plugins\n" + "For example you can install google translator formula and use it in the table. Or pi char plugins for the views or a grammar correction plugin for the text editor. etc..."
    // },
    {
        is_done: false,
        title: "Rich editor",
        content: "In the text editor you can change text font, color, format, background, and lights it" +
            ""
    },
];