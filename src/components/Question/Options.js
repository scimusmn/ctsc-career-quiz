import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useKeyPress, useSoundEffect } from '../../hooks';
import useQuizStore from '../../store';
import Media from '../Media';
import RichText from '../RichText';
import WhoAnsweredState from '../Helper/WhoAnsweredState';
import ShipAdvisorOptionsContent from '../ShipAdvisor/ShipAdvisorOptionsContent';
import LifeDetectiveOptionsContent from '../LifeDetective/LifeDetectiveOptionsContent';
import TriviaOptionsContent from '../Trivia/TriviaOptionsContent';

function Options({
  options,
  currentQuizSettings,
  currentQuizSlug,
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

  if (currentQuizSlug === 'ship-advisor') {
    return (
      <ShipAdvisorOptionsContent
        options={options}
        currentQuizSettings={currentQuizSettings}
        handleSinglePlayerClick={handleSinglePlayerClick}
        isSolutionPhase={isSolutionPhase}
      />
    );
  }

  if (currentQuizSlug === 'life-detective') {
    return (
      <LifeDetectiveOptionsContent
        options={options}
        currentQuizSettings={currentQuizSettings}
        handleSinglePlayerClick={handleSinglePlayerClick}
        isSolutionPhase={isSolutionPhase}
      />
    );
  }

  if (currentQuizSlug === 'trivia') {
    return (
      <TriviaOptionsContent
        options={options}
        currentQuizSettings={currentQuizSettings}
        handleSinglePlayerClick={handleSinglePlayerClick}
        isSolutionPhase={isSolutionPhase}
      />
    );
  }

  return (
    <>
      <div className='mt-8 space-y-2'>
        <h3 className='text-xl font-bold'>Options</h3>
        <div className='flex max-w-xs flex-col gap-2'>
          {options &&
            options.map((option, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={`${option.text}-${index}`}
                className='flex items-center gap-4'
              >
                <button
                  type='button'
                  disabled={isSolutionPhase}
                  onClick={() => handleSinglePlayerClick(index)}
                  className={`btn w-full disabled:pointer-events-none ${isSolutionPhase && option.isCorrect && 'bg-green-200'} `}
                >
                  <div>
                    {option.richText ? (
                      <RichText content={option.richText} />
                    ) : (
                      option.text
                    )}
                  </div>
                  {option.image && <Media media={option.image} />}
                </button>
                <span>
                  {!currentQuizSettings.isTallyBased &&
                    isSolutionPhase &&
                    (option.isCorrect ? '✅' : '❌')}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* State of players and questions answered */}
      <WhoAnsweredState
        selectedOptionIndex={selectedOptionIndex}
        currentQuizSettings={currentQuizSettings}
      />
    </>
  );
}

export default Options;

Options.propTypes = {
  options: PropTypes.instanceOf(Array).isRequired,
  currentQuizSettings: PropTypes.instanceOf(Object).isRequired,
  currentQuizSlug: PropTypes.string.isRequired,
  isSolutionPhase: PropTypes.bool.isRequired,
  revealSolution: PropTypes.func.isRequired,
};
