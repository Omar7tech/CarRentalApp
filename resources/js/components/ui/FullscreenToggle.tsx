import { useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "./button";

const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  return (
    <Button
      size={'sm'}
      variant="secondary"
      onClick={toggleFullScreen}
      aria-label={
        isFullscreen
          ? "Exit fullscreen"
          : "Enter fullscreen"
      }
    >
      {isFullscreen ? (
        <Minimize />
      ) : (
        <Maximize />
      )}
    </Button>
  );
};

export default FullscreenToggle;