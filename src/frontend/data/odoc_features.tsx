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
    title: "Smart Contracts",
    content: 
      `ODOC aims to address the struggles faced by freelancers, especially in war-affected regions 
       or high-commission areas. By decentralizing freelance contracts with transparent smart contracts,
       we provide unparalleled freedom and trust for freelancers worldwide.`,
    icon: <SmartContractIcon className="feature-card-icon" />,
  },
  {
    title: "Profile Trust Score",
    content: 
      `We develop user profiles with comprehensive reliability histories and public ratings.
       This transparent environment empowers freelancers and clients by encouraging trust and accountability,
       showing details like contract cancellations in profiles.`,
    icon: <ProfileIcon className="feature-card-icon" />,
  },
  {
    title: "Task Management",
    content: 
      `Our note-taking and task-management app prioritizes privacy by encrypting user data,
       making it suitable for organizations like hospitals. Initial functionalities include spreadsheets,
       text styling, and grammar correction, with optional blockchain storage.`,
    icon: <TaskIcon className="feature-card-icon" />,
  },
  {
    title: "Formulas and Tables",
    content: 
      `Similar to Microsoft Excel, our platform supports spreadsheets with custom formulas,
       like a Google translator. These spreadsheets can serve as a backend for your services,
       interacting with frontend components.`,
    icon: <FormulaIcon className="feature-card-icon" />,
  },
  {
    title: "Views",
    content: 
      `Our platform allows viewing data in various formats like charts or galleries.
       Custom views offer expressive, clean presentations for data, enhancing the visual experience.`,
    icon: <ViewIcon className="feature-card-icon" />,
  },
  {
    title: "Social Platform",
    content: 
      `Users can post job listings or seek employment opportunities, fostering a vibrant job market
       and community interaction within our platform.`,
    icon: <SocialIcon className="feature-card-icon" />,
  },
  {
    title: "Desktop Version",
    content: 
      `For those who need only web2 features like note-taking, our desktop version offers
       a streamlined experience without transaction features, focusing on productivity.`,
    icon: <DesktopIcon className="feature-card-icon" />,
  },
  {
    title: "Minorities Protection",
    content: 
      `Our SNS-migration system allows users to migrate or stay on old canisters.
       If a canister has no active users, it will be automatically deleted, ensuring efficient management.`,
    icon: <ProtectionIcon className="feature-card-icon" />,
  },
];
