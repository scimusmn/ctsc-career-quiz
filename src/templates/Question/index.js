import React, { useState } from 'react';
import { graphql, navigate } from 'gatsby';
import PropTypes from 'prop-types';
import QuestionContent from '../../components/Question/QuestionContent';
import Intro from '../../components/Question/Intro';
import useQuizStore from '../../store';
import { useKeyPress } from '../../hooks';

export const pageQuery = graphql`
  query ($locale: String!, $slug: String!, $id: String!) {
    contentfulQuestion(id: { eq: $id }, node_locale: { eq: $locale }) {
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
          description
          file {
            contentType
            url
          }
        }
      }
      media {
        title
        description
        file {
          contentType
          url
        }
      }
      hint
      voiceOverAudio {
        title
        description
        file {
          contentType
          url
        }
      }

      answer {
        text {
          text
        }
        media {
          title
          description
          file {
            contentType
            url
          }
        }
        voiceOverAudio {
          title
          description
          file {
            contentType
            url
          }
        }
      }

      questionIntro {
        title
        captionsFile {
          title
          description
          file {
            contentType
            url
          }
        }
        voiceOverAudio {
          title
          description
          file {
            contentType
            url
          }
        }
        media {
          title
          description
          file {
            contentType
            url
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
        file {
          contentType
          url
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
          file {
            url
            contentType
          }
        }
        inputAnswerSoundEffect {
          title
          file {
            contentType
            url
          }
        }
        correctAnswerSoundEffect {
          title
          file {
            contentType
            url
          }
        }
        wrongAnswerSoundEffect {
          title
          file {
            contentType
            url
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
