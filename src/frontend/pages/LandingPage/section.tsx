import React, { useEffect, useRef } from 'react';
import { Box, Container, useTheme } from '@mui/material';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  containerWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  sx?: object;
  transparent?: boolean; // Add a new prop to control transparency
}

const Section: React.FC<SectionProps> = ({
  id,
  children,
  containerWidth = 'lg',
  sx = {},
  transparent = false // Default to false for backward compatibility
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
        minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scrollSnapAlign: 'start',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        // Only apply background color if not transparent
        bgcolor: transparent ? 'transparent' : theme.palette.background.default,
        color: theme.palette.text.primary,
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 4, sm: 6, md: 8 },
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
