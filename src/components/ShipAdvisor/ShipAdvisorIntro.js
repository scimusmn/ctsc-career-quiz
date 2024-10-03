import React from 'react';
import PropTypes from 'prop-types';
import Media from '../Media';

export default function ShipAdvisorIntro({ contentfulQuiz, startQuiz }) {
  const { title, text, backgroundMedia } = contentfulQuiz || {};

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center pb-[254px] pt-[361px] text-center font-GT-Walsheim text-white'>
      {backgroundMedia && (
        <Media
          media={backgroundMedia}
          className='fixed left-0 top-0 -z-[1] h-[1920px] w-[1080px] bg-black object-cover'
        />
      )}

      <h1 className='w-[800px] pb-[38px] text-[110px]/[125.95px] font-bold tracking-[1.1px] shadow-[4px,4px,10px,rgba(13,132,176,0.20)]'>
        {title}
      </h1>

      <div className='mx-auto h-[10px] w-[800px] rounded bg-ship-yellow' />

      {text?.text && (
        <p className='ml-[50px] mt-[85px] w-[840px] text-left text-[50px]/[57.25px] font-medium'>
          {text.text}
        </p>
      )}

      <button
        type='button'
        className='mt-auto h-[80px] w-[400px] rounded-full bg-ship-yellow text-[36px]/[41.22px] font-bold text-black active:scale-95 active:bg-ship-yellow-dark'
        onClick={() => startQuiz(contentfulQuiz)}
      >
        Tap to begin
      </button>
    </div>
  );
}

ShipAdvisorIntro.propTypes = {
  contentfulQuiz: PropTypes.object.isRequired,
  startQuiz: PropTypes.func.isRequired,
};
