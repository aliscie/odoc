import React from 'react';
import './styles/LandingPage.css';
import Card from "../components/genral/card";

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            <header>
                <h1>Welcome to AUTODOX</h1>
                <p>Empowering Freelancers with Transparent and Liberating Smart Contracts on the Blockchain. Also, it is
                    all in one where you can manage your tasks, notes, documentation, and agreements/contracts. </p>
            </header>
            <section className="features">
                <Card title={"freelance contracts"}>
                    At Autodox, we are driven to address the struggles faced by freelancers worldwide, including
                    those in war-affected regions like Iraq or even Russia nowadays, and individuals burdened by
                    high commissions and taxes in countries like India. Our mission is to decentralize freelance
                    contracts, making them transparent and liberating through the power of smart contracts. We
                    envision a platform that provides unparalleled freedom and trust for freelancers.
                </Card>
                <Card title="custom contracts">with formulas you can create custom contracts</Card>
                <Card title="Profile trust score">We are developing user profiles with comprehensive reliability
                    histories and public ratings to
                    promote transparency. This fosters a highly transparent environment, empowering both freelancers
                    and clients by encouraging trust and accountability throughout the process. For example, if a
                    user canceled a contract that will appear in their profile.</Card>

                <Card title="Task managements">
                    In addition to empowering freelancers, we are creating a note-taking and
                    task-management app,
                    prioritizing privacy by encrypting user data. This ensures that organizations like hospitals and
                    research teams can confidently use our app. Initially, we offer simple functionalities like
                    spreadsheets, text styling, and grammar correction. Users can choose to upload data to the
                    blockchain for added security, with local storage capabilities. Our permission system based on
                    internet identity enhances privacy and data access control.
                </Card>
                <Card title={"Plugins"}>plugins or extensions are customizations that you can add to your AUTODOX
                    application. For
                    example, you can add grammar correction plugin like grammarly, or a machine learning plugin that
                    help you abbreviation your text</Card>

                <Card title={"Formula and tables"}>similar to Microsoft Excel you will have a spreadsheet where you can
                    store your data and
                    implement formulas. Also, with plugins you can implement custom formulas like a Google
                    translator. Last but not least, you can use these spreadsheets as a backend for your services.
                    In other word the components will act as a frontend that interact with this spreadsheet.
                </Card>
                <Card title={"Views"}>You can view a table in form of a chart or gallary or in a custom view which
                    allows you to see
                    your data in a different ways that are plesent to the eye or more expressive or cleaner or for
                    input like quatrains and poll.
                \</Card>

            </section>
            <section className="roadmap">
                <h2>Roadmap</h2>
                <ul>
                    <li>Step 1: Research</li>
                    <li>Step 2: Design</li>
                    <li>Step 3: Development</li>
                    <li>Step 4: Testing</li>
                    <li>Step 5: Launch</li>
                </ul>
            </section>
            <footer>
                <p>© 2023 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
