import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RichText from '../RichText';
import Media from '../Media';

export default function LifeDetectiveOptionsContent({
  options = [],
  isSolutionPhase = false,
  handleSinglePlayerClick,
}) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState();

  // Generates the background color for options text
  const getBackgroundColor = index => {
    let bgColor = 'bg-white/30'; // default background color

    if (isSolutionPhase) {
      const correctOptionSelected = options[index].isCorrect;

      if (correctOptionSelected) {
        bgColor = 'bg-correct-answer';
      } else if (selectedOptionIndex === index && !correctOptionSelected) {
        bgColor = 'bg-wrong-answer';
      }
    }

    return bgColor;
  };

  // Position each option in order
  const optionPositionStyles = index => {
    let styles = '';

    const totalOptions = options.length;

    const positions = [
      'bottom-[683px] left-[30px]',
      'bottom-[290px] left-[193px]',
      'bottom-[419px] right-[32px]',
      'bottom-[39px] right-[48px]',
    ];

    if (totalOptions === 4) {
      styles = positions[index];
    } else if (totalOptions === 3) {
      styles = index === 0 ? positions[index] : positions[index + 1];
    } else if (totalOptions === 2) {
      styles = index === 0 ? positions[index] : positions[index + 2];
    }

    return styles;
  };

  return (
    <div className='relative mt-auto w-[1080px] font-GT-Walsheim'>
      {options &&
        options.map(({ text, richText, image }, index) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={`${text || 'option'}-${index}`}
            type='button'
            disabled={isSolutionPhase}
            onClick={() => {
              handleSinglePlayerClick(index);
              setSelectedOptionIndex(index);
            }}
            className={`group absolute flex w-max flex-col items-center justify-center ${optionPositionStyles(index)}`}
          >
            {/* Option text */}
            <div
              className={`w-max min-w-[353px] rounded-[20px] p-[15px] pb-[25px] text-left text-[25px]/[28.62px] backdrop-blur-[2px] disabled:pointer-events-none group-enabled:group-active:scale-95 ${index === 0 && 'max-w-[353px]'} ${getBackgroundColor(index)}`}
            >
              {richText ? (
                <div className='[&>ul]:list-["-"] [&>ul]:pl-3 [&>ul]:text-[22px]/[25.19px]'>
                  <RichText content={richText} />
                </div>
              ) : (
                <p>{text || `Option ${index + 1}`}</p>
              )}
            </div>

            {/* Option media */}
            {image && (
              <Media
                media={image}
                className='mx-auto mt-[25px] max-w-[180px]'
              />
            )}
          </button>
        ))}
    </div>
  );
}

LifeDetectiveOptionsContent.propTypes = {
  options: PropTypes.instanceOf(Array).isRequired,
  isSolutionPhase: PropTypes.bool.isRequired,
  handleSinglePlayerClick: PropTypes.func.isRequired,
};
