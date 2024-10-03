import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useKeyPress } from '../../hooks';
import Timer from './Timer';
import Media from '../Media';
import VoiceOverWithText from '../VoiceOverWithText';
import useQuizStore from '../../store';
import Options from './Options';
import GameState from '../Helper/GameState';

// Enumeration for question phases
const QuestionPhase = {
  VIEW: 'VIEW', // Before showing the timer, waiting on user action or narration
  TIMER: 'TIMER', // While the timer is running before the answer is revealed
  SOLUTION: 'SOLUTION', // After the answer is revealed
};

function QuestionContent({ content, parentQuiz, currentPath }) {
  const { text, media, answer, options, voiceOverAudio, hint } = content;
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
      <div className='mt-8'>
        {/* Question */}
        <div className='space-y-2'>
          <h2 className='text-xl font-bold'>Question</h2>
          {text.text && <p>{text.text}</p>}
          {hint && (
            <span className='bg-ship-yellow-200 text-xs'>Hint: {hint}</span>
          )}
          {media && <Media media={media} />}
        </div>
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

        <hr className='my-5' />

        {/* Answer */}
        {phase === QuestionPhase.SOLUTION && (
          <div className='space-y-2'>
            <h2 className='text-xl font-bold'>Answer</h2>
            {answer && <p>{answer.text.text}</p>}
            {answer && answer.media && <Media media={answer.media} />}
            {answer && answer.voiceOverAudio && (
              <VoiceOverWithText
                content={{ voiceOverAudio: answer.voiceOverAudio }}
                callback={() => goToNextQuestion(currentPath, parentQuiz)}
              />
            )}
          </div>
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
        />
      )}

      {/* Inactivity count */}
      <div className='bg-ship-orange-200 fixed right-20 top-20 flex flex-col items-center justify-center gap-2 rounded-md p-4'>
        <p>Inactivity Count: {inactivityCount}</p>
        <span className='max-w-[200px] text-center text-xs italic'>
          Number of unanswered questions. (Displaying for testing only)
        </span>
      </div>

      {/* Game State */}
      <GameState quizSettings={parentQuiz.quizSettings} />
    </>
  );
}

QuestionContent.propTypes = {
  content: PropTypes.instanceOf(Object).isRequired,
  parentQuiz: PropTypes.instanceOf(Object).isRequired,
  currentPath: PropTypes.string.isRequired,
};

export default QuestionContent;
