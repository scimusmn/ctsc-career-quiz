const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, './src/components'),
        '@styles': path.resolve(__dirname, './src/styles'),
      },
    },
  });
};

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // language=GraphQL <- Enables code formatting for Gatsby's unique GraphQL function
  const {
    // Query Contentful content types that render to a page
    // The slug field is the bare minimum required for page creation
    data: { allLocaleData, allQuizData },
    errors,
  } = await graphql(`
    {
      allLocaleData: allContentfulLocale {
        edges {
          node {
            code
          }
        }
      }
      allQuizData: allContentfulQuiz {
        edges {
          node {
            slug
            node_locale
            listOfQuestionSets {
              id
              listOfQuestions {
                id
              }
            }
            scoreScreen {
              id
            }
          }
        }
      }
    }
  `);

  if (errors) {
    throw new Error('Failed to fetch Contentful data');
  }

  const locales = allLocaleData.edges;
  const quizzes = allQuizData.edges;

  // Create a homepage for each locale
  locales.forEach(({ node }) => {
    const localeHomePath = `/${node.code}/home/`;
    createPage({
      path: localeHomePath,
      component: path.resolve('./src/templates/Homepage/index.js'),
      context: {
        locale: node.code,
      },
    });
  });

  quizzes.forEach(({ node: quizNode }) => {
    locales.forEach(({ node: localeNode }) => {
      if (quizNode.node_locale === localeNode.code) {
        // Create a page for each quiz
        const quizPath = `/${localeNode.code}/${quizNode.slug}`;
        createPage({
          path: quizPath,
          component: path.resolve('./src/templates/Quiz/index.js'),
          context: {
            slug: quizNode.slug,
            locale: localeNode.code,
          },
        });

        // Nested loop to create pages for each question
        quizNode.listOfQuestionSets?.forEach(
          (questionSet, questionSetIndex) => {
            questionSet.listOfQuestions.forEach((question, questionIndex) => {
              const questionPath = `${quizPath}/${questionSetIndex + 1}/${
                questionIndex + 1
              }`;

              createPage({
                path: questionPath,
                component: path.resolve('./src/templates/Question/index.js'),
                context: {
                  slug: quizNode.slug,
                  locale: localeNode.code,
                  questionSetId: questionSet.id,
                  id: question.id,
                },
              });
            });
          }
        );

        // create pages for each quiz result
        if (quizNode.scoreScreen?.id) {
          createPage({
            path: `${quizPath}/result`,
            component: path.resolve('./src/templates/Result/index.js'),
            context: {
              slug: quizNode.slug,
              id: quizNode.scoreScreen.id,
              locale: localeNode.code,
            },
          });
        }
      }
    });
  });
};
