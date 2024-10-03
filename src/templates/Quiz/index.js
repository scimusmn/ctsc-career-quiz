import React from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import { useKeyPress } from '../../hooks';
import Media from '../../components/Media';
import LocaleSwitcher from '../../components/LocaleSwitcher';
import useQuizStore from '../../store';
import ShipAdvisorIntro from '../../components/ShipAdvisor/ShipAdvisorIntro';
import LifeDetectiveIntro from '../../components/LifeDetective/LifeDetectiveIntro';
import TriviaIntro from '../../components/Trivia/TriviaIntro';

export const pageQuery = graphql`
  query ($slug: String!, $locale: String!) {
    contentfulQuiz(slug: { eq: $slug }, node_locale: { eq: $locale }) {
      title
      slug
      locale: node_locale
      text {
        text
      }
      backgroundMedia {
        title
        description
        file {
          contentType
          url
        }
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
`;

function QuizScreen({ data }) {
  const { contentfulQuiz } = data;
  const { title, text, backgroundMedia } = contentfulQuiz;
  const { startQuiz, currentLocale } = useQuizStore();

  useKeyPress(
    [' '],
    () => contentfulQuiz.slug !== 'life-detective' && startQuiz(contentfulQuiz)
  ); // start quiz on space bar (ignore on life detective quiz)

  useKeyPress(['Escape'], () => navigate(`/${currentLocale}/home/`)); // exit quiz on escape

  if (contentfulQuiz.slug === 'ship-advisor') {
    return (
      <ShipAdvisorIntro contentfulQuiz={contentfulQuiz} startQuiz={startQuiz} />
    );
  }

  if (contentfulQuiz.slug === 'life-detective') {
    return (
      <LifeDetectiveIntro
        contentfulQuiz={contentfulQuiz}
        startQuiz={startQuiz}
      />
    );
  }

  if (contentfulQuiz.slug === 'trivia') {
    return (
      <TriviaIntro contentfulQuiz={contentfulQuiz} startQuiz={startQuiz} />
    );
  }

  return (
    <>
      <div className='flex min-h-screen w-full flex-col items-center justify-center gap-8 py-10 text-center'>
        <h1 className='text-4xl font-bold'>{title} (Intro Screen)</h1>
        {text && <p>{text.text}</p>}

        {backgroundMedia && <Media media={backgroundMedia} />}

        <button
          type='button'
          className='btn'
          onClick={() => startQuiz(contentfulQuiz)}
        >
          Start Quiz
        </button>

        <div className='pb-20'>
          <LocaleSwitcher />
        </div>
      </div>

      <div className='fixed bottom-10 left-[50%] -translate-x-1/2 rounded-md bg-blue-200 p-2'>
        Press `space` to start the quiz
      </div>
    </>
  );
}

QuizScreen.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default QuizScreen;
