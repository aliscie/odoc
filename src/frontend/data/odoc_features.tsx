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
      `ODOC decentralizes freelance contracts with smart contracts, 
       providing freedom and trust for freelancers in challenging regions.`,
    icon: <SmartContractIcon className="feature-card-icon" />,
  },
  {
    title: "Profile Trust Score",
    content: 
      `User profiles feature reliability histories and public ratings,
       fostering trust and accountability by showcasing contract details.`,
    icon: <ProfileIcon className="feature-card-icon" />,
  },
  {
    title: "Task Management",
    content: 
      `Our encrypted task management app supports spreadsheets, text styling,
       and grammar correction, ensuring privacy and suitability for sensitive organizations.`,
    icon: <TaskIcon className="feature-card-icon" />,
  },
  {
    title: "Formulas and Tables",
    content: 
      `Our platform supports spreadsheet formulas and can serve as a backend,
       interacting seamlessly with frontend components.`,
    icon: <FormulaIcon className="feature-card-icon" />,
  },
  {
    title: "Views",
    content: 
      `View data in various formats like charts or galleries, offering clean,
       expressive presentations to enhance the visual experience.`,
    icon: <ViewIcon className="feature-card-icon" />,
  },
  {
    title: "Social Platform",
    content: 
      `Post job listings or seek employment opportunities,
       fostering a vibrant job market and community interaction within our platform.`,
    icon: <SocialIcon className="feature-card-icon" />,
  },
  {
    title: "Desktop Version",
    content: 
      `The desktop version focuses on productivity, offering web2 features
       like note-taking without transaction functionalities.`,
    icon: <DesktopIcon className="feature-card-icon" />,
  },
  {
    title: "Minorities Protection",
    content: 
      `Our SNS-migration system allows migration or retention on old canisters,
       with inactive canisters being automatically deleted for efficiency.`,
    icon: <ProtectionIcon className="feature-card-icon" />,
  },
];
