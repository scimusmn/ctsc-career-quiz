import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function ShipAdvisorOptionsContent({
  options = [],
  isSolutionPhase = false,
  handleSinglePlayerClick,
}) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState();

  return (
    <div className='flex flex-col gap-[37px] font-GT-Walsheim'>
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
          className={`h-[108px] w-[765px] rounded-full px-[58px] text-left text-[40px]/[45.8px] active:scale-95 active:bg-ship-gray-dark disabled:pointer-events-none ${
            isSolutionPhase && selectedOptionIndex === index
              ? 'bg-ship-yellow/90 font-bold text-black'
              : 'bg-ship-gray font-medium text-white'
          }`}
        >
          {option?.text || `Option ${index + 1}`}
        </button>
      ))}
    </div>
  );
}

ShipAdvisorOptionsContent.propTypes = {
  options: PropTypes.instanceOf(Array).isRequired,
  isSolutionPhase: PropTypes.bool.isRequired,
  handleSinglePlayerClick: PropTypes.func.isRequired,
};
