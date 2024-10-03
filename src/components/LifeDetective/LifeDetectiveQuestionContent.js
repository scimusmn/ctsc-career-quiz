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

function LifeDetectiveQuestionContent({ content, parentQuiz, currentPath }) {
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
      <div className='flex min-h-screen flex-col overflow-hidden font-GT-Walsheim text-white'>
        {/* Background image (changes to answer media in solution phase) */}
        {media && (
          <Media
            media={
              phase === QuestionPhase.SOLUTION && answer ? answer?.media : media
            }
            className='fixed left-0 top-0 -z-[1] h-[1920px] w-[1080px] bg-black object-cover'
          />
        )}

        {/* Question Text */}
        {phase !== QuestionPhase.SOLUTION && text?.text && (
          <div className='mt-[150px] w-[615px] bg-black/60 px-[29px] py-[38px] text-[35px]/[40.07px]'>
            <h2 className='font-medium'>{text.text}</h2>
            <p className='font-bold'>Tap on your answer!</p>
          </div>
        )}

        {/* Answer Text */}
        {phase === QuestionPhase.SOLUTION && answer?.text && (
          <div className='mx-auto mt-[124px] flex min-h-[579px] w-[812px] flex-col justify-center rounded-[20px] border-[5px] border-white/70 bg-[#575757]/60 px-[63px] py-[73px]'>
            <h2
              className='text-[45px]/[51.52px] font-medium'
              dangerouslySetInnerHTML={{
                __html: answer.text.text.replace('\n', '<br /><br />'),
              }}
            />
          </div>
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

        {/* Question Voiceover */}
        {phase === QuestionPhase.VIEW && voiceOverAudio && (
          <VoiceOverWithText
            content={{ voiceOverAudio }}
            callback={() => setPhase(QuestionPhase.TIMER)}
          />
        )}

        {/* Answer Voiceover */}
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

LifeDetectiveQuestionContent.propTypes = {
  content: PropTypes.instanceOf(Object).isRequired,
  parentQuiz: PropTypes.instanceOf(Object).isRequired,
  currentPath: PropTypes.string.isRequired,
};

export default LifeDetectiveQuestionContent;
