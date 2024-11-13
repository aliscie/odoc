import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useState } from "react";
import "../styles/LandingPage.css";
import {
  Box,
  Button,
  CardContent,
  Container,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import Card from "../../components/MuiComponents/Card";
import FullWidthTabs from "../welcome";
import StyledAccordion from "../../components/MuiComponents/StyledAccordion";
import FeatureModal from "../../components/MuiComponents/FeatureModal";
import { features, roadMap } from "./data";
import InfoCard from "../../components/MuiComponents/infoCard";
import { useBackendContext } from "../../contexts/BackendContext";
import StepGuide from "./getStarted";

interface Features {
  title: string;
  content: string;
  icon: JSX.Element;
}

const LandingPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Features | null>(null);

  // const handleClickOpen = (feature: Features) => {
  //   setSelectedFeature(feature);
  //   setOpenModal(true);
  // };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFeature(null);
  };

  const { login, logout } = useBackendContext();
  return (
    <Container maxWidth="lg" className="landing-page">
      <header className="landing-header">
        <div style={{ textAlign: "left" }}>
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <img
              style={{
                marginRight: "10px",
              }}
              width="100px"
              src="https://private-user-images.githubusercontent.com/58806996/385578043-f5cd528f-5808-4595-bc3b-e3558a2b2321.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzE0NzAyNjMsIm5iZiI6MTczMTQ2OTk2MywicGF0aCI6Ii81ODgwNjk5Ni8zODU1NzgwNDMtZjVjZDUyOGYtNTgwOC00NTk1LWJjM2ItZTM1NThhMmIyMzIxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDExMTMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQxMTEzVDAzNTI0M1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTIyZmNjMTczZGU3OTg3Y2I2NjQ2MDQ1YzYzNDhiMWI0ZWMzYTc4Njg4ZGVlMzg3MDJmZDk2ZTc5YmI0ZTVlN2UmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.ES8IgD0NTRbc3ssNNinUN6wn9nNbwgmE4lUAjoQ4zPA"
              alt="ODOC Logo"
            />
            <Typography variant="h2" align="left" gutterBottom>
              ODOC
            </Typography>
          </div>
        </div>

        <Typography variant="h2" align="left" gutterBottom>
          Build your contracts on web3
        </Typography>

        <Typography
          color={"var(--color)"}
          variant="body"
          align="left"
          paragraph
        >
          Odoc where you can manage your tasks, payments contracts, agreements
          and documents in one place. Odoc save your time, money and secure your
          agreement. It fully runs on the{" "}
          <Link
            href="https://internetcomputer.org/"
            underline="always"
            target="_blank"
            rel="noopener noreferrer"
          >
            Internet Computer
          </Link>
          .
        </Typography>
      </header>
      <div style={{ textAlign: "left" }}>
        <Button
          variant={"contained"}
          size={"large"}
          onClick={async () => await login()}
        >
          try it now
        </Button>
      </div>
      <StepGuide />

      <Divider sx={{ my: 4 }} />

      <section className="features-section">
        <Typography variant="h4" align="center" gutterBottom>
          Our Features
        </Typography>

        <Grid container spacing={2}>
          {features.map((feature, index) => (
            <InfoCard {...feature} index={index} />
          ))}
        </Grid>
      </section>

      <Divider sx={{ my: 4 }} />

      <section className="roadmap">
        <Typography variant="h4" align="center" gutterBottom>
          Road Map
        </Typography>

        {roadMap.map((item, index) => (
          <StyledAccordion
            key={index}
            title={item.title}
            content={item.content}
            isDone={item.is_done}
          />
        ))}
      </section>

      <footer className="landing-footer">
        <Typography variant="body2" align="center" color="textSecondary">
          © 2024 ODOC. All rights reserved. Founded by Ali Al-Karaawi
        </Typography>
      </footer>

      <FeatureModal
        open={openModal}
        handleClose={handleCloseModal}
        title={selectedFeature?.title || ""}
        content={selectedFeature?.content || ""}
        icon={selectedFeature?.icon || null}
      />
    </Container>
  );
};

export default LandingPage;
