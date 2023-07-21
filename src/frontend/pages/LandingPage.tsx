import React from 'react';
import './styles/LandingPage.css';
import Card from "../components/genral/card";
import CustomizedAccordions from "../components/genral/acordoin";
import {Divider} from "@mui/material";

const data = [
    {
        title: "freelance contracts",
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
    {
        title: "Formula and tables",
        content: "Similar to Microsoft Excel, you will have a spreadsheet where you can store your data and implement formulas. Also, with plugins, you can implement custom formulas like a Google translator. Last but not least, you can use these spreadsheets as a user_canister for your services. In other words, the components will act as a frontend that interacts with this spreadsheet."
    },
    {
        title: "Plugins",
        content: "Plugins or extensions are customizations that you can add to your ODOC application. For example, you can add a grammar correction plugin like Grammarly or a machine learning plugin that helps you abbreviate your text."
    },

    {
        title: "Views",
        content: "You can view a table in the form of a chart or gallery, or in a custom view that allows you to see your data in different ways that are pleasant to the eye, more expressive, cleaner, or for input like quatrains and polls."
    },
    {
        title: "social platform",
        content: "Users can post about jobs or plugins they created or seek jobs."
    },
    {
        title: "custom contracts",
        content: "With formulas, you can create custom contracts."
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
        title: "User profile",
        content: "As the user login they can click on avatar and select profile to see their data and history and balance and notification settings"
    },
    {title: "Profile history and trust score", content: "contract."},
    {title: "User contracts", content: "contract."},
    {title: "Pages", content: "contract."},
    {title: "Tables and views", content: "contract."},
    {title: "Formulas", content: "contract."},
    {title: "Each user can have their own canister.", content: "contract."},
    {title: "Plugins", content: "contract."},
]

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            <header>
                <h1>Welcome to ODOC</h1>
                <p>Empowering Freelancers with Transparent and Liberating Smart Contracts on the Blockchain. Also, it is
                    all in one where you can manage your tasks, notes, documentation, and agreements/contracts. </p>
            </header>
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
                <p>© 2023 ODOC. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
