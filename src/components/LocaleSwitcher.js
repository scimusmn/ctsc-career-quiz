import React from 'react';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import useQuizStore from '../store';

function LocaleSwitcher() {
  const data = useStaticQuery(graphql`
    query LocaleQuery {
      allContentfulLocale {
        edges {
          node {
            code
            name
          }
        }
      }
    }
  `);

  const locales = data.allContentfulLocale.edges;

  const { currentLocale, setCurrentLocale } = useQuizStore();
  // Get the current page pathname and split into array of valid strings
  const currentPathname =
    typeof window !== 'undefined' ? window.location.pathname : '';

  const pathParts = currentPathname.split('/').filter(Boolean);

  const handleLocaleChange = selectedLocale => {
    setCurrentLocale(selectedLocale); // update the global locale to be used in other pages like attract screen
    if (pathParts.length) {
      pathParts.splice(0, 1, selectedLocale).join('/'); // replace the locale in current path
      navigate(`/${pathParts.join('/')}/`); // navigate to the current page of selected locale
    }
  };

  const content = {
    'en-US': {
      title: 'Notification',
      subtitle: 'Tap here to continue in English',
    },
    es: {
      title: 'Notificación',
      subtitle: 'Toca aquí para continuar en español',
    },
  };

  return (
    <div className='flex w-[950px] flex-col gap-[31px]'>
      {/* Update the path as per your localized URL structure */}

      {locales.map(({ node }) => (
        <button
          type='button'
          key={node.code}
          onClick={() => handleLocaleChange(node.code)}
          className='flex items-center gap-[30px] rounded-[34px] bg-white/30 px-[38px] py-[52px] backdrop-blur-[3px]'
        >
          <img
            src='/locale_icon.png'
            alt='icon'
            className='size-[85px] rounded-[10px] object-cover'
          />

          <div
            className={`flex flex-col gap-2 text-left ${currentLocale === node.code && 'text-[#F6E4C8]'}`}
          >
            <span className='text-[40px]/[45.8px] font-bold'>
              {content[node.code].title}
            </span>

            <span className='text-[45px]/[51.53px] font-normal'>
              {content[node.code].subtitle}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default LocaleSwitcher;
