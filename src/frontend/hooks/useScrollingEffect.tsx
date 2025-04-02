import { useEffect, useRef, RefObject } from 'react';
import { MotionValue } from 'framer-motion';

interface ScrollingEffectOptions {
  speedMultiplier?: number;
  zoomEffect?: boolean;
  maxZoom?: number;
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
  const { speedMultiplier = 5, zoomEffect = false, maxZoom = 1.3 } = options;
  const currentTimeRef = useRef(0);
  const targetTimeRef = useRef(0);
  const zoomRef = useRef(1);

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
      
      // Apply zoom effect if enabled
      if (zoomEffect && video.parentElement) {
        // Calculate zoom based on scroll progress (1 at start, maxZoom at end)
        const targetZoom = 1 + (scrollProgress * (maxZoom - 1));
        
        // Determine dynamic smoothing factor based on how fast the user is scrolling
        // The larger the difference between target and current zoom, the faster we'll adjust
        const zoomDifference = Math.abs(targetZoom - zoomRef.current);
        let smoothingFactor = 0.09; // Default smoothing
        
        if (zoomDifference > 0.5) {
          smoothingFactor = 0.15; // Faster adjustment for rapid scrolling
        } else if (zoomDifference > 0.2) {
          smoothingFactor = 0.12; // Medium adjustment
        }
        
        // Smooth transition for zoom with adaptive smoothing
        zoomRef.current += (targetZoom - zoomRef.current) * smoothingFactor;
        
        // Apply the zoom transform with transform-origin set to bottom left
        video.style.transformOrigin = 'left bottom';
        video.style.transform = `scale(${zoomRef.current})`;
      }
      
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
  }, [scrollYProgress, speedMultiplier, videoRef, zoomEffect, maxZoom]);
};

export default useScrollingEffect;