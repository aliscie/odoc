import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React, {useState} from 'react';
import './styles/LandingPage.css';
import {Button, Divider, Typography, Container, Grid, Box, CardContent} from "@mui/material";
import Card from "../components/genral/card";

import FullWidthTabs from "./welcome";
import StyledAccordion from '../components/genral/styled_accordion';
import Slider from "react-slick";
import {features} from '../data/odoc_features';
import {roadMap} from '../data/odoc_roadmap';
import FeatureModal from '../components/genral/feature_modal';

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

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        cssEase: 'linear',
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <Container maxWidth="lg" className="landing-page">
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Card sx={{borderRadius: 2, boxShadow: 3, overflow: 'hidden'}}>
                        <CardContent>
                            <header className="landing-header">
                                <Typography variant="h2" align="left" gutterBottom>
                                    Welcome to ODOC
                                </Typography>
                                <Typography variant="body1" align="left" paragraph>
                                    Empowering freelancers, employers, and employees with transparent and liberating
                                    smart contracts...
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
                                sx={{my: 2}}
                            />

                            <FullWidthTabs/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Divider sx={{my: 4}}/>


            <section className="features-section">
                <Typography variant="h4" align="center" gutterBottom>
                    Our Features
                </Typography>
                <section className="features">
                    {features.map((card, index) => (
                        <Card key={index} title={card.title}>
                            {card.content}
                        </Card>
                    ))}

                </section>
            </section>

            <Divider sx={{my: 4}}/>

            <section className="roadmap">
                <Typography variant="h4" align="center" gutterBottom>
                    Road Map
                </Typography>

                {roadMap.map((item, index) => (
                    <StyledAccordion key={index} title={item.title} content={item.content} isDone={item.is_done}/>
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
                title={selectedFeature?.title || ''}
                content={selectedFeature?.content || ''}
                icon={selectedFeature?.icon || null}
            />
        </Container>
    );
};

export default LandingPage;
