import React from 'react';
import './styles/LandingPage.css';

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            <header>
                <h1>Welcome to AUTODOX</h1>
                <p>Empowering Freelancers with Transparent and Liberating Smart Contracts on the Blockchain. Also, it is
                    all in one where you can manage your tasks, notes, documentation, and agreements/contracts. </p>
            </header>
            <section className="features">
                <div className="card feature">
                    <h2>freelance contracts</h2>
                    <p>At Autodox, we are driven to address the struggles faced by freelancers worldwide, including
                        those in war-affected regions like Iraq or even Russia nowadays, and individuals burdened by
                        high commissions and taxes in countries like India. Our mission is to decentralize freelance
                        contracts, making them transparent and liberating through the power of smart contracts. We
                        envision a platform that provides unparalleled freedom and trust for freelancers.
                    </p>
                </div>
                <div className="card feature">
                    <h2>Profile rust score</h2>
                    <p>We are developing user profiles with comprehensive reliability histories and public ratings to
                        promote transparency. This fosters a highly transparent environment, empowering both freelancers
                        and clients by encouraging trust and accountability throughout the process.
                    </p>
                </div>
                <div className="card feature">
                    <h2>Task managements</h2>
                    <p>In addition to empowering freelancers, we are creating a note-taking and task-management app,
                        prioritizing privacy by encrypting user data. This ensures that organizations like hospitals and
                        research teams can confidently use our app. Initially, we offer simple functionalities like
                        spreadsheets, text styling, and grammar correction. Users can choose to upload data to the
                        blockchain for added security, with local storage capabilities. Our permission system based on
                        internet identity enhances privacy and data access control.
                    </p>
                </div>

                <div className="card feature">
                    <h2>Plugins</h2>
                    <p>plugins or extensions are customizations that you can add to your AUTODOX application. For
                        example, you can add grammar correction plugin like grammarly, or a machine learning plugin that
                        help you abbreviation your text</p>
                </div>


                <div className="card feature">
                    <h2>Formula and tables</h2>
                    <p>similar to Microsoft Excel you will have a spreadsheet where you can store your data and
                        implement formulas. Also, with plugins you can implement custom formulas like a Google
                        translator. Last but not least, you can use these spreadsheets as a backend for your services.
                        In other word the components will act as a frontend that interact with this spreadsheet.

                    </p>
                </div>


                <div className="card feature">
                    <h2>Views</h2>
                    <p>You can view a table in form of a chart or gallary or in a custom view which allows you to see
                        your data in a different ways that are plesent to the eye or more expressive or cleaner or for
                        input like quatrains and poll.</p>
                </div>
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
