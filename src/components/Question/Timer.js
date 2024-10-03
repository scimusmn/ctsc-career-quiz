import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTimer, useSoundEffect } from '../../hooks';

function Timer({ settings, callback, stop, hideUI = false }) {
  const [playWaitSound, pauseWaitSound] = useSoundEffect(settings.sound);

  const timeLeft = useTimer(stop, callback, settings.time);

  // Attempt to play wait music when the component mounts
  useEffect(() => {
    playWaitSound();
  }, [playWaitSound]);

  // Pause wait music when stopped
  useEffect(() => {
    if (stop) {
      pauseWaitSound();
    }
  }, [stop, pauseWaitSound]);

  return (
    <button
      type='button'
      onClick={() => callback()}
      className={`fixed bottom-20 right-20 z-10 flex flex-col items-center justify-center ${hideUI && 'pointer-events-none hidden'}`}
    >
      <div className='flex h-20 w-20 items-center justify-center gap-2 rounded-full bg-red-200'>
        {timeLeft}
      </div>
    </button>
  );
}

export default Timer;
Timer.propTypes = {
  settings: PropTypes.instanceOf(Object).isRequired,
  callback: PropTypes.func.isRequired,
  stop: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/require-default-props
  hideUI: PropTypes.bool,
};
