import React, { useState, useCallback, useEffect } from 'react';
import { graphql, navigate } from 'gatsby';
import PropTypes from 'prop-types';
import { useIdleTimer } from 'react-idle-timer';
import { useKeyPress } from '../../hooks';
import useQuizStore from '../../store';
import VoiceOverWithText from '../../components/VoiceOverWithText';
import Media from '../../components/Media';
import { INACTIVITY_TIMER } from '../../../appConfig';

export const pageQuery = graphql`
  query ($contentful_id: String!, $slug: String!, $locale: String!) {
    contentfulScoreScreen(
      contentful_id: { eq: $contentful_id }
      node_locale: { eq: $locale }
    ) {
      title
      retryButtonText
      results {
        text {
          text
        }
        voiceOverAudio {
          title
          description
          file {
            contentType
            url
          }
        }
        backgroundMedia {
          title
          file {
            contentType
            url
          }
          gatsbyImageData(width: 1920, height: 1080, layout: FIXED)
        }
        scoreKey
        tallyKey
      }
    }

    contentfulQuiz(slug: { eq: $slug }, node_locale: { eq: $locale }) {
      slug
      node_locale
      quizSettings {
        isTallyBased
        players {
          name
        }
      }
    }
  }
`;

function ResultScreen({ data }) {
  const { quizSettings } = data.contentfulQuiz;
  const { results, retryButtonText } = data.contentfulScoreScreen;
  const { scores, tagTallies } = useQuizStore();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [shouldPlayAudio, setShouldPlayAudio] = useState(true);

  const isLastPlayer = currentPlayerIndex === quizSettings.players.length - 1;

  // quiz-level inactivity timer
  useIdleTimer({
    onIdle: () => navigate(`/`),
    timeout: INACTIVITY_TIMER,
    throttle: 500,
  });

  const getResult = useCallback(
    (score, tally) => {
      if (results.length === 1) return results[0];

      if (quizSettings.isTallyBased) {
        // For tally-based quizzes, find the matching tallyKey or default to the first result.
        return results.find(result => result.tallyKey === tally) || results[0];
      }
      // For score-based quizzes, sort the results by scoreKey descending and find the highest scoreKey that is <= score.
      const sortedResults = results
        .slice()
        .sort((a, b) => b.scoreKey - a.scoreKey); // Sort descending
      return (
        sortedResults.find(result => score >= result.scoreKey) || results[0]
      );
    },
    [quizSettings.isTallyBased, results]
  );

  const handleNextPlayer = useCallback(() => {
    if (isLastPlayer) {
      navigate('/');
    } else {
      setCurrentPlayerIndex(prev => prev + 1);
      setShouldPlayAudio(true);
    }
  }, [isLastPlayer]);

  useKeyPress([' '], () => {
    setShouldPlayAudio(false);
    handleNextPlayer();
  });

  useEffect(() => {
    setShouldPlayAudio(true);
  }, [currentPlayerIndex]);

  // const currentPlayer = quizSettings.players[currentPlayerIndex];
  const currentPlayerKey = `p${currentPlayerIndex + 1}`;

  // Find the key with highest value from tagTallies
  const highestTallyKey =
    quizSettings.isTallyBased &&
    tagTallies[currentPlayerKey] &&
    Object.entries(tagTallies[currentPlayerKey]).reduce((highest, current) =>
      current[1] > highest[1] ? current : highest
    )[0];

  const currentResult = quizSettings.isTallyBased
    ? getResult(null, highestTallyKey)
    : getResult(scores[currentPlayerKey] || {}, null);

  const hasVoiceOver = !!currentResult?.voiceOverAudio?.file?.url;

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center font-GT-Walsheim text-white'>
      {/* Background with baked in content */}
      {currentResult?.backgroundMedia && (
        <Media
          media={currentResult.backgroundMedia}
          className='!fixed left-0 top-0 -z-[1] h-[1080px] w-[1920px] bg-black object-cover'
        />
      )}

      {/* Result text */}
      {currentResult?.text && (
        <h1 className='absolute right-[94px] top-[151px] w-[835px] text-center text-[60px]/[68px] font-extrabold text-career-blue-100 [text-shadow:10px_8px_10px_#00000066]'>
          {currentResult.text.text}
        </h1>
      )}

      <button
        type='button'
        onClick={handleNextPlayer}
        className='absolute bottom-[117px] left-[386px] h-[51px] w-[255px] rounded-[30px] border-[4px] border-career-blue-100 bg-career-blue-500/80 active:scale-95 active:bg-career-blue-500/90'
      >
        <span className='text-[24px] font-bold text-white [text-shadow:4px_4px_4px_#00000066]'>
          {retryButtonText}
        </span>
      </button>

      {hasVoiceOver && shouldPlayAudio && (
        <VoiceOverWithText
          key={currentPlayerIndex} // Force re-render by changing the key
          content={{
            voiceOverAudio: currentResult.voiceOverAudio,
          }}
          callback={() => {}}
        />
      )}
    </div>
  );
}

ResultScreen.propTypes = {
  data: PropTypes.shape({
    contentfulQuiz: PropTypes.object.isRequired,
    contentfulScoreScreen: PropTypes.object.isRequired,
  }).isRequired,
};

export default ResultScreen;
