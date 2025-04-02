import React from "react";
import { Box, Container, Typography } from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Schedule from "@mui/icons-material/Schedule";
import { roadMap } from "./data";

const PlatformProgress = () => {
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 8,
        mt: 0, // Ensure no top margin
        position: "relative", // Add positioning context
        zIndex: 1, // Ensure it's above other elements if needed
      }}
    >
        <Typography
          variant="h3"
          sx={{ textAlign: "center", fontWeight: "bold", mb: 6 }}
        >
          Platform Progress
        </Typography>
        
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          {/* Completed Features */}
          <Typography variant="h6" sx={{ mb: 3 }}>
            Completed Features
          </Typography>
          
          {/* Rest of the component remains unchanged */}
          <Box sx={{ mb: 4 }}>
            {roadMap
              .filter((item) => item.is_done)
              .map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CheckCircle sx={{ color: "#2563eb", mr: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 6 }}
                  >
                    {item.content}
                  </Typography>
                </Box>
              ))}
          </Box>

          {/* Upcoming Features */}
          <Typography variant="h6" sx={{ mb: 3 }}>
            Coming Soon
          </Typography>
          <Box>
            {roadMap
              .filter((item) => !item.is_done)
              .map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Schedule sx={{ color: "#64748b", mr: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 6 }}
                  >
                    {item.content}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </Container>
  );
};

export default PlatformProgress;