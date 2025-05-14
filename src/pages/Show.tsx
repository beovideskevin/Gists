import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {marked} from 'marked';
import axios from "axios";
import Header from "../components/Header";
import {Link} from "react-router-dom";

const Show = (props: any) => {
    const { id } = useParams();
    const [files, setFiles] = useState({});
    const [updated, setUpdated] = useState("");
    const [url, setUrl] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(`gists/${id}`).then(data => {
            setUpdated(data.data.updated_at);
            setUrl(data.data.html_url);
            setFiles(data.data.files);
        }).catch(error => {
            alert("Error fetching data. Please check your internet connection or the URL.");
            console.log(error);
        });
    }, [id]);

    const delGist = () => {
        if (window.confirm("Are you sure you want to delete this gist?")) {
            axios.delete(`gists/${id}`).then(data => {
                console.log(data);
                navigate(`/`);
            }).catch(error => {
                alert("Error fetching data. Please check your internet connection or the URL.");
                console.log(error);
            });
        }
    }

    return (
        <>
            {
                Object.entries(files).map(([filename, data]: [string, any]) => (
                    <div className="inner" key={filename}>
                        <Header filename={filename} updated={updated} url={url} />
                        <section dangerouslySetInnerHTML={{__html: marked.parse(data.content) as string}}/>
                        <div>
                            <ul className="actions">
                                <li>
                                    <button className="button" onClick={e => {
                                        delGist()
                                    }}>Delete
                                    </button>
                                </li>
                                <li><Link to={`/edit/${id}`} className="button primary">Edit</Link></li>
                            </ul>
                        </div>
                    </div>
                ))
            }
        </>
    );
}

export default Show;