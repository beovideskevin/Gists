import React, {useEffect, useState} from 'react';
import {Outlet} from "react-router";
import './App.css';
import Sidebar from './components/Sidebar';
import axios from "axios";
import NavItem from "./types/NavItem";

function App() {
    const [githubToken, setGithubToken] = useState("");
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [latest, setLatest] = useState<NavItem[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('githubToken');
        if (token) {
            setGithubToken(token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            const newToken = prompt("Please enter your Github token");
            if (newToken) {
                localStorage.setItem('githubToken', newToken);
                setGithubToken(newToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            }
            else {
                alert("If you want to see your gists, please refresh the page and enter your token.");
                return;
            }
        }
        axios.get('gists?per_page=128').then(response => {
            let allItems:NavItem[] = [];
            response.data.map((records: any) => {
                const id  = records.id;
                const files = Object.keys(records.files).map((filename: string) => {
                    const item = {
                        name: filename.lastIndexOf('.') != -1 ? filename.slice(0, filename.lastIndexOf('.')) : filename,
                        id: id,
                        updated: records.updated_at,
                    }
                    allItems.push(item);
                });
            });
            // Order by name
            allItems.sort((a, b) => {
                if (a.name < b.name) {
                    return -1
                }
                if (a.name == b.name) {
                    return 0
                }
                else {
                    return 1
                }
            });
            setNavItems(allItems);
            allItems.sort((a, b) => {
                const delta = new Date(a.updated).getTime() - new Date(b.updated).getTime();
                if (delta > 0) {
                    return -1
                }
                if (delta == 0) {
                    return 0
                }
                else {
                    return 1
                }
            });
            setLatest(allItems.slice(0, 7));
        }).catch(error => {
            alert("Error fetching data. Please check your internet connection or the URL.");
            console.log(error);
        });
    }, []);

    return (
        <div id="wrapper" className="App">
            <div id="main">
                <Outlet context={latest}/>
            </div>
            <Sidebar navItems={navItems}/>
        </div>
    );
}

export default App;
