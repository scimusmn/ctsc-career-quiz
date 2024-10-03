import React from 'react';
import PropTypes from 'prop-types';
import PlayerResultCard from './PlayerResultCard';

function ScoreResult({ score = 0, player, result }) {
  return (
    <div className='rounded-md bg-indigo-100 px-8 py-4'>
      <PlayerResultCard player={player} result={result} />
      <p className='mb-4 text-lg font-bold'>{score}</p>
    </div>
  );
}

ScoreResult.propTypes = {
  score: PropTypes.number.isRequired,
  player: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
  result: PropTypes.object.isRequired,
};

export default ScoreResult;
