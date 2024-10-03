import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import Home from '../../components/Home';

export const pageQuery = graphql`
  query ($locale: String!) {
    allContentfulQuiz(filter: { node_locale: { eq: $locale } }) {
      nodes {
        title
        slug
        node_locale
      }
    }

    contentfulHomeScreen(node_locale: { eq: $locale }) {
      title
      node_locale
      startButtonText
      showHomeScreen
      text {
        text
      }
      backgroundMedia {
        title
        description
        file {
          url
          contentType
        }
      }
    }
  }
`;

function Homepage({ data }) {
  const { contentfulHomeScreen, allContentfulQuiz } = data;
  const { showHomeScreen, node_locale: locale } = contentfulHomeScreen || {};
  const quizzes = allContentfulQuiz?.nodes || [];

  useEffect(() => {
    if (quizzes.length === 1 || showHomeScreen === false) {
      navigate(`/${locale}/${quizzes[0]?.slug}`);
    }
  }, [quizzes, showHomeScreen, locale]);

  if (quizzes.length === 1 || showHomeScreen === false) {
    return <div>Redirecting...</div>; // Or any loading indicator
  }

  return <Home data={data} />;
}

Homepage.propTypes = {
  data: PropTypes.shape({
    contentfulHomeScreen: PropTypes.shape({
      showHomeScreen: PropTypes.bool,
      node_locale: PropTypes.string,
    }),
    allContentfulQuiz: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          slug: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
};

export default Homepage;
