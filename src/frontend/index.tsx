import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';
import ThemeProvider from './ThemeProvider';
import { BackendProvider } from './contexts/BackendContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element with id "root" not found in the document');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BackendProvider>
          <App />
        </BackendProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);