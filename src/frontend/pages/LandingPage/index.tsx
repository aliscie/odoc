import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useState } from "react";
import "../styles/LandingPage.css";
import {
  Box,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import Card from "../../components/MuiComponents/Card";
import FullWidthTabs from "../welcome";
import StyledAccordion from "../../components/MuiComponents/StyledAccordion";
import FeatureModal from "../../components/MuiComponents/FeatureModal";
import { features, roadMap } from "./data";
import InfoCard from "../../components/MuiComponents/infoCard";

interface Features {
  title: string;
  content: string;
  icon: JSX.Element;
}

const LandingPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Features | null>(null);

  const handleClickOpen = (feature: Features) => {
    setSelectedFeature(feature);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFeature(null);
  };

  return (
    <Container maxWidth="lg" className="landing-page">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
            <CardContent>
              <header className="landing-header">
                <Typography variant="h2" align="left" gutterBottom>
                  Welcome to ODOC
                </Typography>
                <Typography variant="body1" align="left" paragraph>
                  Empowering freelancers, employers, and employees with
                  transparent and liberating smart contracts...
                </Typography>
              </header>

              <Box
                component="iframe"
                src="https://www.youtube.com/embed/z3L_pdmDMe8"
                width="100%"
                height="400px"
                title="What is Odoc"
                frameBorder="0"
                allowFullScreen
                sx={{ my: 2 }}
              />

              <FullWidthTabs />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
