import React from "react";
import { Rating, Tooltip, Typography, Grid, Box } from "@mui/material";
import ShareProfileButton from "./actions/ShareProfileButton";

interface ProfileRatingsProps {
  profile_history: any;
  profileData: any;
}

const ProfileRatings: React.FC<ProfileRatingsProps> = ({
  profile_history,
  profileData,
}) => (
  <Box
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      marginTop: 16,
    }}
  >
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
        <Typography variant="subtitle2" gutterBottom>
          Success Rating
        </Typography>
        {profile_history && (
          <Tooltip arrow title={"Your actions rate"}>
            <Rating
              readOnly
              name="half-rating"
              defaultValue={profile_history.actions_rate}
              precision={0.5}
            />
          </Tooltip>
        )}
      </Grid>
      <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
        <ShareProfileButton
          profileName={profileData.name}
          profileId={profileData.id}
        />
      </Grid>
      <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
        <Typography variant="subtitle2" gutterBottom>
          Community Rating
        </Typography>
        {profile_history && (
          <Tooltip arrow title={"Your users rate"}>
            <Rating
              readOnly
              name="half-rating"
              defaultValue={profile_history.users_rate}
              precision={0.5}
            />
          </Tooltip>
        )}
      </Grid>
    </Grid>
  </Box>
);

export default ProfileRatings;
