import React, { useEffect, useRef } from 'react';
import { Box, Container, useTheme } from '@mui/material';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  containerWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  sx?: object;
}

const Section: React.FC<SectionProps> = ({
  id,
  children,
  containerWidth = 'lg',
  sx = {}
}) => {
  const theme = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      },
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    if (sectionRef.current) {
      sectionRef.current.style.opacity = '0';
      sectionRef.current.style.transform = 'translateY(20px)';
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <Box
      ref={sectionRef}
      id={id}
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scrollSnapAlign: 'start',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        ...sx
      }}
    >
      <Container maxWidth={containerWidth}>
        {children}
      </Container>
    </Box>
  );
};

export default Section;
