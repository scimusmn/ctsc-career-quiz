import React, { useState, useCallback, useEffect } from 'react';
import { Link, graphql, navigate } from 'gatsby';
import PropTypes from 'prop-types';
import { useKeyPress } from '../../hooks';
import useQuizStore from '../../store';
import TallyResult from '../../components/Result/TallyResult';
import ScoreResult from '../../components/Result/ScoreResult';
import VoiceOverWithText from '../../components/VoiceOverWithText';
import ShipAdvisorResult from '../../components/ShipAdvisor/ShipAdvisorResult';
import LifeDetectiveResult from '../../components/LifeDetective/LifeDetectiveResult';
import TriviaResult from '../../components/Trivia/TriviaResult';

export const pageQuery = graphql`
  query ($id: String!, $slug: String!, $locale: String!) {
    contentfulScoreScreen(id: { eq: $id }, node_locale: { eq: $locale }) {
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
          description
          file {
            contentType
            url
          }
        }
        scoreKey
        tallyKey
      }
    }

    contentfulQuiz(slug: { eq: $slug }, node_locale: { eq: $locale }) {
      slug
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
  const { title, retryButtonText, results } = data.contentfulScoreScreen;
  const { scores, tagTallies } = useQuizStore();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [shouldPlayAudio, setShouldPlayAudio] = useState(true);

  const isLastPlayer = currentPlayerIndex === quizSettings.players.length - 1;

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
    if (data.contentfulQuiz.slug !== 'life-detective') {
      setShouldPlayAudio(false);
      handleNextPlayer();
    }
  });

  useEffect(() => {
    setShouldPlayAudio(true);
  }, [currentPlayerIndex]);

  const currentPlayer = quizSettings.players[currentPlayerIndex];
  const currentPlayerKey = `p${currentPlayerIndex + 1}`;

  const currentResult = quizSettings.isTallyBased
    ? getResult(null, Object.keys(tagTallies[currentPlayerKey] || {})[0])
    : getResult(scores[currentPlayerKey] || {}, null);

  const hasVoiceOver = !!currentResult?.voiceOverAudio?.file?.url;

  if (data.contentfulQuiz.slug === 'ship-advisor') {
    return (
      <>
        <ShipAdvisorResult
          result={currentResult}
          retryButtonText={retryButtonText}
        />
        {hasVoiceOver && shouldPlayAudio && (
          <VoiceOverWithText
            key={currentPlayerIndex} // Force re-render by changing the key
            content={{
              voiceOverAudio: currentResult.voiceOverAudio,
            }}
            callback={() => {}}
          />
        )}
      </>
    );
  }

  if (data.contentfulQuiz.slug === 'life-detective') {
    return (
      <>
        <LifeDetectiveResult
          result={currentResult}
          retryButtonText={retryButtonText}
          score={scores[currentPlayerKey] || 0}
        />

        {hasVoiceOver && shouldPlayAudio && (
          <VoiceOverWithText
            key={currentPlayerIndex} // Force re-render by changing the key
            content={{
              voiceOverAudio: currentResult.voiceOverAudio,
            }}
            callback={() => {}}
          />
        )}
      </>
    );
  }

  if (data.contentfulQuiz.slug === 'trivia') {
    return (
      <>
        <TriviaResult
          result={currentResult}
          retryButtonText={retryButtonText}
          score={scores[currentPlayerKey] || 0}
        />

        {hasVoiceOver && shouldPlayAudio && (
          <VoiceOverWithText
            key={currentPlayerIndex} // Force re-render by changing the key
            content={{
              voiceOverAudio: currentResult.voiceOverAudio,
            }}
            callback={() => {}}
          />
        )}
      </>
    );
  }

  return (
    <div className='flex h-screen w-full items-center justify-center text-center'>
      <div className='space-y-8'>
        {title && <h1 className='text-4xl font-bold'>{title}</h1>}

        {quizSettings.isTallyBased ? (
          <TallyResult
            tagTallies={tagTallies[currentPlayerKey]}
            player={currentPlayer}
            result={currentResult}
          />
        ) : (
          <ScoreResult
            score={scores[currentPlayerKey] || 0}
            player={currentPlayer}
            result={currentResult}
          />
        )}

        <div className='flex items-center justify-center gap-4'>
          {quizSettings.players.length > 1 && !isLastPlayer && (
            <button type='button' className='btn' onClick={handleNextPlayer}>
              Next Player
            </button>
          )}

          {(quizSettings.players.length === 1 || isLastPlayer) && (
            <Link className='btn bg-red-200 hover:bg-red-300' to='/'>
              {retryButtonText || 'Retry'}
            </Link>
          )}
        </div>

        {hasVoiceOver && shouldPlayAudio && (
          <VoiceOverWithText
            key={currentPlayerIndex} // Force re-render by changing the key
            content={{
              voiceOverAudio: currentResult.voiceOverAudio,
            }}
            callback={handleNextPlayer}
          />
        )}
      </div>

      <div className='fixed bottom-10 left-[50%] -translate-x-1/2 rounded-md bg-blue-200 p-2'>
        Press `space` to{' '}
        {isLastPlayer ? 'restart the quiz' : 'go to next player'}
      </div>
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
