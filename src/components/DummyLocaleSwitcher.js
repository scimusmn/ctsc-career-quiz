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

  const { setCurrentLocale } = useQuizStore();
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

  return (
    <>
      <hr className='mb-4 mt-10' />
      <h2 className='mb-2 text-xl font-bold'>Switch Locale</h2>

      {/* Update the path as per your localized URL structure */}
      <div className='flex gap-8'>
        {locales.map(({ node }) => (
          <button
            type='button'
            key={node.code}
            className='underline'
            onClick={() => handleLocaleChange(node.code)}
          >
            {node.name}
          </button>
        ))}
      </div>
    </>
  );
}

export default LocaleSwitcher;
