import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import LocaleSwitcher from '../LocaleSwitcher';
import Media from '../Media';

function DummyHome({ data }) {
  const content = data.contentfulHomeScreen;
  const quizzes = data.allContentfulQuiz.nodes;

  return (
    <div className='p-5 pb-10'>
      {content && (
        <>
          <h1 className='text-4xl font-bold'>{content?.title}</h1>
          <p className='mt-2'>{content.text?.text}</p>
        </>
      )}

      {content && content.backgroundMedia && (
        <Media media={content.backgroundMedia} />
      )}

      <hr className='mb-4 mt-10' />
      <p className='mb-4 text-xl'>Select a quiz to start</p>
      <div className='flex gap-10'>
        {quizzes &&
          quizzes.map(quiz => (
            <div
              key={`${quiz.node_locale}/${quiz.slug}`}
              className='flex flex-col gap-2 text-center'
            >
              <h4 className='text-lg font-bold'>{quiz.title}</h4>
              <Link className='btn' to={`/${quiz.node_locale}/${quiz.slug}`}>
                {content && content.startButtonText}
              </Link>
            </div>
          ))}
      </div>

      <LocaleSwitcher />
    </div>
  );
}

DummyHome.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default DummyHome;
