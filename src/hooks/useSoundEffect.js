import { useState, useEffect, useCallback } from 'react';

const useSoundEffect = (sound, loop = false) => {
  const [audio, setAudio] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (sound?.file?.url) {
      const newAudio = new Audio(sound.file.url);
      newAudio.loop = loop;
      newAudio.volume = 0.5;
      setAudio(newAudio);
    }
  }, [sound, loop]);

  const play = useCallback(() => {
    if (audio) {
      audio.play().catch(error => {
        // Silently catch the error to prevent it from being thrown
        console.warn('Audio playback failed:', error);
      });
      setPlaying(true);
    }
  }, [audio]);

  const pause = useCallback(() => {
    if (audio) {
      audio.pause();
      setPlaying(false);
    }
  }, [audio]);

  useEffect(() => {
    if (audio) {
      if (playing) {
        play();
      } else {
        pause();
      }
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [playing, audio, play, pause]);

  return [play, pause];
};

export default useSoundEffect;
