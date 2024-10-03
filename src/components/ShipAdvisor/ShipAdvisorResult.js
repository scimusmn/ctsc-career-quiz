import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Media from '../Media';

export default function ShipAdvisorResult({ result, retryButtonText }) {
  const { backgroundMedia, text } = result || {};

  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center text-center font-GT-Walsheim'>
      {backgroundMedia && (
        <Media
          media={backgroundMedia}
          className='fixed left-0 top-0 -z-[1] h-[1920px] w-[1080px] bg-black object-cover'
        />
      )}

      {text?.text && (
        <div className='mt-auto w-full bg-gradient-to-b from-transparent via-black/50 via-[percentage:8%_92%] to-transparent pb-[80px] pt-[60px]'>
          <p className='mx-auto w-[955px] text-[45px]/[51.52px] font-medium text-ship-yellow'>
            {text.text}
          </p>
        </div>
      )}

      <Link
        className='mb-[61px] mt-auto h-[110px] w-[697px] rounded-[40px] border-[10px] border-white/50 bg-[#FFB361]/80 active:scale-95 active:bg-[#FFA23E]/80'
        to='/'
      >
        <span className='text-[55px] font-bold text-white [text-shadow:4px_6px_8px_#00000099]'>
          {retryButtonText || 'Retry'}
        </span>
      </Link>
    </div>
  );
}

ShipAdvisorResult.propTypes = {
  result: PropTypes.object.isRequired,
  retryButtonText: PropTypes.string.isRequired,
};
