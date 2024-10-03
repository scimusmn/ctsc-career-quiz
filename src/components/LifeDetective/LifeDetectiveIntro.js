import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Media from '../Media';
import LifeDetectiveIntroClues from './LifeDetectiveIntroClues';
import { useKeyPress } from '../../hooks';

export default function LifeDetectiveIntro({ contentfulQuiz, startQuiz }) {
  const { title, text, backgroundMedia } = contentfulQuiz || {};
  const [cluesScreen, setCluesScreen] = useState(false);

  useKeyPress([' '], () =>
    cluesScreen ? startQuiz(contentfulQuiz) : setCluesScreen(true)
  );

  if (cluesScreen) {
    return (
      <LifeDetectiveIntroClues
        contentfulQuiz={contentfulQuiz}
        startQuiz={startQuiz}
      />
    );
  }

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center pb-[119px] pt-[239px] text-center font-GT-Walsheim text-white'>
      {backgroundMedia && (
        <Media
          media={backgroundMedia}
          className='fixed left-0 top-0 -z-[1] h-[1920px] w-[1080px] bg-black object-cover'
        />
      )}

      <h1 className='h-[220px] w-[851px] text-center text-[100px]/[114.5px] font-extrabold'>
        {title}
      </h1>

      {text?.text && (
        <p
          className='ml-[30px] w-[880px] text-left text-[50px]/[57.25px] font-medium'
          dangerouslySetInnerHTML={{
            __html: text.text.replace(/\n/g, '<br /><br />'),
          }}
        />
      )}

      <button
        type='button'
        className='mt-auto h-[110px] w-[602px] rounded-[40px] border-[10px] border-black/60 bg-black/50 active:scale-95 active:bg-black/60'
        onClick={() => setCluesScreen(true)}
      >
        <span className='font-Gugi text-[55px] font-normal text-white [text-shadow:4px_6px_8px_#00000099]'>
          Gather your clues
        </span>
      </button>
    </div>
  );
}

LifeDetectiveIntro.propTypes = {
  contentfulQuiz: PropTypes.object.isRequired,
  startQuiz: PropTypes.func.isRequired,
};
