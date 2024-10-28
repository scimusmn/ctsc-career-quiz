import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useKeyPress } from '../../hooks';
import Timer from './Timer';
import useQuizStore from '../../store';
import Options from './Options';
import Media from '../Media';
import VoiceOverWithText from '../VoiceOverWithText';
import { preventWidow } from '../../helper';

// Enumeration for question phases
const QuestionPhase = {
  VIEW: 'VIEW', // Before showing the timer, waiting on user action or narration
  TIMER: 'TIMER', // While the timer is running before the answer is revealed
  SOLUTION: 'SOLUTION', // After the answer is revealed
};

function QuestionContent({ content, parentQuiz, currentPath, totalQuestions }) {
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

  // Get the current question index from the URL path
  const pathSegments =
    typeof window !== 'undefined' &&
    window.location.pathname.split('/').filter(Boolean);
  const questionIndex = pathSegments[pathSegments.length - 1];

  // Effect for handling inactivity
  useEffect(() => {
    if (phase === QuestionPhase.SOLUTION && inactivityCount === 2) {
      if (typeof window !== 'undefined') window.location.replace('/');
    }
  }, [phase, inactivityCount]);

  return (
    <>
      <div className='flex min-h-screen w-full flex-col items-center justify-center font-GT-Walsheim text-white'>
        {/* Background image */}
        {media && (
          <Media
            media={media}
            className='!fixed left-0 top-0 -z-[1] h-[1080px] w-[1920px] bg-black object-cover'
          />
        )}

        {/* Progress bar */}
        <div className='mb-[16px] h-[35px] w-[1648px] rounded-[30px] border-[5px] border-white p-[3px]'>
          <div
            className='h-full rounded-full bg-career-blue-100'
            style={{ width: `${(+questionIndex / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question title and options */}
        <div className='flex h-[824px] w-[1702px] flex-col rounded-[50px] border-[10px] border-white/50 bg-white/40 px-[87px] py-[40px] text-career-blue-900 shadow-[20px_20px_10px_10px_#00000066] backdrop-blur-[4px]'>
          {/* Progress counter */}
          <span className='text-[50px] font-bold'>
            {questionIndex}/{totalQuestions}:
          </span>

          {/* Title */}
          <h2 className='text-[70px]/[80px] font-bold'>
            {preventWidow(text?.text)}
          </h2>

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
        </div>

        {/* Question voiceover */}
        {phase === QuestionPhase.VIEW && voiceOverAudio && (
          <VoiceOverWithText
            content={{ voiceOverAudio }}
            callback={() => setPhase(QuestionPhase.TIMER)}
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

QuestionContent.propTypes = {
  content: PropTypes.instanceOf(Object).isRequired,
  parentQuiz: PropTypes.instanceOf(Object).isRequired,
  currentPath: PropTypes.string.isRequired,
  totalQuestions: PropTypes.number.isRequired,
};

export default QuestionContent;
