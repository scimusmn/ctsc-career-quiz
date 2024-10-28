import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useKeyPress, useSoundEffect } from '../../hooks';
import useQuizStore from '../../store';
import { preventWidow } from '../../helper';

function Options({
  options,
  currentQuizSettings,
  isSolutionPhase,
  revealSolution,
}) {
  const { inactivityCount, setInactivityCount, updateScore, updateTagTally } =
    useQuizStore();

  // Track index of submitted answers for each number player
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(() => {
    // Check if currentQuizSettings.players has elements
    if (currentQuizSettings?.players?.length) {
      // Create the initial object from currentQuizSettings.players
      return Object.fromEntries(
        currentQuizSettings.players.map((_, i) => [`p${i + 1}`, null])
      );
    }
    // Default initial state if currentQuizSettings.players is not available or empty
    return {};
  });

  const correctOptionIndex = options.findIndex(option => option.isCorrect);

  // Generate sound effects for each player
  const playInputSound = {
    p1: useSoundEffect(currentQuizSettings?.inputAnswerSoundEffect),
    p2: useSoundEffect(currentQuizSettings?.inputAnswerSoundEffect),
    p3: useSoundEffect(currentQuizSettings?.inputAnswerSoundEffect),
  };
  const [playSuccessSound] = useSoundEffect(
    currentQuizSettings?.correctAnswerSoundEffect
  );
  const [playFailSound] = useSoundEffect(
    currentQuizSettings?.wrongAnswerSoundEffect
  );

  // Function for selecting a option answer for player on keyboard input
  function choose(playerKey, optionIndex) {
    // Check if the selected option index is within the bounds of available options
    if (
      isSolutionPhase ||
      selectedOptionIndex[playerKey] !== null ||
      optionIndex >= options.length
    )
      return;
    playInputSound[playerKey][0](); // play answer input sound effect for player
    setSelectedOptionIndex(prevState => ({
      ...prevState,
      [playerKey]: optionIndex,
    }));
  }

  // A mapping from keystrokes to player and option index
  const keystrokeMapping = {};
  currentQuizSettings?.players?.forEach((player, playerIndex) => {
    // Directly use the keystroke fields from the player object
    const keystrokes = [
      player.keystrokeOptionOne,
      player.keystrokeOptionTwo,
      player.keystrokeOptionThree,
    ];
    keystrokes.forEach((keystroke, optionIndex) => {
      if (keystroke) {
        // Check if keystroke is not null or undefined
        keystrokeMapping[keystroke] = {
          playerIndex: playerIndex + 1, // Adjusting playerIndex to be 1-based
          optionIndex,
        };
      }
    });
  });

  // Listen for keypresses
  useKeyPress(Object.keys(keystrokeMapping), key => {
    const mapping = keystrokeMapping[key];
    if (mapping && !isSolutionPhase) {
      choose(`p${mapping.playerIndex}`, mapping.optionIndex);
    }
  });

  // Select options with click/touch on single player mode
  const handleSinglePlayerClick = index => {
    if (currentQuizSettings?.players?.length === 1) choose('p1', index);
  };

  // Function that checks all answers and updates the scores
  function submitAnswers() {
    const answersArray = Object.entries(selectedOptionIndex);
    let someCorrect = false;
    let allNull = true;
    const { isTallyBased } = currentQuizSettings;

    answersArray.forEach(([playerKey, submittedAnswerIndex]) => {
      if (isTallyBased && submittedAnswerIndex !== null) {
        const selectedTags = options[submittedAnswerIndex]?.tags;
        if (selectedTags?.length > 0) {
          updateTagTally(playerKey, selectedTags, currentQuizSettings);
          someCorrect = true;
        }
      } else {
        // Proceed with the existing point-based scoring
        const isCorrect = submittedAnswerIndex === correctOptionIndex;
        if (isCorrect) {
          updateScore(playerKey, currentQuizSettings);
          someCorrect = true;
        }
      }
      allNull = allNull && submittedAnswerIndex === null;
    });

    if (someCorrect) {
      playSuccessSound();
    } else if (!allNull) {
      // Play fail sound only if some answers were submitted
      playFailSound();
    }

    // Update inactivity count
    if (allNull) {
      setInactivityCount(inactivityCount + 1);
    } else {
      setInactivityCount(0);
    }
  }

  // If everyone has answered, or solution is shown after timeout
  useEffect(() => {
    const hasEveryoneAnswered =
      Object.keys(selectedOptionIndex).length &&
      Object.values(selectedOptionIndex).every(p => p !== null);
    // If answered and solution not shown, submit answers and reveal solution
    // else if solution shown after timer ends and not everyone answered, submit answers
    if (hasEveryoneAnswered && !isSolutionPhase) {
      submitAnswers();
      revealSolution();
    } else if (isSolutionPhase && !hasEveryoneAnswered) {
      submitAnswers();
    }
  }, [selectedOptionIndex, isSolutionPhase]);

  return (
    <div className='mx-auto mt-auto grid w-[1320px] grid-cols-2 content-center gap-x-[92px] gap-y-[52px] pb-[100px]'>
      {options &&
        options.map((option, index) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={`${option.text}-${index}`}
            type='button'
            disabled={isSolutionPhase}
            onClick={() => handleSinglePlayerClick(index)}
            className={`min-h-[138px] w-full rounded-[30px] border-[5px] px-[5px] active:scale-95 active:bg-white/60 disabled:pointer-events-none ${isSolutionPhase && selectedOptionIndex.p1 === index ? 'border-career-blue-100 bg-career-blue-500/80' : 'border-white/70 bg-white/70'} `}
          >
            <span
              className={`text-[40px]/[45px] font-bold ${isSolutionPhase && selectedOptionIndex.p1 === index && 'font-extrabold text-white [text-shadow:4px_4px_4px_#00000066]'}`}
            >
              {preventWidow(option.text)}
            </span>
          </button>
        ))}
    </div>
  );
}

export default Options;

Options.propTypes = {
  options: PropTypes.instanceOf(Array).isRequired,
  currentQuizSettings: PropTypes.instanceOf(Object).isRequired,
  isSolutionPhase: PropTypes.bool.isRequired,
  revealSolution: PropTypes.func.isRequired,
};
