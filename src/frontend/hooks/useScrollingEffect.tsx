import { useEffect, useRef, RefObject } from 'react';
import { MotionValue } from 'framer-motion';

interface ScrollingEffectOptions {
  speedMultiplier?: number;
}

/**
 * Custom hook to handle video scrolling effect
 * @param videoRef Reference to the video element
 * @param scrollYProgress Framer Motion scroll progress value
 * @param options Configuration options
 */
export const useScrollingEffect = (
  videoRef: RefObject<HTMLVideoElement>,
  scrollYProgress: MotionValue<number>,
  options: ScrollingEffectOptions = {}
) => {
  const { speedMultiplier = 5 } = options;
  const currentTimeRef = useRef(0);
  const targetTimeRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    // Flag to track initial load
    let isInitialized = false;
    
    // Animation frame for smooth interpolation
    let animationFrameId: number;
    
    // Function to handle video initialization
    const initializeVideo = () => {
      // Calculate total video duration in seconds
      const videoDuration = video.duration || 10; // Fallback to 10 seconds if duration not available
      
      // Get initial scroll position
      const initialScrollProgress = scrollYProgress.get();
      
      // Set initial video position without animation
      const initialPosition = initialScrollProgress * videoDuration * speedMultiplier;
      video.currentTime = Math.min(initialPosition, videoDuration - 0.1);
      
      // Set reference values
      currentTimeRef.current = video.currentTime;
      targetTimeRef.current = video.currentTime;
      
      isInitialized = true;
      
      // Start the animation loop after initialization
      animationFrameId = requestAnimationFrame(updateVideoTime);
    };
    
    const updateVideoTime = () => {
      if (!video || !isInitialized) return;
      
      // Calculate total video duration in seconds
      const videoDuration = video.duration || 10;
      
      // Calculate desired video position based on scroll progress
      const scrollProgress = scrollYProgress.get();
      
      targetTimeRef.current = scrollProgress * videoDuration * speedMultiplier;
      
      // Ensure we don't exceed the video duration
      targetTimeRef.current = Math.min(targetTimeRef.current, videoDuration - 0.1);
      
      // Calculate distance to target time
      const distance = Math.abs(targetTimeRef.current - currentTimeRef.current);
      
      // Dynamic easing based on distance
      // More responsive for larger changes, smoother for small adjustments
      let easing;
      if (distance > 2) {
        easing = 0.7; // Very responsive for big jumps
      } else if (distance > 1) {
        easing = 0.5; // Responsive for medium changes
      } else if (distance > 0.5) {
        easing = 0.3; // Moderate for small changes
      } else {
        easing = 0.15; // Very smooth for tiny adjustments
      }
      
      // Smoothly interpolate between current time and target time
      currentTimeRef.current += (targetTimeRef.current - currentTimeRef.current) * easing;
      
      // Seek to the appropriate position in the video
      if (video.readyState >= 2) {
        video.currentTime = currentTimeRef.current;
      }
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(updateVideoTime);
    };
    
    // Wait for video metadata to load before initializing
    const handleVideoMetadata = () => {
      // Initialize video position based on current scroll
      initializeVideo();
    };
    
    // Listen for metadata loaded event
    video.addEventListener('loadedmetadata', handleVideoMetadata);
    
    // If metadata is already loaded, initialize immediately
    if (video.readyState >= 1) {
      handleVideoMetadata();
    }
    
    // Clean up animation frame and event listener on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      video.removeEventListener('loadedmetadata', handleVideoMetadata);
    };
  }, [scrollYProgress, speedMultiplier, videoRef]);
};

export default useScrollingEffect;