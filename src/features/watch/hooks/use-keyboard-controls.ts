"use client";

import { useEffect, useRef } from "react";

interface UseKeyboardControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  playbackSpeed: number;
  handleSpeedChange: (speed: number) => void;
  holdSpeed: number;
  setIsSpeedBoostActive: (val: boolean) => void;
  toggleFullScreen: () => void;
  setIsWideMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMute: () => void;
  triggerVolumeHUD: () => void;
  togglePiP: () => void;
  setVolume: (val: number) => void;
  setIsMuted: (val: boolean) => void;
}

export function useKeyboardControls({
  videoRef,
  isPlaying,
  setIsPlaying,
  playbackSpeed,
  handleSpeedChange,
  holdSpeed,
  setIsSpeedBoostActive,
  toggleFullScreen,
  setIsWideMode,
  toggleMute,
  triggerVolumeHUD,
  togglePiP,
  setVolume,
  setIsMuted,
}: UseKeyboardControlsProps) {
  const isSpaceHoldingRef = useRef(false);
  const spaceHoldTimerRef = useRef<NodeJS.Timeout | null>(null);
  const originalSpeedRef = useRef(1);
  const wasPlayingBeforeHoldRef = useRef(true);
  const holdSpeedRef = useRef(holdSpeed);
  holdSpeedRef.current = holdSpeed;
  const playbackSpeedRef = useRef(playbackSpeed);
  playbackSpeedRef.current = playbackSpeed;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) {
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (e.repeat) return;

        originalSpeedRef.current = playbackSpeedRef.current;
        wasPlayingBeforeHoldRef.current = !video.paused;

        spaceHoldTimerRef.current = setTimeout(() => {
          isSpaceHoldingRef.current = true;
          setIsSpeedBoostActive(true);
          if (videoRef.current) {
            videoRef.current.playbackRate = holdSpeedRef.current;
            if (videoRef.current.paused) {
              videoRef.current.play().catch(() => {});
              setIsPlaying(true);
            }
          }
        }, 200);
        return;
      }

      switch (e.key.toLowerCase()) {
        case "k":
          e.preventDefault();
          setIsPlaying(!isPlayingRef.current);
          break;
        case "f":
          e.preventDefault();
          toggleFullScreen();
          break;
        case "t":
          e.preventDefault();
          setIsWideMode((prev) => !prev);
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          triggerVolumeHUD();
          break;
        case "i":
          e.preventDefault();
          togglePiP();
          break;
        case "j":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case "l":
          e.preventDefault();
          video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
          break;
        case "arrowleft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          break;
        case "arrowright":
          e.preventDefault();
          video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
          break;
        case "arrowup":
          e.preventDefault();
          if (video) {
            const nextVol = Math.min(1, Math.round((video.volume + 0.05) * 100) / 100);
            video.volume = nextVol;
            video.muted = false;
            setVolume(nextVol);
            setIsMuted(false);
            triggerVolumeHUD();
          }
          break;
        case "arrowdown":
          e.preventDefault();
          if (video) {
            const nextVol = Math.max(0, Math.round((video.volume - 0.05) * 100) / 100);
            video.volume = nextVol;
            if (nextVol === 0) {
              video.muted = true;
              setIsMuted(true);
            } else {
              video.muted = false;
              setIsMuted(false);
            }
            setVolume(nextVol);
            triggerVolumeHUD();
          }
          break;
        case ">":
          e.preventDefault();
          handleSpeedChange(Math.min(2, playbackSpeedRef.current + 0.25));
          break;
        case "<":
          e.preventDefault();
          handleSpeedChange(Math.max(0.25, playbackSpeedRef.current - 0.25));
          break;
        default:
          if (e.key >= "0" && e.key <= "9" && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            const percent = Number(e.key) / 10;
            if (video.duration) {
              video.currentTime = video.duration * percent;
            }
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) {
        return;
      }

      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (spaceHoldTimerRef.current) {
          clearTimeout(spaceHoldTimerRef.current);
          spaceHoldTimerRef.current = null;
        }

        if (isSpaceHoldingRef.current) {
          isSpaceHoldingRef.current = false;
          setIsSpeedBoostActive(false);
          if (videoRef.current) {
            videoRef.current.playbackRate = originalSpeedRef.current;
            if (!wasPlayingBeforeHoldRef.current) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        } else {
          setIsPlaying(!isPlayingRef.current);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    videoRef,
    setIsPlaying,
    handleSpeedChange,
    toggleFullScreen,
    setIsWideMode,
    toggleMute,
    triggerVolumeHUD,
    togglePiP,
    setVolume,
    setIsMuted,
  ]);
}