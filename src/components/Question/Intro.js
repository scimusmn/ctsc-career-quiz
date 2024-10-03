import React from 'react';
import PropTypes from 'prop-types';
import { useKeyPress } from '../../hooks';
import VoiceOverWithText from '../VoiceOverWithText';

function Intro({ content, startQuestion }) {
  useKeyPress([' '], () => startQuestion()); // skip narration and start question on space bar

  const voiceOverObject = {
    voiceOverAudio: content.voiceOverAudio,
    voiceOverText: content.captionsFile,
  };

  return (
    <div className='mt-8 space-y-4'>
      <h2 className='text-xl font-bold'>Question Intro</h2>
      {content && <p>{content.title}</p>}

      {(content.voiceOverAudio || content.captionsFile) && (
        <div className='space-y-1 border p-4'>
          <p className='font-semibold'>Intro voiceover captions</p>
          <VoiceOverWithText
            content={voiceOverObject}
            callback={() => startQuestion()}
          />
        </div>
      )}
    </div>
  );
}

Intro.propTypes = {
  content: PropTypes.instanceOf(Object).isRequired,
  startQuestion: PropTypes.func.isRequired,
};

export default Intro;
