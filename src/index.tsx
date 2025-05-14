import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from "axios";
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import List from './pages/List';
import Show from './pages/Show';
import Create from './pages/Create';
import Edit from './pages/Edit';

axios.defaults.baseURL = "https://api.github.com/";
axios.defaults.headers.common['Accept'] = `application/vnd.github+json`;
axios.defaults.headers.common['X-GitHub-Api-Version'] = `2022-11-28`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<App />}>
                    <Route index element={<List />} />
                    <Route path='show/:id' element={<Show />} />
                    <Route path='create' element={<Create />} />
                    <Route path='edit/:id' element={<Edit />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
