import React from 'react';
import PropTypes from 'prop-types';

export default function WhoAnsweredState({
  selectedOptionIndex,
  currentQuizSettings,
}) {
  return (
    <div className='fixed right-20 top-60 flex flex-col items-center justify-center gap-2 rounded-md bg-violet-200 p-4'>
      <div>
        {Object.keys(selectedOptionIndex).length !== 0 &&
          Object.entries(selectedOptionIndex).map((player, index) => (
            <div key={player} className='flex gap-2'>
              <input
                type='checkbox'
                name={`Player ${index + 1}`}
                value={`Player ${index + 1}`}
                defaultChecked={player[1] !== null}
              />
              <label htmlFor={`Player ${index + 1}`}>
                {currentQuizSettings.players[index].name}
              </label>
            </div>
          ))}
      </div>
      <p className='max-w-[200px] text-center text-xs italic'>
        Players and state of question answered or unanswered.
      </p>
    </div>
  );
}

WhoAnsweredState.propTypes = {
  selectedOptionIndex: PropTypes.instanceOf(Object).isRequired,
  currentQuizSettings: PropTypes.instanceOf(Object).isRequired,
};
