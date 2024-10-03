import React from 'react';
import PropTypes from 'prop-types';
import Media from '../Media';

export default function TriviaIntro({ contentfulQuiz, startQuiz }) {
  const { text, backgroundMedia } = contentfulQuiz || {};

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-end pb-[69px] font-GT-Walsheim text-white'>
      {backgroundMedia && (
        <Media
          media={backgroundMedia}
          className='fixed left-0 top-0 -z-[1] h-[1920px] w-[1080px] bg-black object-cover'
        />
      )}

      {text?.text && (
        <div className='mb-[106px] h-[796px] w-[885px] rounded-[15px] border-[5px] border-white/50 bg-white/25 pb-[145px] pl-[99px] pr-[71px] pt-[195px] backdrop-blur-sm'>
          <p
            className='text-left text-[50px]/[57.25px] font-medium'
            dangerouslySetInnerHTML={{
              __html: text.text.replace(/\n/g, '<br /><br />'),
            }}
          />
        </div>
      )}

      <button
        type='button'
        className='h-[110px] w-[509px] rounded-[40px] border-[10px] border-white/50 bg-white/30 active:scale-95 active:bg-white/40'
        onClick={() => startQuiz(contentfulQuiz)}
      >
        <span className='text-[46px] font-bold text-white [text-shadow:4px_6px_8px_#00000099]'>
          Tap to start
        </span>
      </button>
    </div>
  );
}

TriviaIntro.propTypes = {
  contentfulQuiz: PropTypes.object.isRequired,
  startQuiz: PropTypes.func.isRequired,
};
