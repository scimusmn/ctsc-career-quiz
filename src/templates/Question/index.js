import React, { useState } from 'react';
import { graphql, navigate } from 'gatsby';
import PropTypes from 'prop-types';
import QuestionContent from '../../components/Question/QuestionContent';
import Intro from '../../components/Question/Intro';
import useQuizStore from '../../store';
import { useKeyPress } from '../../hooks';

export const pageQuery = graphql`
  query ($locale: String!, $slug: String!, $contentful_id: String!) {
    contentfulQuestion(
      contentful_id: { eq: $contentful_id }
      node_locale: { eq: $locale }
    ) {
      text {
        text
      }
      options {
        text
        richText {
          raw
        }
        isCorrect
        tags
        image {
          title
          localFile {
            extension
            publicURL
            childImageSharp {
              gatsbyImageData(width: 1920, layout: CONSTRAINED)
            }
          }
        }
      }
      media {
        title
        localFile {
          extension
          publicURL
          childImageSharp {
            gatsbyImageData(width: 1920, layout: CONSTRAINED)
          }
        }
      }
      hint
      voiceOverAudio {
        title
        description
        localFile {
          extension
          publicURL
        }
      }

      answer {
        text {
          text
        }
        media {
          title
          localFile {
            extension
            publicURL
            childImageSharp {
              gatsbyImageData(width: 1920, layout: CONSTRAINED)
            }
          }
        }
        voiceOverAudio {
          title
          description
          localFile {
            extension
            publicURL
          }
        }
      }

      questionIntro {
        title
        captionsFile {
          title
          description
          localFile {
            extension
            publicURL
          }
        }
        voiceOverAudio {
          title
          description
          localFile {
            extension
            publicURL
          }
        }
        media {
          title
          localFile {
            extension
            publicURL
            childImageSharp {
              gatsbyImageData(width: 1920, layout: CONSTRAINED)
            }
          }
        }
      }
    }

    contentfulQuiz(slug: { eq: $slug }, node_locale: { eq: $locale }) {
      title
      slug
      locale: node_locale
      listOfQuestionSets {
        id
        listOfQuestions {
          id
        }
      }
      backgroundMedia {
        title
        description
        localFile {
          extension
          publicURL
          childImageSharp {
            gatsbyImageData(width: 1920, layout: CONSTRAINED)
          }
        }
      }
      quizSettings {
        title
        timePerQuestion
        pointPerQuestion
        isTallyBased
        players {
          name
          keystrokeOptionOne
          keystrokeOptionTwo
          keystrokeOptionThree
        }
        countdownTimerSoundEffect {
          title
          localFile {
            extension
            publicURL
          }
        }
        inputAnswerSoundEffect {
          title
          localFile {
            extension
            publicURL
          }
        }
        correctAnswerSoundEffect {
          title
          localFile {
            extension
            publicURL
          }
        }
        wrongAnswerSoundEffect {
          title
          localFile {
            extension
            publicURL
          }
        }
      }
    }
  }
`;

function QuestionScreen({ data, location }) {
  const { contentfulQuestion, contentfulQuiz } = data;
  const [started, setStarted] = useState(false);
  const { currentLocale } = useQuizStore();

  const { pathname } = location;

  useKeyPress(['Escape'], () =>
    navigate(`/${currentLocale}/${contentfulQuiz.slug}`)
  ); // exit quiz & go back to intro screen, on escape

  return (
    <div>
      {started || !contentfulQuestion.questionIntro ? (
        <QuestionContent
          content={contentfulQuestion}
          parentQuiz={contentfulQuiz}
          currentPath={pathname}
          totalQuestions={
            contentfulQuiz.listOfQuestionSets[0].listOfQuestions.length
          }
        />
      ) : (
        <Intro
          content={contentfulQuestion.questionIntro}
          startQuestion={() => setStarted(true)}
        />
      )}
    </div>
  );
}

QuestionScreen.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default QuestionScreen;
