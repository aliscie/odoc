# Jobs Feature Documentation

This document provides an overview of the Jobs feature, which includes CV evaluation and job matching functionality.

## 1. CV Evaluation System

### Inputs
- Users can paste CV text into a text box
- Users can upload PDFs (validates file type/size)
- PDFs convert to text and show embedded links (e.g., LinkedIn, GitHub)

### AI Feedback
- AI gives feedback like "Add project details" (no rewritten CVs)
- AI asks questions if CV is incomplete (e.g., "What's your role in X project?")
- A score (e.g., 80%) shows how good the CV is

### Data Storage
- Feedback, score, and links are saved in the app
- Data stays after page refresh (uses localStorage)

## 2. Job Search System

### Job Matching
- "Find Jobs" button appears after CV evaluation
- AI ignores jobs from previously searched companies (e.g., avoids repeating "Google")
- Jobs show a match score (e.g., "90% match")

### Job Display
- Jobs appear as cards in a grid layout
- Each card has:
  * Job title and description
  * Match score
  * "Apply" button (links to job URL) OR job source (e.g., "LinkedIn")

## 3. Optimizations
- AI only asks for missing CV info (never repeats the CV)
- Job results never repeat the same company twice

## File Structure

```
/jobs
├── JobsAgent.ts              # Core agent for CV analysis and chat functionality
├── jobSearchAgent.ts         # Agent for job search and matching
├── index.tsx                 # Main component that renders the jobs feature
├── types.ts                  # Type definitions
├── components/
│   ├── ChatUIComponents.tsx  # UI components for the chat interface
│   ├── FileUpload.tsx        # Component for uploading PDF files
│   ├── JobOpportunities.tsx  # Component for displaying job cards
│   └── MessageItem.tsx       # Component for displaying chat messages
└── hooks/
    └── useChatLogic.ts       # Custom hook for chat functionality
```

## Key Components

### JobsAgent

The `JobsAgent` class is responsible for:
- CV analysis and evaluation
- PDF text extraction
- Storing user profile data in localStorage
- Managing conversation history

It uses the Anthropic Claude API to analyze resumes and provide feedback.

### JobSearchAgent

The `JobSearchAgent` class handles:
- Job search based on user profile data
- Matching jobs to user skills and experience
- Storing job search results in localStorage

It also uses the Anthropic Claude API to generate relevant job listings.

### UI Components

- **FileUpload**: Handles PDF file uploads with validation
- **JobOpportunities**: Displays job cards in a grid layout with match scores
- **ChatUIComponents**: Provides the chat interface for CV feedback

## Implementation Details

- Both agents use the singleton pattern to prevent multiple instances
- User data is stored in localStorage for persistence
- PDF text extraction is done client-side
- The system uses Claude 3 Opus for AI analysis