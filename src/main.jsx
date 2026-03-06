import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'antd/dist/reset.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import 'nprogress/nprogress.css';
import { BrowserRouter } from 'react-router';
import NProgressProvider from './components/NProgressProvider.jsx';
import { ConfigProvider, theme } from 'antd';

const { darkAlgorithm } = theme;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: 3,
    },
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <NProgressProvider>
          <ConfigProvider
            theme={{
              algorithm: darkAlgorithm,
            }}
          >
            <App />
          </ConfigProvider>

          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: '8px' }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: '16px',
                maxWidth: '500px',
                padding: '16px 24px',
                backgroundColor: '#fff',
                color: '#374151',
              },
            }}
          />
        </NProgressProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
