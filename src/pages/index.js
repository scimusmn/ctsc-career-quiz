import React from 'react';
import { navigate, graphql, useStaticQuery } from 'gatsby';
import { useKeyPress } from '../hooks';
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
    }
  `);

  const { currentLocale } = useQuizStore();

  const { allContentfulQuiz } = data;
  // const { contentfulAttractScreen, allContentfulQuiz } =
  //   data;
  // const { title, startButtonText, text } = contentfulAttractScreen || {};
  const allQuizzes = allContentfulQuiz?.nodes || [];

  // Filter quizzes for the career-quiz
  const quizzes = allQuizzes.filter(quiz => quiz.slug === 'career-quiz');

  useKeyPress([' '], () => navigate(`/${currentLocale}/${quizzes[0]?.slug}`));

  if (!quizzes.length) {
    return (
      <div className='flex h-screen w-full items-center justify-center text-center'>
        <h1 className='text-4xl font-bold'>
          No Quizzes found for this locale.
        </h1>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-end text-center font-GT-Walsheim text-white'>
      {/* Background Image */}
      <img
        src='/main_bg.jpg'
        alt='background'
        className='fixed left-0 top-0 -z-[1] h-[1080px] w-[1920px] bg-black object-cover'
      />

      {/* Title */}
      <div className='mb-[60px] w-[1572px] rounded-[50px] border-[10px] border-career-blue-400 p-[10px]'>
        <div className='flex min-h-[533px] flex-col justify-center gap-[80px] rounded-[40px] border-[4px] border-career-blue-400 bg-black/30 text-[70px]/[80.15px] font-extrabold backdrop-blur-[2px]'>
          <h2>Discover the space career for you!</h2>
          <h2 className='text-career-blue-100'>
            ¡Descubre la profesión espacial para ti!
          </h2>
        </div>
      </div>

      {/* Profession Icons */}
      <div className='relative flex h-[266px] items-center justify-center p-[30px]'>
        <div className='absolute inset-0 bg-career-blue-300/80 mix-blend-luminosity' />

        <img
          src='/attract_icons.png'
          alt='professions icons'
          className='z-10'
        />
      </div>
    </div>
  );
}

export default IndexPage;
