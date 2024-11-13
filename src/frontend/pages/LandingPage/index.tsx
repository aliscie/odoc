import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logo from "../../public/logo.png";

import React, { useState } from "react";
import "../styles/LandingPage.css";
import {
  Button,
  Container,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import StyledAccordion from "../../components/MuiComponents/StyledAccordion";
import FeatureModal from "../../components/MuiComponents/FeatureModal";
import { features, roadMap } from "./data";
import InfoCard from "../../components/MuiComponents/infoCard";
import { useBackendContext } from "../../contexts/BackendContext";
import StepGuide from "./getStarted";
import { useSelector } from "react-redux";

interface Features {
  title: string;
  content: string;
  icon: JSX.Element;
}

const LandingPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Features | null>(null);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFeature(null);
  };

  const { login } = useBackendContext();

  const { isLoggedIn } = useSelector((state: any) => state.uiState);
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
              src={logo}
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
        {!isLoggedIn && (
          <Button
            variant={"contained"}
            size={"large"}
            onClick={async () => await login()}
          >
            try it now
          </Button>
        )}
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
