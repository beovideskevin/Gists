import React from 'react';
import Header from "../components/Header";

const NotFound = () => {
    return (
        <div id="main" className="noOverflowX">
            <div className="inner">
                <Header filename="" url="" id="" />
                <section>
                    <h2>404 Not Found</h2>
                    <p>The page you are looking for does not exist.</p>
                </section>
            </div>
        </div>
    );
}

export default NotFound;