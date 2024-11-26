/* eslint-disable react/no-array-index-key */
import React from 'react';
import { navigate, graphql, useStaticQuery, Link } from 'gatsby';
import { useKeyPress } from '../hooks';
import useQuizStore from '../store';
import { APPLICATION_SLUG } from '../../appConfig';
import Media from '../components/Media';

function IndexPage() {
  const { currentLocale } = useQuizStore();

  // Fetch data using a static query
  const data = useStaticQuery(graphql`
    query {
      allContentfulApplication {
        nodes {
          slug
          node_locale
          attractScreen {
            startButtonText
            title
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
          homeScreen {
            showHomeScreen
          }
          quizzes {
            slug
            node_locale
          }
        }
      }
    }
  `);

  // Carousel Icons
  const professionIcons = [
    '/profession/1.png',
    '/profession/2.png',
    '/profession/3.png',
    '/profession/4.png',
    '/profession/5.png',
    '/profession/6.png',
    '/profession/7.png',
    '/profession/8.png',
    '/profession/10.png',
    '/profession/11.png',
    '/profession/12.png',
    '/profession/13.png',
    '/profession/14.png',
    '/profession/15.png',
    '/profession/16.png',
  ];

  // Find the specific application
  const application = data.allContentfulApplication.nodes.filter(
    node => node.slug === APPLICATION_SLUG
  );

  // Find the English and Spanish versions of the application
  const englishApplication = application.find(
    app => app.node_locale === 'en-US'
  );
  const spanishApplication = application.find(app => app.node_locale === 'es');

  // Extract the attract screen and quizzes for both languages
  const {
    attractScreen: attractScreenEN,
    homeScreen: homeScreenEN,
    quizzes: quizzesEN,
  } = englishApplication;
  const {
    attractScreen: attractScreenES,
    homeScreen: homeScreenES,
    quizzes: quizzesES,
  } = spanishApplication;

  // Determine if we should show the home screen
  const showHomeScreen =
    homeScreenEN?.showHomeScreen || homeScreenES?.showHomeScreen;
  const shouldShowHomeScreen =
    showHomeScreen && (quizzesEN?.length > 1 || quizzesES?.length > 1);

  // Redirect to the Home screen or the first quiz based on the condition
  const linkTo = shouldShowHomeScreen
    ? `/${currentLocale}/home/`
    : `/${currentLocale}/${quizzesEN[0]?.slug || quizzesES[0]?.slug}`;

  // Navigate to linkTo, on Space keypress
  useKeyPress([' '], () => navigate(linkTo));

  if (!application) {
    return (
      <div className='flex h-screen w-full items-center justify-center text-center'>
        <h1 className='text-4xl font-bold'>Application not found.</h1>
      </div>
    );
  }

  // If no attract screen or quizzes are found, render an error message
  if (
    !englishApplication?.attractScreen ||
    !spanishApplication?.attractScreen ||
    !englishApplication?.quizzes.length ||
    !spanishApplication?.quizzes.length
  ) {
    return (
      <div className='flex h-screen w-full items-center justify-center text-center'>
        <h1 className='text-4xl font-bold'>
          No content found for this locale.
        </h1>
      </div>
    );
  }

  return (
    <Link
      to={linkTo}
      className='flex min-h-screen w-full flex-col items-center justify-end text-center font-GT-Walsheim text-white'
    >
      {/* Background Image */}
      {(attractScreenEN?.backgroundMedia ||
        attractScreenES?.backgroundMedia) && (
        <Media
          media={
            attractScreenEN?.backgroundMedia || attractScreenES?.backgroundMedia
          }
          className='!fixed left-0 top-0 -z-[1] h-[1080px] w-[1920px] bg-black object-cover'
        />
      )}

      {/* English and Spanish body text */}
      <div className='mb-[60px] w-[1572px] rounded-[50px] border-[10px] border-career-blue-400 p-[10px]'>
        <div className='flex min-h-[533px] flex-col justify-center gap-[80px] rounded-[40px] border-[4px] border-career-blue-400 bg-black/30 text-[70px]/[80.15px] font-extrabold backdrop-blur-[2px]'>
          {attractScreenEN?.text && <h2>{attractScreenEN.text.text}</h2>}

          {attractScreenES?.text && (
            <h2 className='text-career-blue-100'>
              {attractScreenES.text.text}
            </h2>
          )}
        </div>
      </div>

      {/* Profession Icons */}
      <div className='relative flex h-[266px] w-full overflow-hidden'>
        <div className='absolute inset-0 -z-[1] bg-career-blue-300/80 mix-blend-luminosity' />

        <div className='flex min-w-full flex-[0_0_auto] animate-ticker items-center gap-2'>
          {professionIcons.map((src, index) => (
            <img key={src + index} src={src} alt='professions icons' />
          ))}
        </div>
        <div
          className='flex min-w-full flex-[0_0_auto] animate-ticker items-center gap-2'
          aria-hidden='true'
        >
          {professionIcons.map((src, index) => (
            <img
              key={`second-${src}${index}`}
              src={src}
              alt='professions icons'
            />
          ))}
        </div>
      </div>
    </Link>
  );
}

export default IndexPage;
