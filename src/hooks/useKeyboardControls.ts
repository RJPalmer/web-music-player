import { useEffect } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useQueueStore } from "../stores/useQueueStore";

export function useKeyboardControls() {
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = useQueueStore((s) => s.next);
  const previous = useQueueStore((s) => s.previous);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Ignore typing in inputs / textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;

        case "ArrowRight":
          next();
          break;

        case "ArrowLeft":
          previous();
          break;

        case "KeyK":
          togglePlay();
          break;
        case "KeyL":
          next();
          break;
        case "KeyJ":
          previous();
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlay, next, previous]);
}
