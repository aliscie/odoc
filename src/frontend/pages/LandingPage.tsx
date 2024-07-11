import React from 'react';
import './styles/LandingPage.css';
import Card from "../components/genral/card";
import CustomizedAccordions from "../components/genral/acordoin";
import {Divider} from "@mui/material";
import FullWidthTabs from "./welcome";

const data = [
    {
        title: "Smart contracts",
        content: "At ODOC, we are driven to address the struggles faced by freelancers worldwide, including those in war-affected regions like Iraq or even Russia nowadays, and individuals burdened by high commissions and taxes in countries like India. Our mission is to decentralize freelance contracts, making them transparent and liberating through the power of smart contracts. We envision a platform that provides unparalleled freedom and trust for freelancers."
    },
    {
        title: "Profile trust score",
        content: "We are developing user profiles with comprehensive reliability histories and public ratings to promote transparency. This fosters a highly transparent environment, empowering both freelancers and clients by encouraging trust and accountability throughout the process. For example, if a user canceled a contract, it will appear in their profile."
    },
    {
        title: "Task managements",
        content: "In addition to empowering freelancers, we are creating a note-taking and task-management app, prioritizing privacy by encrypting user data. This ensures that organizations like hospitals and research teams can confidently use our app. Initially, we offer simple functionalities like spreadsheets, text styling, and grammar correction. Users can choose to upload data to the blockchain for added security, with local storage capabilities. Our permission system based on internet identity enhances privacy and data access control."
    },
    // {
    //     title: "Formula and tables",
    //     content: "Similar to Microsoft Excel, you will have a spreadsheet where you can store your data and implement formulas. Also, with plugins, you can implement custom formulas like a Google translator. Last but not least, you can use these spreadsheets as a backend for your services. In other words, the components will act as a frontend that interacts with this spreadsheet."
    // },
    {
        title: "Formula and tables",
        content: "Similar to Microsoft Excel, you will have a spreadsheet where you can store your data and implement formulas. Also, you can implement custom formulas like a Google translator. Last but not least, you can use these spreadsheets as a backend for your services. In other words, the components will act as a frontend that interacts with this spreadsheet."
    },
    // {
    //     title: "Plugins",
    //     content: "Plugins or extensions are customizations that you can add to your ODOC application. For example, you can add a grammar correction plugin like Grammarly or a machine learning plugin that helps you abbreviate your text."
    // },
    {
        title: "Views",
        content: "You can view a table in the form of a chart or gallery, or in a custom view that allows you to see your data in different ways that are pleasant to the eye, more expressive, cleaner, or for input like quatrains and polls."
    },
    {
        title: "social platform",
        content: "Users can post about jobs they created or seek jobs."
    },
    {
        title: "Desktop version",
        content: "If you need only the web2 features like taking notes you can use the desktop version without transactions features."
    },
    {
        title: "Minorities protection",
        content: "Instead of the SNS-voting system we will use SNS-migration system where users can migrate or stay on the old canister. If the old canisters has no active users, it will be automatically deleted."
    },

];
let roadMap = [
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
]

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            <header>
                <h1>Welcome to ODOC</h1>
                <p>Empowering freelancers, employers and employees with transparent and liberating Smart-Contracts on
                    the Blockchain. Odoc is
                    all in one where you can manage your teams, tasks, notes, documentation, agreements, contracts and
                    transactions. </p>
            </header>
            {/*<TabsPanel*/}
            {/*    items={[{label: "I'm hiring", value: <h1>You can create smart contract please watch the video</h1>}, {label: "I'm freelancer", value: <h1>You can receive payments</h1>}]}*/}
            {/*/>*/}
            <FullWidthTabs/>
            <Divider/>
            <h3>List of features we are offering.</h3>
            <section className="features">
                {data.map((card, index) => (
                    <Card key={index} title={card.title}>
                        {card.content}
                    </Card>
                ))}

            </section>
            <Divider/>
            <section className="roadmap">
                <h2>Roadmap</h2>
                <ul>
                    <CustomizedAccordions data={roadMap}/>
                </ul>
            </section>
            <footer>
                <p>© 2023 ODOC. All rights reserved</p>
                <p>Founded by Ali Al-Karaawi</p>
            </footer>
        </div>
    );
};

export default LandingPage;
