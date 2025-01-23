import { useState, useCallback } from 'react';
import { Snackbar, Button } from '@telegram-apps/telegram-ui';

const useSnackbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');

  const showSnackbar = useCallback((msg: string, desc: string) => {
    setMessage(msg);
    setDescription(desc);
    setIsVisible(true);
  }, []);

  const hideSnackbar = useCallback(() => {
    setIsVisible(false);
  }, []);

  const SnackbarComponent = () => (
    isVisible && (
      <Snackbar
        onClose={hideSnackbar}
        duration={4000}
        description={description}
        after={<Button size="s" onClick={hideSnackbar}>Close</Button>}
        className="snackbar-top"
      >
        {message}
      </Snackbar>
    )
  );

  return { showSnackbar, SnackbarComponent };
};

export default useSnackbar;