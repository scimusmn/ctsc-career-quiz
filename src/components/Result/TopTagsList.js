import React from 'react';
import PropTypes from 'prop-types';

function TopTagsList({ tallies }) {
  const maxCount = Math.max(...Object.values(tallies));
  return (
    <div className='my-4'>
      <p className='font-bold'>Top Tags</p>
      <div className='mt-2 flex max-w-[300px] flex-wrap justify-center gap-2'>
        {Object.entries(tallies)
          .filter(([, count]) => count === maxCount)
          .map(([tag, count]) => (
            <span
              key={tag}
              className='rounded bg-indigo-500 px-2 py-1 text-sm text-white'
            >
              {tag} ({count})
            </span>
          ))}
      </div>
    </div>
  );
}

TopTagsList.propTypes = {
  tallies: PropTypes.object.isRequired,
};

export default TopTagsList;
