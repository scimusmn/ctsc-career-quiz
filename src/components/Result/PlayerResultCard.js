import React from 'react';
import PropTypes from 'prop-types';
import Media from '../Media';

function PlayerResultCard({ player, result }) {
  return (
    <div className='mt-4 space-y-2'>
      <p className='font-bold'>{player.name}</p>
      {result?.text?.text && <p>{result.text.text}</p>}
      {result?.backgroundMedia && (
        <div className='mx-auto flex max-w-60 justify-center'>
          <Media media={result.backgroundMedia} />
        </div>
      )}
    </div>
  );
}

PlayerResultCard.propTypes = {
  player: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
  result: PropTypes.shape({
    text: PropTypes.shape({ text: PropTypes.string }),
    backgroundMedia: PropTypes.object,
  }).isRequired,
};

export default PlayerResultCard;
