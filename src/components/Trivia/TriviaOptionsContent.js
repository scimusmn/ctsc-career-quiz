import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function TriviaOptionsContent({
  options = [],
  isSolutionPhase = false,
  handleSinglePlayerClick,
}) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState();

  // Generates dynamic styles based on option state
  const getDynamicStyle = (index, type) => {
    // Default styles
    const styles = {
      bgColor: 'bg-ship-yellow',
      textColor: 'text-black',
      borderColor: 'border-l-ship-yellow',
      fontWeight: 'font-normal',
    };

    if (isSolutionPhase) {
      const correctOptionSelected = options[index].isCorrect;

      if (correctOptionSelected) {
        styles.bgColor = 'bg-correct-answer';
        styles.textColor = 'text-white';
        styles.borderColor = 'border-l-correct-answer';
        styles.fontWeight = 'font-bold';
      } else if (selectedOptionIndex === index && !correctOptionSelected) {
        styles.bgColor = 'bg-wrong-answer';
        styles.borderColor = 'border-l-wrong-answer';
        styles.fontWeight = 'font-bold';
      }
    }

    return styles[type];
  };

  return (
    <div className='my-auto flex flex-col gap-[34px] pb-[88px] font-GT-Walsheim'>
      {options.map((option, index) => (
        <button
          // eslint-disable-next-line react/no-array-index-key
          key={`${option?.text || 'option'}-${index}`}
          type='button'
          disabled={isSolutionPhase}
          onClick={() => {
            handleSinglePlayerClick(index);
            setSelectedOptionIndex(index);
          }}
          className={`flex items-center text-left text-[36px]/[41.22px] ${getDynamicStyle(index, 'textColor')} ${getDynamicStyle(index, 'fontWeight')} ${!isSolutionPhase && 'active:scale-95'}`}
        >
          <div
            className={`ml-auto flex min-h-[79px] w-[832px] flex-col justify-center rounded-full px-[68px] py-[14px] disabled:pointer-events-none ${getDynamicStyle(index, 'bgColor')}`}
          >
            <p>{option?.text || `Option ${index + 1}`}</p>
          </div>

          <div
            className={`-ml-[11px] h-0 w-0 border-y-[22px] border-l-[44px] border-y-transparent ${getDynamicStyle(index, 'borderColor')}`}
          />
        </button>
      ))}
    </div>
  );
}

TriviaOptionsContent.propTypes = {
  options: PropTypes.instanceOf(Array).isRequired,
  isSolutionPhase: PropTypes.bool.isRequired,
  handleSinglePlayerClick: PropTypes.func.isRequired,
};
