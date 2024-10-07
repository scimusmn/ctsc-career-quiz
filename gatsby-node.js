const path = require('path');
const { APPLICATION_SLUG } = require('./appConfig');

// Define the constant for the application slug

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

  const {
    data: { allLocaleData, applicationData },
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
      applicationData: contentfulApplication(slug: { eq: "${APPLICATION_SLUG}" }) {
        slug
        node_locale
        homeScreen {
          contentful_id
        }
        quizzes {
          title
          slug
          node_locale
          listOfQuestionSets {
            contentful_id
            listOfQuestions {
              contentful_id
            }
          }
          scoreScreen {
            contentful_id
          }
        }
      }
    }
  `);

  if (errors) {
    throw new Error('Failed to fetch Contentful data');
  }

  const locales = allLocaleData.edges;
  const appNode = applicationData;

  locales.forEach(({ node: localeNode }) => {
    const homePath = `/${localeNode.code}/home`;
    createPage({
      path: homePath,
      component: path.resolve('./src/templates/Homepage/index.js'),
      context: {
        contentful_id: appNode.homeScreen?.contentful_id,
        locale: localeNode.code,
        appSlug: appNode.slug,
      },
    });

    // Create a page for each quiz in the application
    appNode.quizzes.forEach(quizNode => {
      const quizPath = `/${localeNode.code}/${quizNode.slug}`;
      createPage({
        path: quizPath,
        component: path.resolve('./src/templates/Quiz/index.js'),
        context: {
          slug: quizNode.slug,
          locale: localeNode.code,
        },
      });

      // Nested loop to create pages for each question in the quiz
      quizNode.listOfQuestionSets?.forEach((questionSet, questionSetIndex) => {
        questionSet.listOfQuestions.forEach((question, questionIndex) => {
          const questionPath = `${quizPath}/${questionSetIndex + 1}/${questionIndex + 1}`;
          createPage({
            path: questionPath,
            component: path.resolve('./src/templates/Question/index.js'),
            context: {
              slug: quizNode.slug,
              locale: localeNode.code,
              contentful_id: question.contentful_id,
            },
          });
        });
      });

      // Create a result page for the quiz
      if (quizNode.scoreScreen?.contentful_id) {
        const resultPath = `${quizPath}/result`;
        createPage({
          path: resultPath,
          component: path.resolve('./src/templates/Result/index.js'),
          context: {
            slug: quizNode.slug,
            contentful_id: quizNode.scoreScreen.contentful_id,
            locale: localeNode.code,
          },
        });
      }
    });
  });
};
