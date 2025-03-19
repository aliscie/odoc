import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Box, Typography, Card, CardContent, Chip, Link } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { AnthropicAgent } from '../AnthropicAgent';

// Define the job interface
interface Job {
  title: string;
  description: string;
  matchingScore: number;
  applyLink: string;
  source: string;
  potentialCoverLetter: string;
  missingSkills: string[];
}

interface JobSearchProps {
  modelProvider?: 'anthropic' | 'deepseek';
}

const JobSearch: React.FC<JobSearchProps> = ({ modelProvider = 'deepseek' }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agent] = useState(() => new AnthropicAgent());

  // Load saved job results when component mounts
  useEffect(() => {
    const savedJobs = localStorage.getItem('job_search_results');
    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs));
      } catch (err) {
        console.error('Error parsing saved jobs:', err);
      }
    }
  }, []);

  const handleFindJobs = async () => {
    // Get resume data from localStorage
    const resumeData = localStorage.getItem('resume_data');
    if (!resumeData) {
      setError('No resume data found. Please upload your resume first.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Parse resume data
      const parsedResumeData = JSON.parse(resumeData);
      
      console.log(`Using ${modelProvider} for job search`);
      
      // Clear previous conversation to start fresh
      agent.clearConversation();
      
      // Create a prompt for the AI to generate job recommendations
      const prompt = `
      I need you to analyze this resume data and recommend relevant jobs:
      
      ${JSON.stringify(parsedResumeData, null, 2)}
      
      Please provide 3-5 job recommendations based on this resume. For each job:
      1. Create a realistic job title
      2. Write a brief job description
      3. Calculate a matching score (0-100) based on how well the resume matches the job
      4. Include any missing skills the candidate should acquire
      5. Suggest a realistic job source (job board or company)
      
      Format your response as a JSON array of job objects with these properties:
      - title: string
      - description: string
      - matchingScore: number
      - source: string
      - missingSkills: string[]
      - applyLink: string (leave empty)
      - potentialCoverLetter: string (leave empty)
      
      IMPORTANT: Return ONLY the JSON array, nothing else.
      `;
      
      // Send the prompt to the AI
      const response = await agent.sendMessage(prompt);
      
      // Parse the response to extract the JSON
      let jobsData: Job[] = [];
      try {
        // Find JSON in the response (it might be wrapped in markdown code blocks)
        const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                          response.match(/\[([\s\S]*)\]/);
                          
        if (jsonMatch) {
          // Parse the extracted JSON
          jobsData = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
        } else {
          // Try parsing the whole response as JSON
          jobsData = JSON.parse(response);
        }
        
        // Validate the parsed data
        if (!Array.isArray(jobsData)) {
          throw new Error('Response is not an array');
        }
        
        // Ensure each job has the required properties
        jobsData = jobsData.map(job => ({
          title: job.title || 'Unknown Position',
          description: job.description || 'No description available',
          matchingScore: typeof job.matchingScore === 'number' ? job.matchingScore : 70,
          applyLink: job.applyLink || '',
          source: job.source || 'Unknown Source',
          potentialCoverLetter: job.potentialCoverLetter || '',
          missingSkills: Array.isArray(job.missingSkills) ? job.missingSkills : []
        }));
        
        // Store the jobs in localStorage
        localStorage.setItem('job_search_results', JSON.stringify(jobsData));
        
        setJobs(jobsData);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        setError('Failed to parse job recommendations. Please try again.');
      }
      
      setLoading(false);
    } catch (err) {
      setError('An error occurred while searching for jobs. Please try again.');
      setLoading(false);
      console.error('Error searching for jobs:', err);
    }
  };

  const renderJobList = () => {
    if (jobs.length === 0) {
      return null;
    }

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>Matching Jobs</Typography>
        {jobs.map((job, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{job.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Source: {job.source} | Matching Score: {job.matchingScore}%
              </Typography>
              <Typography variant="body1" paragraph>
                {job.description}
              </Typography>
              
              {job.missingSkills.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Missing Skills:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {job.missingSkills.map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
              
              {job.applyLink ? (
                <Link href={job.applyLink} target="_blank" rel="noopener">
                  <Button variant="outlined" size="small">Apply Now</Button>
                </Link>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  No direct application link available. Visit {job.source} to apply.
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <WorkIcon />}
        onClick={handleFindJobs}
        size="large"
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Find Jobs'}
      </Button>
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      
      {renderJobList()}
    </Box>
  );
};

export default JobSearch;