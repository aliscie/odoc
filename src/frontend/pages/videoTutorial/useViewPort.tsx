import {RefObject, useEffect, useState} from "react";

const useIsInViewport = (ref: RefObject<HTMLElement>, threshold = 0.5) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: "0px",
      },
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, threshold]);

  return isIntersecting;
};
export default useIsInViewport;
