import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useKeyPress } from '../../hooks';
import Timer from '../Question/Timer';
import Media from '../Media';
import VoiceOverWithText from '../VoiceOverWithText';
import useQuizStore from '../../store';
import Options from '../Question/Options';
import TriviaMessageBox from './TriviaMessageBox';
import TriviaAstronautBubble from './TriviaAstronautBubble';

// Enumeration for question phases
const QuestionPhase = {
  VIEW: 'VIEW', // Before showing the timer, waiting on user action or narration
  TIMER: 'TIMER', // While the timer is running before the answer is revealed
  SOLUTION: 'SOLUTION', // After the answer is revealed
};

function TriviaQuestionContent({ content, parentQuiz, currentPath }) {
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
      <div className='flex min-h-screen flex-col items-center justify-end overflow-hidden pb-[25px] font-GT-Walsheim text-white'>
        {/* Background image */}
        {media && (
          <Media
            media={
              phase === QuestionPhase.SOLUTION && answer ? answer?.media : media
            }
            className='fixed left-0 top-0 -z-[1] h-[1920px] w-[1080px] bg-black object-cover'
          />
        )}

        {/* Answer Text in Solution phase */}
        {phase === QuestionPhase.SOLUTION && answer?.text && (
          <div className='mb-[101px] flex min-h-[672px] w-[885px] flex-col justify-center rounded-[15px] border-[5px] border-black/25 bg-black/25 px-[60px]'>
            <h2
              className='pb-[20px] text-[60px]/[68.7px] font-medium'
              dangerouslySetInnerHTML={{
                __html: answer.text.text.replace('\n', '<br /><br />'),
              }}
            />
          </div>
        )}

        {/* Answer Voiceover */}
        {phase === QuestionPhase.SOLUTION && answer?.voiceOverAudio && (
          <VoiceOverWithText
            content={{ voiceOverAudio: answer.voiceOverAudio }}
            callback={() => goToNextQuestion(currentPath, parentQuiz)}
          />
        )}

        {/* Question Voiceover */}
        {phase === QuestionPhase.VIEW && voiceOverAudio && (
          <VoiceOverWithText
            content={{ voiceOverAudio }}
            callback={() => setPhase(QuestionPhase.TIMER)}
          />
        )}

        {/* Question & Options section */}
        <TriviaMessageBox>
          {/* Question Text */}
          {text?.text && <TriviaAstronautBubble text={text.text} />}

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

          {phase === QuestionPhase.SOLUTION && (
            <button
              type='button'
              onClick={() => goToNextQuestion(currentPath, parentQuiz)}
              className='absolute bottom-[14px] left-0 w-full text-[40px]/[45.8px] font-medium italic active:scale-95'
            >
              Tap to continue
            </button>
          )}
        </TriviaMessageBox>
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

TriviaQuestionContent.propTypes = {
  content: PropTypes.instanceOf(Object).isRequired,
  parentQuiz: PropTypes.instanceOf(Object).isRequired,
  currentPath: PropTypes.string.isRequired,
};

export default TriviaQuestionContent;
