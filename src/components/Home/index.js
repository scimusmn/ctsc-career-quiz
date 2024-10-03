import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import LocaleSwitcher from '../LocaleSwitcher';
import Media from '../Media';

function Home({ data }) {
  const content = data.contentfulHomeScreen;
  const quizzes = data.allContentfulQuiz.nodes;

  const filteredQuizzes = quizzes.filter(quiz => quiz.title !== 'Dummy Quiz');

  const icons = {
    'ship-advisor': '/ship_advisor_icon.png',
    'life-detective': '/life_detective_icon.png',
    trivia: '/trivia_icon.png',
  };

  return (
    <div className='h-screen w-full p-[28px] font-GT-Walsheim text-white'>
      {content && content.backgroundMedia && (
        <Media
          media={content.backgroundMedia}
          className='fixed left-0 top-0 -z-[1] h-full w-full bg-black object-cover'
        />
      )}

      <div className='flex h-full w-full flex-col items-center justify-end rounded-[50px] bg-white/15'>
        {content && (
          <h1 className='my-auto pb-[30px] text-center text-[100px]/[114.5px] font-extrabold [text-shadow:0px_4px_4px_#00000040]'>
            {content?.title}
          </h1>
        )}

        <LocaleSwitcher />

        <div className='flex w-full justify-between gap-[15px] px-[36px] pb-[35px] pt-[95px]'>
          {quizzes &&
            filteredQuizzes.map(quiz => (
              <Link
                key={`${quiz.node_locale}/${quiz.slug}`}
                to={`/${quiz.node_locale}/${quiz.slug}`}
                className='flex w-1/3 flex-col items-center'
              >
                <img
                  src={icons[quiz.slug]}
                  alt={`${icons[quiz.slug]} icon`}
                  className='size-[250px] rounded-[50px] border-[5px] border-white object-cover object-center'
                />

                <span className='mt-[28px] text-center text-[40px]/[45.8px] font-medium'>
                  {quiz.title}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

Home.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Home;
