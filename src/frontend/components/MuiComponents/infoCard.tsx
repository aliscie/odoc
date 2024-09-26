import Card from "./Card";
import { Box, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

function InfoCard(props) {
  return (
    <Grid item xs={12} sm={6} md={4} key={props.index}>
      <Card className="feature-card" sx={{ margin: 1 }}>
        <CardContent className="feature-card-content">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            {props.icon}
          </Box>
          <Typography variant="h5" className="feature-card-title">
            {props.title}
          </Typography>
          <Typography variant="body2" className="feature-card-body">
            {props.content}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
export default InfoCard;
