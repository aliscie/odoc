import SmartContractIcon from "@mui/icons-material/AccountBalanceWallet";
import ProfileIcon from "@mui/icons-material/Person";
import TaskIcon from "@mui/icons-material/Assignment";
import FormulaIcon from "@mui/icons-material/Functions";
import ViewIcon from "@mui/icons-material/Visibility";
import SocialIcon from "@mui/icons-material/Share";
import DesktopIcon from "@mui/icons-material/DesktopWindows";
import ProtectionIcon from "@mui/icons-material/Security";

export const features = [
  {
    title: "Smart contracts",
    content:
      `At ODOC, we are driven to address the struggles faced by freelancers worldwide,
       including those in war-affected regions like Iraq or even Russia nowadays, 
       and individuals burdened by high commissions and taxes in countries like India.
       Our mission is to decentralize freelance contracts, making them transparent 
       and liberating through the power of smart contracts. We envision a platform
       that provides unparalleled freedom and trust for freelancers.`,
    icon: <SmartContractIcon className="feature-card-icon" />,
  },
  {
    title: "Profile trust score",
    content:
      `We are developing user profiles with comprehensive reliability histories 
       and public ratings to promote transparency.
       This fosters a highly transparent environment, empowering both freelancers 
       and clients by encouraging trust and accountability throughout the process.
       For example, if a user canceled a contract, it will appear in their profile.`,
    icon: <ProfileIcon className="feature-card-icon" />,
  },
  {
    title: "Task managements",
    content:
      `In addition to empowering freelancers, we are creating a note-taking and task-management app,
       prioritizing privacy by encrypting user data. 
       This ensures that organizations like hospitals and research teams can confidently use our app.
       Initially, we offer simple functionalities like spreadsheets, text styling, and grammar correction.
       Users can choose to upload data to the blockchain for added security, with local storage capabilities.
       Our permission system based on internet identity enhances privacy and data access control.`,
    icon: <TaskIcon className="feature-card-icon" />,
  },
  {
    title: "Formula and tables",
    content:
      `Similar to Microsoft Excel, you will have a spreadsheet where you can store your data and implement formulas.
       Also, you can implement custom formulas like a Google translator. Last but not least,
       you can use these spreadsheets as a backend for your services. In other words,
       the components will act as a frontend that interacts with this spreadsheet.`,
    icon: <FormulaIcon className="feature-card-icon" />,
  },
  {
    title: "Views",
    content:
      `You can view a table in the form of a chart or gallery,
       or in a custom view that allows you to see your data in different ways that are pleasant to the eye,
       more expressive, cleaner, or for input like quatrains and polls.`,
    icon: <ViewIcon className="feature-card-icon" />,
  },
  {
    title: "social platform",
    content: `Users can post about jobs they created or seek jobs.`,
    icon: <SocialIcon className="feature-card-icon" />,
  },
  {
    title: "Desktop version",
    content:
      `If you need only the web2 features like taking notes you can use the desktop version without transactions features.`,
    icon: <DesktopIcon className="feature-card-icon" />,
  },
  {
    title: "Minorities protection",
    content:
      `Instead of the SNS-voting system we will use SNS-migration system where users can migrate or stay on the old canister.
       If the old canisters has no active users, it will be automatically deleted.`,
    icon: <ProtectionIcon className="feature-card-icon" />,
  },
];
