import { create } from 'zustand';
import { navigate } from 'gatsby';
import { parsePathname } from '../helper';

// External function to initialize scores
const initializeScores = currentQuizSettings => {
  if (currentQuizSettings && currentQuizSettings.players) {
    return currentQuizSettings.players.reduce((acc, _, index) => {
      acc[`p${index + 1}`] = 0;
      return acc;
    }, {});
  }
  return {};
};

// External function to initialize tag tallies for each player
const initializeTagTallies = currentQuizSettings => {
  if (currentQuizSettings && currentQuizSettings.players) {
    return currentQuizSettings.players.reduce((acc, _, index) => {
      acc[`p${index + 1}`] = {}; // Initialize an empty object for each player
      return acc;
    }, {});
  }
  return {};
};

const useQuizStore = create((set, get) => ({
  currentLocale: 'en-US',
  setCurrentLocale: currentLocale => set({ currentLocale }),

  activeQuestionSets: {},
  setActiveQuestionSet: (quizSlug, index) =>
    set(state => ({
      activeQuestionSets: {
        ...state.activeQuestionSets,
        [quizSlug]: index,
      },
    })),

  inactivityCount: 0,
  setInactivityCount: inactivityCount => set({ inactivityCount }),

  scores: {},
  // Initialize scores using players from quizSettings
  initScores: currentQuizSettings => {
    const initialScores = initializeScores(currentQuizSettings);
    set({ scores: initialScores });
  },

  // Update score for a player
  updateScore: (playerKey, currentQuizSettings) => {
    set(state => {
      let updatedScores = state.scores;

      // Check if scores need to be initialized
      if (Object.keys(updatedScores).length === 0) {
        updatedScores = initializeScores(currentQuizSettings);
      }

      const points = currentQuizSettings.pointPerQuestion || 1;
      updatedScores[playerKey] = (updatedScores[playerKey] || 0) + points;

      return { scores: updatedScores };
    });
  },

  tagTallies: {}, // Adjusted for tally-based scoring
  // Function to initialize tag tallies
  initTagTallies: currentQuizSettings => {
    const initialTagTallies = initializeTagTallies(currentQuizSettings);
    set({ tagTallies: initialTagTallies });
  },

  // Update tally for a player
  updateTagTally: (playerKey, selectedTags, currentQuizSettings) => {
    set(state => {
      let updatedTagTallies = state.tagTallies;

      // Check if tag tallies need to be initialized
      if (Object.keys(updatedTagTallies).length === 0) {
        updatedTagTallies = initializeTagTallies(currentQuizSettings);
      }

      // Ensure the player's tally object exists
      if (!updatedTagTallies[playerKey]) {
        updatedTagTallies[playerKey] = {};
      }

      // Increment tallies for each selected tag for the player
      selectedTags.forEach(tag => {
        updatedTagTallies[playerKey][tag] =
          (updatedTagTallies[playerKey][tag] || 0) + 1;
      });

      return { tagTallies: updatedTagTallies };
    });
  },

  startQuiz: quiz => {
    const { activeQuestionSets } = get();
    // Adjusted logic for activeQuestionSetIndex to start URLs from 1
    const activeQuestionSetIndex = activeQuestionSets[quiz.slug]
      ? activeQuestionSets[quiz.slug] + 1
      : 1;
    const totalQuestionSets = quiz?.listOfQuestionSets?.length || 0;
    if (quiz && activeQuestionSetIndex <= totalQuestionSets) {
      // Directly use activeQuestionSetIndex for navigation, ensuring URLs start from 1
      get().setActiveQuestionSet(quiz.slug, activeQuestionSetIndex);
      navigate(`/${quiz.locale}/${quiz.slug}/${activeQuestionSetIndex}/1`);
    } else {
      // If the current index exceeds the number of question sets, reset and navigate to the first set
      get().setActiveQuestionSet(quiz.slug, 1);
      navigate(`/${quiz.locale}/${quiz.slug}/1/1`);
    }
    // Reset inactivity, scores, and tallies regardless of the condition above
    get().setInactivityCount(0);
    get().initTagTallies(quiz.quizSettings);
    get().initScores(quiz.quizSettings);
  },

  goToNextQuestion: (pathname, quiz) => {
    const { locale, quizSlug, setIndex, questionIndex } =
      parsePathname(pathname);

    // Validate setIndex and currentQuestionIndex are within bounds
    const zeroBasedSetIndex = Math.max(0, setIndex - 1); // Ensures non-negative
    const totalSets = quiz.listOfQuestionSets.length;
    if (zeroBasedSetIndex >= totalSets) {
      console.error(`Set index out of bounds: ${setIndex}`);
      navigate(`/${locale}/${quizSlug}/result`);
      return;
    }

    const questionsInSet =
      quiz.listOfQuestionSets[zeroBasedSetIndex].listOfQuestions.length;
    const zeroBasedCurrentQuestionIndex = Math.max(0, questionIndex - 1); // Ensures non-negative

    // Check if there is a next question in the current set
    if (zeroBasedCurrentQuestionIndex + 1 < questionsInSet) {
      const nextQuestionIndex = zeroBasedCurrentQuestionIndex + 1;
      navigate(
        `/${locale}/${quizSlug}/${zeroBasedSetIndex + 1}/${
          nextQuestionIndex + 1
        }`
      );
    } else {
      // Navigate to the results page if there are no more questions in the set or if indices are out of bounds
      navigate(`/${locale}/${quizSlug}/result`);
    }
  },
}));

export default useQuizStore;
