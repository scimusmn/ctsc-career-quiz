import React from 'react';
import PropTypes from 'prop-types';
import { useKeyPress } from '../../hooks';
import VoiceOverWithText from '../VoiceOverWithText';
import Media from '../Media';
import TriviaMessageBox from './TriviaMessageBox';
import TriviaAstronautBubble from './TriviaAstronautBubble';

function TriviaQuestionIntro({ content, startQuestion }) {
  const { title, media } = content;
  useKeyPress([' '], () => startQuestion()); // skip narration and start question on space bar

  const voiceOverObject = {
    voiceOverAudio: content.voiceOverAudio,
    voiceOverText: content.captionsFile,
  };

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-end pb-[25px] font-GT-Walsheim text-white'>
      {media && (
        <Media
          media={media}
          className='fixed left-0 top-0 -z-[1] h-[1920px] w-[1080px] bg-black object-cover'
        />
      )}

      <TriviaMessageBox>
        <TriviaAstronautBubble text={title} />

        <button
          type='button'
          onClick={() => startQuestion()}
          className='mt-auto w-full text-[48px] font-medium italic active:scale-95'
        >
          Tap to continue
        </button>
      </TriviaMessageBox>

      {(content.voiceOverAudio || content.captionsFile) && (
        <VoiceOverWithText
          content={voiceOverObject}
          callback={() => startQuestion()}
        />
      )}
    </div>
  );
}

TriviaQuestionIntro.propTypes = {
  content: PropTypes.instanceOf(Object).isRequired,
  startQuestion: PropTypes.func.isRequired,
};

export default TriviaQuestionIntro;
