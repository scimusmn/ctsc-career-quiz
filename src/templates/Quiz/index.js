import React from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import { useIdleTimer } from 'react-idle-timer';
import { useKeyPress } from '../../hooks';
import Media from '../../components/Media';
import useQuizStore from '../../store';
import { INACTIVITY_TIMER } from '../../../appConfig';

export const pageQuery = graphql`
  query ($slug: String!) {
    allContentfulQuiz(filter: { slug: { eq: $slug } }) {
      nodes {
        title
        slug
        locale: node_locale
        text {
          text
        }
        backgroundMedia {
          title
          file {
            contentType
            url
          }
          gatsbyImageData(width: 1920, height: 1080, layout: FIXED)
        }
        listOfQuestionSets {
          id
        }
        quizSettings {
          players {
            name
          }
          pointPerQuestion
          isTallyBased
        }
      }
    }
  }
`;

function QuizScreen({ data }) {
  const { allContentfulQuiz } = data;
  const quizEN = allContentfulQuiz.nodes.find(node => node.locale === 'en-US'); // English Quiz
  const quizES = allContentfulQuiz.nodes.find(node => node.locale === 'es'); // Spanish Quiz

  const { startQuiz, currentLocale, setCurrentLocale } = useQuizStore();

  // quiz-level inactivity timer
  useIdleTimer({
    onIdle: () => navigate(`/`),
    timeout: INACTIVITY_TIMER,
    throttle: 500,
  });

  useKeyPress([' '], () => startQuiz(currentLocale === 'es' ? quizES : quizEN)); // start quiz on space bar

  useKeyPress(['Escape'], () => navigate(`/`)); // exit quiz on escape

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center text-center font-GT-Walsheim text-white'>
      {/* Background Image */}
      {(quizEN?.backgroundMedia || quizES?.backgroundMedia) && (
        <Media
          media={quizEN.backgroundMedia || quizES.backgroundMedia}
          className='!fixed left-0 top-0 -z-[1] h-[1080px] w-[1920px] bg-black object-cover'
        />
      )}

      {/* Headings */}
      <div className='mb-[50px] text-[80px]/[91.5px] font-extrabold'>
        {quizEN?.title && <h2>{quizEN.title}</h2>}

        {quizES?.title && (
          <h2 className='mt-[28px] text-career-blue-100'>{quizES.title}</h2>
        )}
      </div>

      {/* Body text */}
      <div className='mb-[75px] w-[1401px] rounded-[50px] border-[10px] border-career-blue-400 p-[10px] shadow-[10px_10px_10px_10px_#00000033] backdrop-blur-[2px]'>
        <div className='flex min-h-[318px] flex-col justify-center gap-[28px] rounded-[40px] border-[4px] border-career-blue-400 bg-black/30 px-[80px] text-[48px]/[55px] font-medium shadow-[10px_10px_10px_10px_#00000033]'>
          {quizEN?.text && <p>{quizEN?.text.text}</p>}

          {quizES?.text && (
            <p className='text-career-blue-100'>{quizES?.text.text}</p>
          )}
        </div>
      </div>

      {/* Buttons to start the quiz */}
      <div className='flex w-[1401px] justify-between'>
        {/* English button */}
        <button
          type='button'
          className='h-[92px] w-[394px] rounded-[30px] border-[5px] border-career-blue-100 bg-career-blue-500/80 active:scale-95 active:bg-career-blue-500/90'
          onClick={() => {
            setCurrentLocale('en-US');
            startQuiz(quizEN);
          }}
        >
          <span className='text-[40px] font-extrabold text-white [text-shadow:4px_4px_4px_#00000066]'>
            Tap to begin
          </span>
        </button>

        {/* Spanish button */}
        <button
          type='button'
          className='h-[92px] w-[466px] rounded-[30px] border-[5px] border-career-blue-100 bg-career-blue-500/80 active:scale-95 active:bg-career-blue-500/90'
          onClick={() => {
            setCurrentLocale('es');
            startQuiz(quizES);
          }}
        >
          <span className='text-[40px] font-extrabold text-white [text-shadow:4px_4px_4px_#00000066]'>
            Toca para comenzar
          </span>
        </button>
      </div>
    </div>
  );
}

QuizScreen.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default QuizScreen;
