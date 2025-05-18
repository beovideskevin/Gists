import React, {useEffect, useState} from 'react';
import {Outlet,useLocation} from "react-router";
import './App.css';
import Sidebar from './components/Sidebar';
import axios from "axios";
import NavItem from "./types/NavItem";
import Gist from "./types/Gist";

function App() {
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [starred, setStarred] = useState<Gist[]>([]);
    const [latest, setLatest] = useState<Gist>({
        id: "",
        filename: "",
        description: "",
        abstract: "",
        url: "",
        updated: "",
    });
    let location = useLocation()

    useEffect(() => {
        const token = localStorage.getItem('githubToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            const newToken = prompt("Please enter your Github token");
            if (newToken) {
                localStorage.setItem('githubToken', newToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            }
            else {
                alert("If you want to see your gists, please refresh the page and enter your token.");
                return;
            }
        }

        // Get all gists, 128 at a time, it you have more... you need to go outside and play...
        axios.get('gists?per_page=128').then(response => {
            let allItems:NavItem[] = [];
            response.data.map((record: any) => {
                Object.keys(record.files).map((filename: string) => {
                    const item = {
                        id: record.id,
                        name: filename.lastIndexOf('.') !== -1 ? filename.slice(0, filename.lastIndexOf('.')) : filename,
                        starred: false,
                        updated: record.updated_at
                    }
                    allItems.push(item);
                });
            });

            // Get the last worked on gist
            const latest = response.data.reduce((latest: any, item: any) => {
                return item.files && new Date(item.updated_at).getTime() > new Date(latest.updated_at).getTime() ? item : latest;
            }, response.data[0]);
            if (latest) {
                let latestFilename = latest.files[Object.keys(latest.files)[0]].filename;
                setLatest({
                    id: latest.id,
                    filename: latestFilename.lastIndexOf('.') !== -1 ? latestFilename.slice(0, latestFilename.lastIndexOf('.')) : latestFilename,
                    description: latest.description,
                    abstract: "",
                    url: latest.html_url,
                    updated: latest.updated_at,
                });
            }

            // Get starred items
            let starredItems:Gist[] = [];
            axios.get(`gists/starred`).then(response => {
                response.data.map((record: any) => {
                    // Set the nav link to starred in the sidebar
                    allItems.filter((item: NavItem) => item.id === record.id).map((starred: NavItem) => {starred.starred = true});
                    // If this record is already presented as the latest gist, skip it
                    if (latest?.id === record.id) {
                        return;
                    }
                    Object.keys(record.files).map((filename: string) => {
                        const item = {
                            id: record.id,
                            filename: filename.lastIndexOf('.') !== -1 ? filename.slice(0, filename.lastIndexOf('.')) : filename,
                            description: record.description,
                            abstract: "",
                            url: record.html_url,
                            updated: record.updated_at,
                        }
                        starredItems.push(item);
                    });
                });

                // Fill the array with empty items because otherwise the design breaks a little
                while(starredItems.length < 6) {
                    starredItems.push({
                        id: "",
                        filename: "",
                        description: "",
                        abstract: "",
                        url: "",
                        updated: "",
                    });
                }
                setStarred(starredItems.slice(0, 6));
            }).catch(error => {
                console.log(error);
            });

            // Order sidebar links by name
            allItems.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1
                }
                if (a.name.toLowerCase() === b.name.toLowerCase()) {
                    return 0
                }
                else {
                    return 1
                }
            });
            setNavItems(allItems);
        }).catch(error => {
            alert("Error fetching data. Please check your internet connection or the URL.");
            console.log(error);
        });
    }, [location]);

    return (
        <div id="wrapper" className="App">
            <Outlet context={{latest, starred}}/>
            <Sidebar navItems={navItems}/>
        </div>
    );
}

export default App;
