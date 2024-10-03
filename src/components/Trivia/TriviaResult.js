import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Media from '../Media';
import TriviaMessageBox from './TriviaMessageBox';
import TriviaAstronautBubble from './TriviaAstronautBubble';

export default function TriviaResult({ result, retryButtonText, score }) {
  const { backgroundMedia, text } = result || {};

  // Spit result text by new line to render multiple astronaut bubbles
  const texts = text.text.split('\n').filter(Boolean);

  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-end pb-[25px] pt-[199px] text-center font-GT-Walsheim text-white'>
      {backgroundMedia && (
        <Media
          media={backgroundMedia}
          className='fixed left-0 top-0 -z-[1] h-[1920px] w-[1080px] bg-black object-cover'
        />
      )}

      <h3 className='mb-auto text-[100px]/[114.4px] font-extrabold'>
        Your score is:
      </h3>

      <h2 className='my-auto pb-4 font-Iceberg text-[400px]/[488px] font-normal [text-shadow:20px_10px_10px_#00000066]'>
        {score}
      </h2>

      <TriviaMessageBox>
        {text?.text &&
          texts.map(str => <TriviaAstronautBubble text={str} key={str} />)}

        <Link
          className='absolute bottom-[14px] left-0 w-full text-center text-[48px]/[54.96px] font-medium italic active:scale-95'
          to='/'
        >
          {retryButtonText || 'Retry'}
        </Link>
      </TriviaMessageBox>
    </div>
  );
}

TriviaResult.propTypes = {
  result: PropTypes.object.isRequired,
  retryButtonText: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};
