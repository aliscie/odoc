export const processResponseJobs = (response: string) => {
  // Extract the display response (everything before the JSON)
  let displayResponse = response;
  let extractedData = null;
  
  // Look for JSON blocks in the response
  const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
  
  if (jsonMatch && jsonMatch[1]) {
    try {
      // Extract just the display part (remove the JSON block)
      displayResponse = response.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      
      // Fix the JSON by converting multiple extractedData objects into an array
      let jsonText = jsonMatch[1];
      
      // Check if we have multiple "extractedData" keys (invalid JSON)
      const extractedDataCount = (jsonText.match(/"extractedData"\s*:/g) || []).length;
      
      if (extractedDataCount > 1) {
        // Convert the invalid JSON with multiple same keys into valid JSON with an array
        // First, get the feedback part
        const feedbackMatch = jsonText.match(/"feedback"\s*:\s*"([^"]*)"/) || [];
        const feedback = feedbackMatch[1] || "";
        
        // Then extract all the extractedData objects
        const extractedDataRegex = /"extractedData"\s*:\s*({[^}]*})/g;
        const extractedDataObjects = [];
        let match;
        
        while ((match = extractedDataRegex.exec(jsonText)) !== null) {
          try {
            // Parse each extractedData object
            const dataObj = JSON.parse(match[1]);
            extractedDataObjects.push(dataObj);
          } catch (e) {
            console.error('Error parsing individual extractedData object:', e);
          }
        }
        
        // Create a new valid JSON structure
        const validJson = {
          feedback,
          extractedDataArray: extractedDataObjects
        };
        
        extractedData = validJson;
      } else {
        // If it's valid JSON with a single extractedData, parse it normally
        extractedData = JSON.parse(jsonText);
      }
      
      console.log('Extracted data from response:', extractedData);
    } catch (error) {
      console.error('Error parsing JSON from response:', error);
    }
  }
  
  return { displayResponse, extractedData };
};