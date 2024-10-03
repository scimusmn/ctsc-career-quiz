import React from 'react';
import PropTypes from 'prop-types';

export default function TriviaAstronautBubble({ text }) {
  return (
    <div className='mb-[50px]'>
      <p className='-mb-[6px] ml-[190px] text-[35px] font-medium text-[#B2B2B2]'>
        Astronaut
      </p>

      <div className='flex'>
        <img
          src='/astronaut_bubble.png'
          alt='astronaut'
          className='-mt-1 size-[118px]'
        />

        <div className='ml-[7px] mt-[35px] h-0 w-0 border-y-[20px] border-r-[38px] border-y-transparent border-r-[#D9D9D9]/70' />

        <div className='flex min-h-[98px] w-[710px] flex-col justify-center rounded-[20px] bg-[#D9D9D9]/70 px-[24px] py-[12px]'>
          <p className='text-[36px]/[41.22px] font-normal text-black'>{text}</p>
        </div>
      </div>
    </div>
  );
}

TriviaAstronautBubble.propTypes = {
  text: PropTypes.string.isRequired,
};
