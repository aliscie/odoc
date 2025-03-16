import React, { useRef, useState } from 'react';
import { 
  IconButton, 
  Box, 
  Chip, 
  LinearProgress, 
  Typography,
  Stack
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { FileItem } from '../types';

interface FileUploadProps {
  onChange: (files: FileItem[]) => void;
  fileList: FileItem[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange, fileList }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).map(file => {
        // Simulate upload progress for each file
        simulateFileUpload(file.name);
        
        return {
          originFileObj: file,
          name: file.name,
          type: file.type,
        };
      });
      onChange([...fileList, ...fileArray]);
    }
  };

  const simulateFileUpload = (fileName: string) => {
    setUploadProgress(prev => ({ ...prev, [fileName]: 0 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[fileName] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [fileName]: currentProgress + 10 };
      });
    }, 200);
  };

  const handleRemoveFile = (fileName: string) => {
    const newFileList = fileList.filter(file => file.name !== fileName);
    onChange(newFileList);
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  return (
    <>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Box>
        <IconButton onClick={handleClick} size="small">
          <AttachFileIcon />
        </IconButton>
        
        {fileList.length > 0 && (
          <Box sx={{ mt: 1, maxHeight: '100px', overflowY: 'auto' }}>
            <Stack spacing={1}>
              {fileList.map((file) => (
                <Box key={file.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip
                    label={file.name}
                    onDelete={() => handleRemoveFile(file.name)}
                    deleteIcon={<CloseIcon />}
                    size="small"
                    sx={{ maxWidth: '200px' }}
                  />
                  {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                    <Box sx={{ ml: 1, width: '100%', maxWidth: '100px' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress[file.name]} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {uploadProgress[file.name]}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
};

export default FileUpload;