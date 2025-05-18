import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import axios from "axios";
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import List from './pages/List';
import Show from './pages/Show';
import Create from './pages/Create';
import Edit from './pages/Edit';
import NotFound from './pages/NotFound';
import {marked} from "marked";
import {getHeadingList, gfmHeadingId} from "marked-gfm-heading-id";

axios.defaults.baseURL = "https://api.github.com/";
axios.defaults.headers.common['Accept'] = `application/vnd.github+json`;
axios.defaults.headers.common['X-GitHub-Api-Version'] = `2022-11-28`;

marked.use(gfmHeadingId({prefix: "",}), {
    hooks: {
        postprocess(html) {
            const headings = getHeadingList();
            let output = "<div id='table-of-contents'><h2>Table of contents</h2>";
            let level = 0;
            headings.forEach((item) => {
                if (item.level > level) {
                    output += `<ol id="table-of-contents-ol">`;
                } else if (level === item.level) {
                    output += `</li>`;
                } else if (item.level < level) {
                    output += `</li></ol></li>`;
                }
                output += `<li><a href="#${item.id}" class="index-header${item.level}">${item.raw}</a>`;
                level = item.level;
            });
            for (; level > 0; level--) {
                output += `</li></ol>`;
            }
            output += `</div>`;
            return `${output}${html}`
        }
    }
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<App/>}>
                    <Route index element={<List/>}/>
                    <Route path='show/:id' element={<Show/>}/>
                    <Route path='create' element={<Create/>}/>
                    <Route path='edit/:id' element={<Edit/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
