import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Change import from AnthropicAgent to GeminiAgent
import { GeminiAgent } from '../GeminiAgent';
import { Message } from '@solana/web3.js';
import AiChat from '@/components/AiChat';
import { useResume } from '../ResumeContext';
import { processResponseJobs } from '../utils/processResponseJobs';

const JobChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  // Initialize GeminiAgent instead of AnthropicAgent
  const [agent] = useState(() => new GeminiAgent());
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
    
    // Use GeminiAgent for responses (comment updated)
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
IMPORTANT: In the feedback act like hiring expert and give score of how good is the CV and what to improve. Search for conflict and mistakes in the CV

If no relevant data is found, return an empty array for extractedData.
`;

      const response = await agent.sendMessage(promptWithInstructions);
      // Process the response using the utility function
      const { extractedData, displayResponse } = processResponseJobs(response);
      console.log('Processed extracted data:', extractedData);
      
      // Store feedback in localStorage if available
      if (extractedData && extractedData.feedback) {
        localStorage.setItem('resume_feedback', extractedData.feedback);
      }
      
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
      console.error('Error getting response from Gemini:', error); // Updated error message
      
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
    console.log({ data });
    if (!data || !data.type || !data.field) {
      console.log('Invalid data format:', data);
      return false;
    }
    
    const { type, field, value } = data;
    
    // Log the extracted data to debug
    console.log('Processing extracted data:', { type, field, value });
    
    // Generic function to handle updating or adding items
    const processItems = (items, findMatch, createItem) => {
      // Convert to array if it's a single item
      const itemsArray = Array.isArray(items) ? items : [items];
      
      itemsArray.forEach(item => {
        if (!item) return;
        
        const existingItems = resume?.[field] || [];
        const existingIndex = existingItems.findIndex(findMatch(item));
        
        if (existingIndex !== -1) {
          console.log(`Updating existing ${field} item`);
          const updatedItem = createItem(item, existingItems[existingIndex]);
          
          // Call the appropriate add function based on field
          switch (field) {
            case 'skills': addSkill(updatedItem); break;
            case 'education': addEducation(updatedItem); break;
            case 'experience': addExperience(updatedItem); break;
            case 'certifications': addCertification(updatedItem); break;
          }
        } else {
          console.log(`Adding new ${field} item`);
          const newItem = createItem(item);
          
          // Call the appropriate add function based on field
          switch (field) {
            case 'skills': addSkill(newItem); break;
            case 'education': addEducation(newItem); break;
            case 'experience': addExperience(newItem); break;
            case 'certifications': addCertification(newItem); break;
          }
        }
      });
    };

    if (type === 'update' || type === 'add') {
      console.log(`Processing ${type} operation for field: ${field}`);
      
      switch (field) {
        case 'skills':
          processItems(
            value,
            item => existingItem => existingItem.skill.toLowerCase() === item.skill.toLowerCase(),
            (item, existingItem = {}) => ({
              skill: item.skill,
              years: item.years !== undefined ? item.years : (existingItem.years || 0),
              strength: item.strength !== undefined ? item.strength : (existingItem.strength || 50)
            })
          );
          break;
          
        case 'education':
          processItems(
            value,
            item => existingItem => 
              existingItem.degree.toLowerCase() === item.degree.toLowerCase() && 
              existingItem.institution.toLowerCase() === (item.institution || '').toLowerCase(),
            (item, existingItem = {}) => ({
              degree: item.degree || 'Degree',
              institution: item.institution || '',
              startDate: item.startDate || existingItem.startDate || '',
              endDate: item.endDate || existingItem.endDate || ''
            })
          );
          break;
          
        case 'experience':
          processItems(
            value,
            item => existingItem => 
              existingItem.position.toLowerCase() === item.position.toLowerCase() && 
              existingItem.company.toLowerCase() === item.company.toLowerCase(),
            (item, existingItem = {}) => {
              const startDate = item.startDate === null ? '' : item.startDate;
              const endDate = item.endDate === null ? '' : item.endDate;
              return {
                position: item.position,
                company: item.company,
                startDate: startDate || existingItem.startDate || '',
                endDate: endDate || existingItem.endDate || '',
                description: item.description || existingItem.description || ''
              };
            }
          );
          break;
          
        case 'certifications':
          processItems(
            value,
            item => existingItem => 
              existingItem.title.toLowerCase() === item.title.toLowerCase() && 
              existingItem.issuer.toLowerCase() === (item.issuer || '').toLowerCase(),
            (item, existingItem = {}) => ({
              title: item.title,
              issuer: item.issuer || '',
              date: item.date || existingItem.date || ''
            })
          );
          break;
          
        case 'jobTitles':
          if (Array.isArray(value)) {
            value.forEach(title => {
              if (typeof title === 'string') {
                addJobTitle(title);
              }
            });
          } else if (typeof value === 'string') {
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
    return true;
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

