import React from 'react';
import PropTypes from 'prop-types';
import PlayerResultCard from './PlayerResultCard';
import TopTagsList from './TopTagsList';

function TallyResult({ tagTallies, player, result }) {
  if (!tagTallies) return null;

  return (
    <div className='rounded-md bg-indigo-100 px-8 py-4'>
      <PlayerResultCard player={player} result={result} />
      <TopTagsList tallies={tagTallies} />
    </div>
  );
}

TallyResult.propTypes = {
  tagTallies: PropTypes.object.isRequired,
  player: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
  result: PropTypes.object.isRequired,
};

export default TallyResult;
