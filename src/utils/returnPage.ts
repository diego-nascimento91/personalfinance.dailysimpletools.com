import { NavigateFunction } from 'react-router-dom';

export const returnPage = (nav: NavigateFunction) => {
  if (window.history.state && window.history.state.idx > 0) {
    nav(-1);
  } else {
    nav('/', { replace: true }); // return to home if there is no back page history
  }
};