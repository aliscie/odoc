import React, { useState } from 'react';
import { 
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, Paper, Chip, Divider, Grid
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';  // Add this import
import { useResume } from '../ResumeContext';


const ResumeView: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { resume, setResume } = useResume();  // Add setResume from the context

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  // Add clear data function
  const handleClearData = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to clear all resume data? This action cannot be undone.')) {
      // Clear localStorage
      localStorage.removeItem('resume_data');
      
      // Reset resume state
      setResume({
        skills: [],
        education: [],
        experience: [],
        certifications: [],
        jobTitles: [],
        proficiencyLevel: 'Junior'
      });
      
      // Close the dialog
      handleClose();
    }
  };

  // Helper function to display empty state
  const EmptyState = () => (
    <Typography color="text.secondary" fontStyle="italic">
      No data available
    </Typography>
  );

  // Helper function to truncate long text
  const truncateText = (text: string, maxLength: number = 200) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      <Button 
        variant="outlined" 
        color="primary" 
        startIcon={<DescriptionIcon />} 
        onClick={handleOpen}
      >
        View Resume
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Resume Overview</Typography>
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={handleClearData}
              startIcon={<DeleteIcon />}
            >
              Clear Data
            </Button>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {!resume ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="error">
                No resume data found
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Start by adding your skills and experience in the chat.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 1 }}>
              {/* Proficiency Level */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Proficiency Level</Typography>
                <Chip label={resume.proficiencyLevel} color="primary" />
              </Box>

              {/* Job Titles */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Job Titles</Typography>
                {resume.jobTitles.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {resume.jobTitles.map((title, index) => (
                      <Chip key={index} label={title} variant="outlined" />
                    ))}
                  </Box>
                ) : <EmptyState />}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Skills */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Skills</Typography>
                {resume.skills.length > 0 ? (
                  <Grid container spacing={1}>
                    {resume.skills.map((skill, index) => (
                      <Grid item key={index} xs={12} sm={6} md={4}>
                        <Paper elevation={1} sx={{ p: 1 }}>
                          <Typography variant="subtitle2">{skill.skill}</Typography>
                          <Typography variant="body2">
                            {skill.years} {skill.years === 1 ? 'year' : 'years'} • 
                            Strength: {skill.strength}%
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : <EmptyState />}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Experience */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Experience</Typography>
                {resume.experience.length > 0 ? (
                  resume.experience.map((exp, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {exp.position} at {exp.company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {truncateText(exp.description)}
                      </Typography>
                    </Box>
                  ))
                ) : <EmptyState />}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Education */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Education</Typography>
                {resume.education.length > 0 ? (
                  resume.education.map((edu, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {edu.degree}
                      </Typography>
                      <Typography variant="body2">
                        {edu.institution}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {edu.startDate} - {edu.endDate}
                      </Typography>
                    </Box>
                  ))
                ) : <EmptyState />}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Certifications */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" gutterBottom>Certifications</Typography>
                {resume.certifications.length > 0 ? (
                  resume.certifications.map((cert, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {cert.title}
                      </Typography>
                      <Typography variant="body2">
                        {cert.issuer}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cert.date}
                      </Typography>
                    </Box>
                  ))
                ) : <EmptyState />}
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResumeView;