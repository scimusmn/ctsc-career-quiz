import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useCaptions } from '../hooks';

export default function VoiceOverWithText({ content, callback = () => {} }) {
  const { voiceOverAudio, voiceOverText } = content;
  const [wrappedCaptions, setWrappedCaptions] = useState('');

  const videoSrc = voiceOverAudio ? voiceOverAudio.file.url : '';
  const trackSrc = voiceOverText ? voiceOverText.file.url : '';

  const videoRef = useRef();
  const sourceRef = useRef();
  const trackRef = useRef();
  const captions = useCaptions(videoRef);

  const [errorInteract, setErrorInteract] = useState(false);

  useEffect(() => {
    setWrappedCaptions(captions);
  }, [captions]);

  // reload video and captions
  useEffect(() => {
    if (!videoSrc) {
      callback();
      return;
    }

    function reloadVideo() {
      videoRef.current.pause();
      sourceRef.current.setAttribute('src', videoSrc);
      trackRef.current.setAttribute('src', trackSrc);
      videoRef.current.load();
      // videoRef.current.play();
      videoRef.current.play().catch(e => {
        if (e.name === 'NotAllowedError') {
          // Handle the situation where the user hasn't interacted yet.
          // You might show a UI element asking them to start playback, for example.
          setErrorInteract(true);
        } else {
          // Handle other kinds of errors.
          console.error('Playback failed:', e);
        }
      });
    }

    reloadVideo();
    setWrappedCaptions('');
  }, [videoSrc]);

  return (
    <>
      <video
        crossOrigin='anonymous'
        ref={videoRef}
        controls={errorInteract}
        preload='metadata'
        autoPlay
        muted={errorInteract}
        onEnded={callback}
        className={
          errorInteract ? 'absolute bottom-0 my-4 h-14 w-full' : 'hidden'
        }
      >
        <source
          ref={sourceRef}
          src={videoSrc}
          type={voiceOverAudio ? voiceOverAudio.file.contentType : 'audio/mp3'}
        />
        <track src={trackSrc} kind='captions' ref={trackRef} default />
      </video>

      {captions && <p className='italic'>{wrappedCaptions}</p>}
    </>
  );
}

VoiceOverWithText.propTypes = {
  content: PropTypes.instanceOf(Object).isRequired,
  callback: PropTypes.func.isRequired,
};
