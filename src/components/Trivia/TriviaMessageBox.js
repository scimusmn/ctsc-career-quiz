import React from 'react';
import PropTypes from 'prop-types';

export default function TriviaMessageBox({ children }) {
  return (
    <div className='h-[941px] w-[1052px] rounded-[40px] bg-black/70 px-[17px] pb-[78px] pt-[30px] text-left'>
      <p className='mb-[10px] ml-[61px] text-[40px] font-extrabold text-white'>
        Message
      </p>

      <div className='relative flex h-[764px] w-[1017px] flex-col rounded-[40px] bg-white/10 pl-[28px] pt-[36px]'>
        {children}
      </div>
    </div>
  );
}

TriviaMessageBox.propTypes = {
  children: PropTypes.node.isRequired,
};
