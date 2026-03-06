import { useEffect } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import NProgress from 'nprogress';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
});

const NProgressProvider = ({ children }) => {
  const location = useLocation();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [location.pathname]);

  useEffect(() => {
    if (isFetching || isMutating) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isFetching, isMutating]);

  return children;
};

export default NProgressProvider;
