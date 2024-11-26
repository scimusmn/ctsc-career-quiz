import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql, navigate } from 'gatsby';
import Home from '../../components/Home';

export const pageQuery = graphql`
  query ($contentful_id: String!, $locale: String!, $appSlug: String!) {
    contentfulHomeScreen(
      contentful_id: { eq: $contentful_id }
      node_locale: { eq: $locale }
    ) {
      title
      node_locale
      startButtonText
      showHomeScreen
      text {
        text
      }
      backgroundMedia {
        title
        localFile {
          extension
          publicURL
          childImageSharp {
            gatsbyImageData(width: 1920, height: 1080, layout: FIXED)
          }
        }
      }
    }

    contentfulApplication(
      slug: { eq: $appSlug }
      quizzes: { elemMatch: { node_locale: { eq: $locale } } }
    ) {
      quizzes {
        slug
        node_locale
        title
      }
    }
  }
`;

function Homepage({ data }) {
  const { contentfulHomeScreen, contentfulApplication } = data;
  const { showHomeScreen, node_locale: locale } = contentfulHomeScreen || {};

  const quizzes = contentfulApplication?.quizzes || [];

  useEffect(() => {
    if (quizzes.length === 1 || showHomeScreen === false) {
      navigate(`/${locale}/${quizzes[0]?.slug}`);
    }
  }, [quizzes, showHomeScreen, locale]);

  if (quizzes.length === 1 || showHomeScreen === false) {
    return <div>Redirecting...</div>; // Or any loading indicator
  }

  return <Home content={contentfulHomeScreen} quizzes={quizzes} />;
}

Homepage.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Homepage;
