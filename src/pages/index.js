import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import useQuizStore from '../store';

function IndexPage() {
  const data = useStaticQuery(graphql`
    query {
      contentfulAttractScreen {
        startButtonText
        title
        text {
          text
        }
      }
      allContentfulQuiz {
        nodes {
          slug
          node_locale
        }
      }
      contentfulHomeScreen {
        showHomeScreen
      }
    }
  `);

  const { currentLocale } = useQuizStore();

  const { contentfulAttractScreen, allContentfulQuiz, contentfulHomeScreen } =
    data;
  const { title, startButtonText, text } = contentfulAttractScreen || {};
  const showHomeScreen = contentfulHomeScreen?.showHomeScreen;
  const allQuizzes = allContentfulQuiz?.nodes || [];

  // Filter quizzes for the current locale
  const quizzes = allQuizzes.filter(quiz => quiz.node_locale === currentLocale);

  if (!quizzes.length) {
    return (
      <div className='flex h-screen w-full items-center justify-center text-center'>
        <h1 className='text-4xl font-bold'>
          No Quizzes found for this locale.
        </h1>
      </div>
    );
  }

  // Determine if we should show the home screen
  const shouldShowHomeScreen = showHomeScreen && quizzes.length > 1;

  const linkTo = shouldShowHomeScreen
    ? `/${currentLocale}/home/`
    : `/${currentLocale}/${quizzes[0]?.slug}`;

  return (
    <div className='flex h-screen w-full items-center justify-center text-center'>
      <div className='space-y-8'>
        <h1 className='text-4xl font-bold'>{title}</h1>
        <p className='my-4'>{text?.text}</p>
        <Link className='btn' to={linkTo}>
          {startButtonText}
        </Link>
      </div>
    </div>
  );
}

export default IndexPage;
