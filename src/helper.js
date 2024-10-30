export const parsePathname = pathname => {
  const parts = pathname.split('/').filter(Boolean); // Split and remove any empty strings
  // Initialize an object to hold the parsed parts
  const parsed = {
    locale: parts[0],
    quizSlug: parts[1],
  };

  // Handle different pathname lengths
  switch (parts.length) {
    case 2: // /{locale}/{quizSlug}/
      // No additional parsing needed
      break;
    case 4: // /{locale}/{quizSlug}/{setIndex}/{questionIndex}
      parsed.setIndex = parseInt(parts[2], 10);
      parsed.questionIndex = parseInt(parts[3], 10);
      break;
    case 3: // /{locale}/{quizSlug}/result
      if (parts[2] === 'result') {
        parsed.result = true;
      } else {
        console.error('Unexpected pathname structure:', pathname);
        return {};
      }
      break;
    default:
      console.error('Invalid pathname structure:', pathname);
      return {};
  }

  return parsed;
};

export const preventWidow = text => {
  // Return an empty string if the input is falsy or if it's just whitespace
  if (!text || !text.trim()) return '';

  const words = text.trim().split(' ');
  if (words.length < 2) return text;

  return `${words.slice(0, -1).join(' ')}\u00A0${words.slice(-1)}`;
};

export const test = () => {};
