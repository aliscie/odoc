import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React from 'react';
import './styles/LandingPage.css';
import { Divider, Typography, Container, Grid, Box, Card, CardContent } from "@mui/material";
import FullWidthTabs from "./welcome"; 
import StyledAccordion from '../components/genral/styled_accordion';
import Slider from "react-slick";
import { features } from '../data/odoc_features';
import { roadMap } from '../data/odoc_roadmap';
import { IconButton } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { ArrowBack } from '@mui/icons-material';

const LandingPage: React.FC = () => {

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
        nextArrow: <ArrowForward />,
        prevArrow: <ArrowBack />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
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
                    <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
                        <CardContent>
                            <header className="landing-header">
                                <Typography variant="h2" align="left" gutterBottom>
                                    Welcome to ODOC
                                </Typography>
                                <Typography variant="body1" align="left" paragraph>
                                    Empowering freelancers, employers, and employees with transparent and liberating smart contracts...
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

            
            <section className="feature-accordions">
                <Typography variant="h4" align="center" gutterBottom>
                    Our Features
                </Typography>

                <Slider {...settings} className="feature-carousel">
                    {features.map((feature, index) => (
                        <Card key={index} className="feature-card" sx={{ margin: 1 }}>
                            <CardContent className="feature-card-content">
                                {feature.icon}
                                <Typography variant="h5" className="feature-card-title">{feature.title}</Typography>
                                <Typography variant="body2" className="feature-card-body">{feature.content}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Slider>
            </section>

            <Divider sx={{ my: 4 }} />

            <section className="roadmap">
                <Typography variant="h4" align="center" gutterBottom>
                        Road Map
                    </Typography>

                {roadMap.map((item, index) => (
                    <StyledAccordion key={index} title={item.title} content={item.content} isDone={item.is_done} />
                ))}
            </section>

            <footer className="landing-footer">
                <Typography variant="body2" align="center" color="textSecondary">
                    © 2024 ODOC. All rights reserved. Founded by Ali Al-Karaawi
                </Typography>
            </footer>
        </Container>
    );
};

export default LandingPage;