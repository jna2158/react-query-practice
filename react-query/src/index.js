import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// react-query
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();

/*
< react query 알아보기 >
1. useQuery
  - 데이터를 get 하기위한 api
  - useQuery(uniqueKey, api)
  - uniqueKey는 다른 컴포넌트에서도 해당 키를 사용하면 호출 가능
  - 비동기로 동작
  - 옵션을 이용해 동기적으로 동작 가능

*/