import React, { createContext, useState, useContext, useEffect } from 'react';

// Storage key for localStorage
const STORAGE_KEY = 'resume_data';

// Define types
export type ProficiencyLevel = 'Junior' | 'Mid-level' | 'Senior' | 'Expert';

export interface Skill {
  skill: string;
  years: number;
  strength: number; // Percentage (0-100)
}

export interface Education {
  degree: string;
  institution: string;
  startDate: string; // YYYY-MM format
  endDate: string; // YYYY-MM format
}

export interface Experience {
  position: string;
  company: string;
  startDate: string; // YYYY-MM format
  endDate: string; // YYYY-MM format or 'Present'
  description: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string; // YYYY-MM format
}

export interface Resume {
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
  jobTitles: string[];
  proficiencyLevel: ProficiencyLevel;
}

interface ResumeContextType {
  resume: Resume | null;
  setResume: (resume: Resume) => void;
  updateResume: (partialResume: Partial<Resume>) => void;
  addSkill: (skill: Skill) => void;
  addEducation: (education: Education) => void;
  addExperience: (experience: Experience) => void;
  addCertification: (certification: Certification) => void;
  addJobTitle: (jobTitle: string) => void;
  setProficiencyLevel: (level: ProficiencyLevel) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resume, setResumeState] = useState<Resume | null>(null);

  // Load resume from localStorage on initial render
  useEffect(() => {
    const storedResume = localStorage.getItem(STORAGE_KEY);
    if (storedResume) {
      try {
        setResumeState(JSON.parse(storedResume));
      } catch (error) {
        console.error('Error parsing stored resume:', error);
      }
    } else {
      // Initialize with empty resume if none exists
      setResumeState({
        skills: [],
        education: [],
        experience: [],
        certifications: [],
        jobTitles: [],
        proficiencyLevel: 'Junior'
      });
    }
  }, []);

  // Save resume to localStorage whenever it changes
  useEffect(() => {
    if (resume) {
      console.log({resume})
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    }
  }, [resume]);

  const setResume = (newResume: Resume) => {
    setResumeState(newResume);
  };

  const updateResume = (partialResume: Partial<Resume>) => {
    setResumeState(prev => {
      if (!prev) return partialResume as Resume;
      return { ...prev, ...partialResume };
    });
  };

  // Helper functions to add items without duplicates
  const addSkill = (skill: Skill) => {
    setResumeState(prev => {
      if (!prev) return null;
      // Check if skill already exists (by name)
      const exists = prev.skills.some(s => s.skill.toLowerCase() === skill.skill.toLowerCase());
      if (exists) return prev;
      return { ...prev, skills: [...prev.skills, skill] };
    });
  };

  const addEducation = (education: Education) => {
    setResumeState(prev => {
      if (!prev) return null;
      // Check if education already exists (by institution and dates)
      const exists = prev.education.some(
        e => e.institution.toLowerCase() === education.institution.toLowerCase() && 
             e.startDate === education.startDate && 
             e.endDate === education.endDate
      );
      if (exists) return prev;
      return { ...prev, education: [...prev.education, education] };
    });
  };

  const addExperience = (experience: Experience) => {
    setResumeState(prev => {
      if (!prev) return null;
      // Check if experience already exists (by company, position and dates)
      const exists = prev.experience.some(
        e => e.company.toLowerCase() === experience.company.toLowerCase() && 
             e.position.toLowerCase() === experience.position.toLowerCase() && 
             e.startDate === experience.startDate && 
             e.endDate === experience.endDate
      );
      if (exists) return prev;
      return { ...prev, experience: [...prev.experience, experience] };
    });
  };

  const addCertification = (certification: Certification) => {
    setResumeState(prev => {
      if (!prev) return null;
      // Check if certification already exists (by title and date)
      const exists = prev.certifications.some(
        c => c.title.toLowerCase() === certification.title.toLowerCase() && 
             c.date === certification.date
      );
      if (exists) return prev;
      return { ...prev, certifications: [...prev.certifications, certification] };
    });
  };

  const addJobTitle = (jobTitle: string) => {
    setResumeState(prev => {
      if (!prev) return null;
      // Check if job title already exists
      const exists = prev.jobTitles.some(
        title => title.toLowerCase() === jobTitle.toLowerCase()
      );
      if (exists) return prev;
      return { ...prev, jobTitles: [...prev.jobTitles, jobTitle] };
    });
  };

  const setProficiencyLevel = (level: ProficiencyLevel) => {
    setResumeState(prev => {
      if (!prev) return null;
      return { ...prev, proficiencyLevel: level };
    });
  };

  return (
    <ResumeContext.Provider value={{ 
      resume, 
      setResume, 
      updateResume,
      addSkill,
      addEducation,
      addExperience,
      addCertification,
      addJobTitle,
      setProficiencyLevel
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};