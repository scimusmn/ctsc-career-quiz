import { useEffect } from 'react';

export default function useKeyPress(targetKeys, callback = () => {}) {
  useEffect(() => {
    const upHandler = ({ key }) => {
      if (targetKeys.includes(key)) {
        callback(key);
      }
    };

    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKeys, callback]);
}
