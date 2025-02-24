# ODOC
- Decentralized & open source Trustless contracts, tasks, and payment Management on ICP
- **Name** the word odoc stand for open documents
- **Version:** beta | **Date:** 2025-02-07
- **Duration:** 4 months  
- **Intro Link:** [Twitter Announcement](https://x.com/alihushamsci/status/1885269718392590342)  

---

### Abstract  
odoc revolutionizes freelance collaboration and project management by leveraging the Internet Computer Protocol (ICP). Tailored for freelancers, project managers, product managers, and remote teams, the platform eliminates intermediaries by integrating task coordination, escrow payments, contract automation, and transparent pricing into one decentralized ecosystem. Built on ICP’s trustless architecture, odoc ensures secure, censorship-resistant workflows while rewarding productivity and penalizing inefficiencies. Teams save time and money with direct, global payments, milestone tracking, and enterprise-grade security—all without middlemen.

---

### Introduction  
Freelancers and project-driven teams face fragmented tools, delayed payments, and costly intermediaries in traditional task and payment management systems. odoc addresses these pain points by decentralizing workflows on the ICP blockchain. From automated escrow for freelancers to real-time progress tracking for project managers, odoc unifies contracts, tasks, and payments in a trustless environment. This white paper details how odoc empowers product managers to allocate resources, freelancers to secure payments, and teams to collaborate seamlessly—all while reducing costs and eliminating third-party dependencies.

---

### Problem Statement  
Current project management tools lack integrated payment solutions, forcing teams to juggle multiple platforms for task delegation, contract enforcement, and payroll. Freelancers risk non-payment, project managers struggle with inefficient workflows, and businesses incur high fees for escrow or cross-border transactions. Centralized systems also expose sensitive financial data and enable platform censorship. odoc solves these issues by decentralizing task execution, automating milestone-based payments via smart contracts, and providing a unified workspace where teams manage deadlines, budgets, and deliverables without intermediaries.

---

### Solution Overview  
odoc streamlines freelance and project management through ICP-based canisters that automate contracts, escrow, and payments. Project managers create tasks with predefined budgets and milestones, while freelancers submit work for on-chain validation. Payments are released automatically upon approval, with disputes resolved through decentralized governance. Product managers leverage tokenized incentives to align team goals, and all transactions are recorded immutably, eliminating billing disputes. The platform’s multi-token system rewards timely delivery and penalizes delays, while its escrow module ensures freelancers are paid fairly without relying on third-party platforms. Security is enforced through ICP’s consensus layer, reducing reliance on traditional encryption.

---

# Technology Architecture  
**Platform:** Internet Computer Protocol (ICP)  

#### Components  
- **Decentralized Identity:** Empowers users to manage their digital identities autonomously without relying on centralized authorities.  
- **Smart Contract Canisters:** Host backend logic for content management, order processing, payment handling, and governance, ensuring transparent and verifiable operations.  
- **Decentralized Storage:** Ensures data integrity and resilience by distributing user data across a robust network of nodes.  
- **Peer-to-Peer Communication:** Facilitates direct interactions among users via ICP’s trustless protocols, eliminating the need for traditional centralized servers.  
- **Order and Payment Management:** Provides an effortless system for managing tasks, contracts, and payments. Teams can oversee orders and financial commitments in a trustless environment without conventional encryption, relying instead on immutable ledger entries and transparent smart contract validations.  

#### Security  
Rather than using conventional encryption, odoc leverages the inherent security of ICP's decentralized consensus and immutable ledger entries. Trustless smart contract canisters ensure that all transactions and data modifications are transparent and verifiable, eliminating the need for traditional encryption techniques.

---

# Tokenomics  
**Token Name:** ODOC  

#### Utility  
The ODOC token is the platform’s native currency used for transactions, incentivizing user engagement, and enabling participation in governance decisions. It forms the backbone of odoc's multi-token ecosystem, aligning the interests of users, developers, and stakeholders.  

#### Distribution  
Tokens will be fairly distributed among early adopters, contributors, and strategic partners, with reserves allocated for ongoing development and community rewards.  

#### Economic Model  
The token model is engineered to balance supply and demand, encouraging active participation and sustainable growth. It integrates multiple token types to reflect financial and social engagements accurately:  

##### Interaction Tokens  
- **Sender Tokens:**  
  Earned when initiating a payment, these tokens are subject to burning in cases of refunds or unmet escrow conditions. Higher payment amounts trigger a proportional burn to ensure accountability.  
- **Receiver Tokens:**  
  Granted upon receiving payments, these tokens serve as a reputation or "stock" marker. In cases of disputes or cancellations, tokens are deducted to maintain fairness.  
- **Social Talk Tokens:**  
  Accrued through positive social interactions—such as posting content, receiving likes, and gaining views—these tokens are burnt when content receives negative feedback, ensuring a quality-driven social ecosystem.  

**Consensus Mechanism:** All token gains and burns are executed via a consensus-based system, ensuring that adjustments are community-validated in a manner similar to peer-reviewed scientific publishing or collaborative platforms like Wikipedia.  

---

# Governance  
**Model:** Decentralized Autonomous Organization (DAO)  
**Mechanism:** Token holders have proportional voting rights, enabling them to influence key decisions such as protocol upgrades, feature development, and content moderation policies. This democratic governance model guarantees that the platform evolves according to community needs.  
**Transparency:** Every governance decision is recorded on-chain, ensuring complete transparency and accountability throughout the decision-making process.  

---

# Roadmap  
[see our vision Vision](https://x.com/alihushamsci/status/1878758216756244789)
#### Milestone 1 (30 Days)  
- Frontend unit testing  
- Contracts permissions setup  
- Promises security validation  
- Backend unit tests  
- Update contacts permissions (backend side)  
- View contract permissions configuration  
- Prepare for SNS integration:  
  - Develop whitepaper  
  - Deploy Cycles ledger canister  
  - Implement sns-js library (or interact with SNS using agent and actor) [Note: decided]  
  - Establish Cycles management strategy:  
    - Provide each user with 1 free TC  
    - Enable payment for cycles via USDC/USDT/ICP/credit card deposit post free cycle usage  
    - Integrate frontend voting for SNS  
    - Implement reproducible SNS tests using Docker [Note: decided]  
  - Setup ODOC TOKines:  
    - Define token symbol as ODOCT  
- Launch the SNS:  
  - Enable decentralized governance for odoc  
  - Allow token holders to participate in key decisions  
  - Transition from centralized control to community-led governance  
  - Implement voting on new updates  

#### Milestone 2 (40 Days)  
- Develop Advanced Text Editor:  
  - Implement table functionality  
  - Enable live sharing  
  - Support export in PDF and CSV formats  
  - Incorporate color text options  
  - Allow commenting on text  
- Build Dashboard:  
  - Integrate calendar with events  
  - Implement TODO board:  
    - TODO  
    - Overdo  
    - In progress  
    - Done  
- Create Projects Section:  
  - Allow users to create projects for tracking progress and teams  
  - Enable tagging of contracts and documents with project identifiers  
  - Support workspaces as project names  
  - Plan future AI integration to suggest project details based on document/contract data  
- Implement Submissions Module:  
  - Allow users to create forums for data submission  
  - Support contract submissions via form  
- Design Contract Views:  
  - Charts view  
  - Board view  
  - Gallery view  
- Enhance Shares Contract Functionality:  
  - Enable voting on new share values (requires consent from all shareholders)  
  - Integrate automated calculation formulas:  
    - Example: `if (Age < 18) { 'Not allowed' }`  
    - Additional formula example with extra security confirmation:  
      - `if ( now() == '2022-08-03' ) { transfer_USDT({from: @ali, to: @john}) }`  
      - Formula components:  
        - Trigger (e.g., `now()` or `column('name')`)  
        - Operation (e.g., `==`, `>=`, `<=`, `contains`)  
        - Target value (e.g., `'2022-08-03'`, `'true'`, `'false'`)  
        - Execution (e.g., `transfer_USDT`, `transfer_token`, `transfer_nft`)  
- Testing with Selenium:  
  - Test full app CRUD and transaction flows  
  - Schedule test runs every 30 days or on each push to the main branch  
  - Specific tests:  
    - Login  
    - Register  
    - Create contract  
    - Create document  
    - Send friend request  
    - Access discover page  
    - Create post  
    - Create comment  
    - Reply to comment  
    - Handle long nested replies  
- Test Data Corruption Scenarios:  
  - Ensure data integrity during migrations (adding/renaming/removing fields)  

#### Milestone 3 (30 Days)  
- Implement Identity Verification:  
  - Require users to verify identity via passport chip for a green profile flag  
- Develop Tokens Collection Mechanism:  
  - Allow users to collect tokens (tokens cannot be purchased)  
  - Actions: Tokens earned from releasing or receiving payments  
  - Diversity: Encourage token collection from multiple users  
  - Community: Earn tokens by creating posts and receiving positive ratings  
- Enable Token Burning:  
  - Allow token burning through refunding nonrefundable promises  
- Define Three Types of Tokens:  
  - Social tokens  
  - Receiver tokens  
  - Sender tokens  
- Establish a 3-Day Token Gain Cycle:  
  - Tokens earned on send actions  
  - Tokens earned on receive actions  
  - Tokens earned on interactions  
- Implement 3 Ways to Burn Tokens:  
  - Burn tokens on cancellation  
  - Burn tokens on objections  
  - Burn tokens when receiving low ratings or dislikes  
- Enhance Advanced Permissions:  
  - Allow sharing of contracts with customizable permissions:  
    - Permission to release payment  
    - Permission to update a column  
    - Permission to view a column  
    - Support role separation (e.g., project manager vs. financial manager)  

#### Milestone 4 (50 Days)  
- Contract Enhancements:  
  - Implement filters  
  - Enable reordering and resizing of columns  
  - Allow reordering of rows  
  - Facilitate update requests  
- Advanced Navigation:  
  - Implement jump links for documents  
  - Develop publish page functionality  
  - Integrate search within content and contracts  
  - Implement pagination  
- Websocket Integration:  
  - Deploy websocket via Docker on AWS on a dedicated server  
- Networking Enhancements:  
  - Enable Mindmaster events  
  - Incorporate AI recommendations for connecting like-minded users  
  - Support creation of both online and physical events  
  - Facilitate custom posts  
- Google Calendar API Integration:  
  - Simplify migration from legacy systems  
- Integrate Notion API  
- Develop Cost Calculator:  
  - Assist managers in estimating costs using deep AI  
- Jobs Application Module:  
  - Allow job postings on the discover page  
  - Enable users to offer and apply for jobs  
  - Track job offers/applications and maintain job history on profiles  

---

# Team  
- **Founder & Visionary:** Sets the strategic direction of odoc and drives the core mission of decentralization and user empowerment.  
- **Chief Technology Officer (CTO):** Leads technical development, ensuring the seamless integration of ICP technologies and the platform’s scalability and reliability.  
- **Community Lead:** Manages user engagement, oversees governance processes, and integrates community feedback into the platform’s evolution.  



# security 🔐

ODoc ensures data integrity and protection against cyber threats for SMEs through its robust, decentralized architecture. Below are the key security features:
- **Tamper-proof Records**: Immutable blockchain records maintain an unalterable audit trail.
- **Decentralized Architecture**: Eliminates single points of failure, reducing attack vectors.
- **Verified Access**: Digital identities (Internet Ident) prevent unauthorized entry.
- **Fraud Prevention**: Cryptographic blockchain transactions and smart contracts secure payments.
- **Secure Communication**: Encrypted messaging and secret key protection ensure confidential collaboration.
- **Real-time Monitoring**: Immediate detection of suspicious activities minimizes risks.
- **AI Assistance**: Optimizes management and reduces human error.
---

# Conclusion  
odoc is set to revolutionize both social networking and order/payment management by leveraging the decentralized, trustless infrastructure of ICP. With a comprehensive multi-token ecosystem and a detailed, phased roadmap, odoc returns control to users and teams, ensuring transparency, accountability, and efficiency without relying on traditional encryption. This initial release, designed to be both cost-effective and rapid, lays the foundation for a future of decentralized digital interactions and community-led governance.  

---

### References  
1. Internet Computer Protocol (ICP) Official Documentation  
2. Standards for Decentralized Identity and Task Management  
3. Blockchain-based Governance Models  
4. Best Practices for Trustless Smart Contract Operations  
