import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';



import { AnthropicAgent } from '../AnthropicAgent';
import { Message } from '@solana/web3.js';
import AiChat from '@/components/AiChat';
import { useResume } from '../ResumeContext';
import { processResponseJobs } from '../utils/processResponseJobs';



const JobChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [agent] = useState(() => new AnthropicAgent());
  const { 
    addSkill, 
    addEducation, 
    addExperience, 
    addCertification, 
    addJobTitle, 
    setProficiencyLevel 
  } = useResume();

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: uuidv4(),
        content: "I'm your job assistant. I can help you with job applications and resume analysis. Share your resume details or tell me about your skills, education, and experience.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);
  const { resume } = useResume();
      const resumeContext = resume ? JSON.stringify(resume, null, 2) : 'No resume data available yet';
      console.log({resumeContext})

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Use AnthropicAgent for responses
    setLoading(true);
    try {
      // Add special instructions for the AI to extract resume data
      const promptWithInstructions = `

      Current Resume Data:
\`\`\`json
${resumeContext}
\`\`\`

${content}

IMPORTANT: After your regular response, please include a structured JSON section that extracts any resume data from the user's message.
Format it as follows:
\`\`\`json
{
  "feedback": "Your feedback about the resume information",
  "extractedData": [
    {
      "type": "update|remove",
      "field": "skills|education|experience|certifications|jobTitles|proficiencyLevel",
      "value": {}
    }
  ]
}
\`\`\`

For skills, use format: { "skill": "Skill name", "years": number, "strength": number }
For education, use format: { "degree": "Degree name", "institution": "Institution name", "startDate": "YYYY-MM", "endDate": "YYYY-MM" }
For experience, use format: { "position": "Job title", "company": "Company name", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "Job description" }
For certifications, use format: { "title": "Certification name", "issuer": "Issuing organization", "date": "YYYY-MM" }
For jobTitles, use format: "Job Title"
For proficiencyLevel, use one of: "Junior", "Mid-level", "Senior", "Expert"

IMPORTANT: If you need to extract multiple items (like multiple skills or experiences), include them all in a single extractedData array rather than creating multiple extractedData objects.
IMPORTANT: Return only feedback and JSON do not mention anything else.

If no relevant data is found, return an empty array for extractedData.
`;

      const response = await agent.sendMessage(promptWithInstructions);
      
      console.log({response})
      
      // Process the response using the utility function
      const { extractedData, displayResponse } = processResponseJobs(response);
      console.log('Processed extracted data:', extractedData);
      
      // Add detailed logging for debugging
      if (extractedData && extractedData.extractedData) {
      
        
        // Handle the case where extractedData is an array
        if (Array.isArray(extractedData.extractedData)) {
          console.log(`Processing ${extractedData.extractedData.length} extracted data items`);
          extractedData.extractedData.forEach((dataItem, index) => {
            console.log(`Processing item ${index + 1}:`, dataItem);
            const result = processExtractedData(dataItem);
            console.log(`Result of processing item ${index + 1}:`, result);
          });
        } else {
          // Handle the case where extractedData is a single object
          console.log('Processing single extracted data item:', extractedData.extractedData);
          const result = processExtractedData(extractedData.extractedData);
          console.log('Result of processing single item:', result);
        }
      } else {
        console.log('No extracted data found or invalid format');
      }
      
      const responseMessage: Message = {
        id: uuidv4(),
        content: displayResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error getting response from Anthropic:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const processExtractedData = (data: any) => {
    if (!data || !data.type || !data.field) {
      console.log('Invalid data format:', data);
      return false;
    }
    
    const { type, field, value } = data;
    
    // Log the extracted data to debug
    console.log('Processing extracted data:', { type, field, value });
    
    if (type === 'update' || type === 'add') {
      switch (field) {
        case 'skills':
          if (Array.isArray(value)) {
            // Handle array of skills
            value.forEach(skillItem => {
              if (skillItem && skillItem.skill) {
                addSkill({
                  skill: skillItem.skill,
                  years: skillItem.years || 0,
                  strength: skillItem.strength || 50
                });
              }
            });
          } else if (value && value.skill) {
            // Handle single skill object
            addSkill({
              skill: value.skill,
              years: value.years || 0,
              strength: value.strength || 50
            });
          }
          break;
        case 'education':
          if (Array.isArray(value)) {
            // Handle array of education items
            console.log('Processing education array with', value.length, 'items');
            value.forEach((eduItem, index) => {
              if (eduItem && eduItem.degree) {
                console.log(`Adding education item ${index + 1}:`, eduItem);
                addEducation({
                  degree: eduItem.degree || 'Degree',
                  institution: eduItem.institution || '',
                  startDate: eduItem.startDate || '',
                  endDate: eduItem.endDate || ''
                });
              } else {
                console.log(`Skipping invalid education item ${index + 1}:`, eduItem);
              }
            });
          } else if (value && value.degree) {
            // Handle single education object
            console.log('Adding single education item:', value);
            addEducation({
              degree: value.degree || 'Degree',
              institution: value.institution || '',
              startDate: value.startDate || '',
              endDate: value.endDate || ''
            });
          } else {
            console.log('Invalid education value:', value);
          }
          break;
        case 'experience':
          if (Array.isArray(value)) {
            // Handle array of experience items
            value.forEach(expItem => {
              if (expItem && expItem.company && expItem.position) {
                // Convert null dates to empty strings
                const startDate = expItem.startDate === null ? '' : expItem.startDate;
                const endDate = expItem.endDate === null ? '' : expItem.endDate;
                
                addExperience({
                  position: expItem.position,
                  company: expItem.company,
                  startDate: startDate,
                  endDate: endDate,
                  description: expItem.description || ''
                });
              }
            });
          } else if (value && value.company && value.position) {
            // Handle single experience object
            const startDate = value.startDate === null ? '' : value.startDate;
            const endDate = value.endDate === null ? '' : value.endDate;
            
            addExperience({
              position: value.position,
              company: value.company,
              startDate: startDate,
              endDate: endDate,
              description: value.description || ''
            });
          }
          break;
        case 'certifications':
          if (Array.isArray(value)) {
            // Handle array of certification items
            value.forEach(certItem => {
              if (certItem && certItem.title) {
                addCertification({
                  title: certItem.title,
                  issuer: certItem.issuer || '',
                  date: certItem.date || ''
                });
              }
            });
          } else if (value && value.title) {
            // Handle single certification object
            addCertification({
              title: value.title,
              issuer: value.issuer || '',
              date: value.date || ''
            });
          }
          break;
        case 'jobTitles':
          if (Array.isArray(value)) {
            // Handle array of job titles
            value.forEach(title => {
              if (typeof title === 'string') {
                addJobTitle(title);
              }
            });
          } else if (typeof value === 'string') {
            // Handle single job title
            addJobTitle(value);
          }
          break;
        case 'proficiencyLevel':
          if (typeof value === 'string' && 
              ['Junior', 'Mid-level', 'Senior', 'Expert'].includes(value)) {
            setProficiencyLevel(value);
          }
          break;
      }
    }
    // You can add update and remove functionality later if needed
  };

  return (
    <AiChat
      title="Job Application Assistant"
      initialMessages={messages}
      infoMessage="Share your resume details or tell me about your skills, education, and experience."
      loading={loading}
      onSendMessage={handleSendMessage}
    />
  );
};

export default JobChat;

