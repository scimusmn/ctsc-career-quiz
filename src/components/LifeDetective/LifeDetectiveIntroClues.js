import React from 'react';
import PropTypes from 'prop-types';

export default function LifeDetectiveIntroClues({ contentfulQuiz, startQuiz }) {
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center pb-[20px] pt-[203px] text-center font-GT-Walsheim text-white'>
      <img
        src='/life_detective_intro_transition_bg.jpg'
        alt='life detective intro transition background'
        className='fixed left-0 top-0 -z-[1] h-[1920px] w-[1080px] bg-black object-cover'
      />

      <h1 className='h-[123px] w-[851px] text-center text-[90px]/[103.05px] font-extrabold'>
        Gather your clues
      </h1>

      <p className='ml-[30px] mt-[40px] w-[880px] text-left text-[36px]/[41.22px] font-normal [&>b]:font-medium'>
        All life as we know it requires:
        <br /> <br />
        <b>CHEMICALS</b> called organic molecules, which contain hydrogen,
        nitrogen, oxygen, phosphorus, or sulfur.
        <br /> <br />
        <b>ENERGY</b> from heat, light, chemical reactions, or other sources.
        <br /> <br />
        <b>LIQUID WATER</b>—not ice—to absorb nutrients, perform chemical
        reactions, and eliminate waste.
        <br /> <br />
        Other worlds with some or all of these conditions might support simple
        life forms!
        <br /> <br />
        Your search begins with Jupiter. The planet has about 100 moons, only
        some of them are likely suspects.
      </p>

      <button
        type='button'
        className='mt-auto h-[110px] w-[509px] rounded-[40px] border-[10px] border-white/50 bg-white/30 active:scale-95 active:bg-white/60'
        onClick={() => startQuiz(contentfulQuiz)}
      >
        <span className='font-Gugi text-[55px] font-normal text-white [text-shadow:4px_6px_8px_#00000099]'>
          Tap to start
        </span>
      </button>
    </div>
  );
}

LifeDetectiveIntroClues.propTypes = {
  contentfulQuiz: PropTypes.object.isRequired,
  startQuiz: PropTypes.func.isRequired,
};
