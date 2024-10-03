import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useKeyPress } from '../../hooks';
import Timer from '../Question/Timer';
import Media from '../Media';
import VoiceOverWithText from '../VoiceOverWithText';
import useQuizStore from '../../store';
import Options from '../Question/Options';

// Enumeration for question phases
const QuestionPhase = {
  VIEW: 'VIEW', // Before showing the timer, waiting on user action or narration
  TIMER: 'TIMER', // While the timer is running before the answer is revealed
  SOLUTION: 'SOLUTION', // After the answer is revealed
};

function ShipAdvisorQuestionContent({ content, parentQuiz, currentPath }) {
  const { text, media, answer, options, voiceOverAudio } = content;
  const [phase, setPhase] = useState(QuestionPhase.VIEW);

  const { goToNextQuestion, inactivityCount } = useQuizStore();
  // Key press logic to handle phase transitions and navigation
  useKeyPress([' '], () => {
    if (phase === QuestionPhase.SOLUTION) {
      goToNextQuestion(currentPath, parentQuiz);
    } else {
      setPhase(QuestionPhase.TIMER); // Move from VIEW to TIMER or TIMER to SOLUTION
    }
  });

  // Effect for handling inactivity
  useEffect(() => {
    if (phase === QuestionPhase.SOLUTION && inactivityCount === 2) {
      window.location.replace('/');
    }
  }, [phase, inactivityCount]);

  return (
    <>
      <div className='flex min-h-screen flex-col items-center justify-between overflow-hidden pb-[95px] pt-[195px] font-GT-Walsheim text-white'>
        {/* Static background image */}
        <img
          src='/space_advisor_question_bg.png'
          alt='Background'
          className='fixed left-0 top-0 -z-[1] h-[1920px] w-[1080px] bg-black object-cover'
        />

        {/* Question voiceover */}
        {text?.text && (
          <h2 className='h-[165px] w-[834px] text-[60px]/[68.7px] font-bold'>
            {text.text}
          </h2>
        )}

        {/* Question media */}
        {media && (
          <Media
            media={media}
            className='my-[130px] h-[660px] w-[765px] object-cover'
          />
        )}

        {phase === QuestionPhase.VIEW && voiceOverAudio && (
          <VoiceOverWithText
            content={{ voiceOverAudio }}
            callback={() => setPhase(QuestionPhase.TIMER)}
          />
        )}

        {/* Options */}
        {options && (
          <Options
            options={options}
            currentQuizSettings={parentQuiz.quizSettings}
            currentQuizSlug={parentQuiz.slug}
            isSolutionPhase={phase === QuestionPhase.SOLUTION}
            revealSolution={() => setPhase(QuestionPhase.SOLUTION)}
          />
        )}

        {/* Answer voiceover */}
        {phase === QuestionPhase.SOLUTION && answer?.voiceOverAudio && (
          <VoiceOverWithText
            content={{ voiceOverAudio: answer.voiceOverAudio }}
            callback={() => goToNextQuestion(currentPath, parentQuiz)}
          />
        )}
      </div>

      {/* Timer */}
      {phase === QuestionPhase.TIMER && (
        <Timer
          settings={{
            time: parentQuiz.quizSettings.timerPerQuestion,
            sound: parentQuiz.quizSettings.countdownTimerSoundEffect,
          }}
          callback={() => setPhase(QuestionPhase.SOLUTION)}
          stop={phase !== QuestionPhase.TIMER}
          hideUI
        />
      )}
    </>
  );
}

ShipAdvisorQuestionContent.propTypes = {
  content: PropTypes.instanceOf(Object).isRequired,
  parentQuiz: PropTypes.instanceOf(Object).isRequired,
  currentPath: PropTypes.string.isRequired,
};

export default ShipAdvisorQuestionContent;
