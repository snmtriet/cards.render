import { useState, useEffect } from "react";

function getWindowDimensions() {
  let width;
  let height;
  if (typeof window !== "undefined") {
    const { innerWidth, innerHeight } = window;
    width = innerWidth;
    height = innerHeight;
  }
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
