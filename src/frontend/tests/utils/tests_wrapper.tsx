import React from 'react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import store from '../../redux/main';

const TestWrapper: React.FC = ({ children }) => (
  <Provider store={store}>
    <SnackbarProvider>
      {children}
    </SnackbarProvider>
  </Provider>
);

export default TestWrapper;
