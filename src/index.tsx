import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import "antd/dist/reset.css";
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './store';
import { BrowserRouter } from 'react-router-dom';

const store = configureStore({
    reducer: rootReducer
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>    
  </Provider>
);


