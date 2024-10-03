import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import Media from '../Media';
import LifeDetectiveResultScore from './LifeDetectiveResultScore';
import { useKeyPress } from '../../hooks';

export default function LifeDetectiveResult({
  result,
  retryButtonText,
  score,
}) {
  const { backgroundMedia, text } = result || {};
  const [showScore, setShowScore] = useState(false);

  // A simple result loading animation
  const [loading, setLoading] = useState(0);
  useEffect(() => {
    const step = 100 / (8000 / 100);

    const interval = setInterval(() => {
      setLoading(prev => {
        const newValue = prev + step;
        return newValue >= 100 ? 100 : newValue;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useKeyPress([' '], () => {
    if (!showScore && loading === 100) setShowScore(true);
    if (showScore) navigate('/');
  });

  if (showScore) {
    return (
      <LifeDetectiveResultScore
        result={result}
        score={score}
        retryButtonText={retryButtonText}
      />
    );
  }

  return (
    <div
      className={`relative flex min-h-screen w-full flex-col items-center justify-center text-center font-GT-Walsheim ${loading !== 100 ? 'pb-[240px]' : 'pb-[93px]'}`}
    >
      {/* Background Image */}
      {backgroundMedia && (
        <Media
          media={backgroundMedia}
          className='fixed left-0 top-0 -z-[1] h-[1920px] w-[1080px] bg-black object-cover'
        />
      )}

      {/* Top Section with text and loading bar */}
      <div className='ml-[275px] mt-[159px] w-[805px] space-y-[23px] text-left text-[30px]/[34.35px] font-bold text-detective-blue-100'>
        <p>Space probes detecting ...</p>
        <p>Waiting for the result ...</p>

        {/* Loading bar */}
        <div className='flex items-center'>
          <div className='mr-[15px] h-[28px] w-[618px] rounded-[30px] border-[3px] border-detective-blue-300 p-[4px]'>
            <div
              style={{ width: `${loading}%` }}
              className='h-full rounded-full bg-detective-blue-300/80 duration-200'
            />
          </div>

          <p className='font-Gugi text-[35px] font-normal text-detective-blue-300'>
            {Math.round(loading)}%
          </p>
        </div>
      </div>

      {/* Radar GIF */}
      <img
        src='/life_detective_score_radar.gif'
        alt='radar gif'
        className='-my-[64px] mr-[40px] h-[925px] w-full object-cover mix-blend-screen'
      />

      {/* Bottom text with score */}
      <div className='mt-auto h-[565px] w-[881px] rounded-[20px] bg-detective-blue-500/60 p-[22px] pt-[30px] backdrop-blur-[2px]'>
        <div className='flex h-full w-full flex-col justify-center rounded-[20px] border-[5px] border-detective-blue-300 pl-[79px] pr-[46px] text-left text-[42px]/[48.09px] font-bold text-white'>
          {text.text ? (
            <p
              dangerouslySetInnerHTML={{
                __html: text.text.replace(/\n/g, '<br /><br />'),
              }}
            />
          ) : (
            <p>Continue for results...</p>
          )}
        </div>
      </div>

      {loading === 100 && (
        <button
          type='button'
          onClick={() => setShowScore(true)}
          className='mt-[37px] h-[110px] w-[602px] rounded-[40px] border-[10px] border-detective-blue-200/75 bg-detective-blue-300/75 py-[5px] active:scale-95 active:bg-detective-blue-300/85'
        >
          <span className='font-Gugi text-[55px] font-normal text-white [text-shadow:4px_6px_8px_#00000099]'>
            Tap to continue
          </span>
        </button>
      )}
    </div>
  );
}

LifeDetectiveResult.propTypes = {
  result: PropTypes.object.isRequired,
  retryButtonText: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};
