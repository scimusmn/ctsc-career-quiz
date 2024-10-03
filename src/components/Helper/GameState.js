import React from 'react';
import PropTypes from 'prop-types';
import useQuizStore from '../../store';

function GameState({ quizSettings }) {
  const { isTallyBased, players } = quizSettings;
  const { scores, tagTallies } = useQuizStore();

  const entries = Object.entries(isTallyBased ? tagTallies : scores);

  return (
    <div className='fixed right-20 top-[26rem] flex flex-col items-center justify-center gap-2 rounded-md bg-pink-100 p-4'>
      <h2 className='mb-4'>
        Game State ({isTallyBased ? 'Tally Tags' : 'Scores'})
      </h2>
      {entries.length !== 0 ? (
        <ul className='w-[300px] space-y-6 text-sm'>
          {entries.map(([playerKey, value], index) => (
            <li key={playerKey}>
              <span className='mb-2 inline-block font-bold'>
                {players[index].name}
              </span>
              <span>
                {isTallyBased ? (
                  <div className='flex w-full flex-wrap gap-2'>
                    {Object.entries(value).map(([tag, count]) => (
                      <span
                        key={tag}
                        className='rounded bg-pink-500 px-2 py-1 text-xs text-white'
                      >
                        {`${tag} (${count})`}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div>{value}</div>
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className='w-[300px] text-center text-sm'>NULL</div>
      )}
    </div>
  );
}

export default GameState;

GameState.propTypes = {
  quizSettings: PropTypes.instanceOf(Object).isRequired,
};
