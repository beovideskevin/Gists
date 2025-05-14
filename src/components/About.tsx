import React from "react";

const About = () => {
    return (
        <section id="about">
            <header className="major">
                <h2>About me</h2>
            </header>
            <p>Hi, my name is Kevin B. Casas. I'm a senior full stack developer, with focus on the backend.
                Over 13 years I have worked in different roles, creating APIs and SaaS products for the financial,
                telecommunications and medical industries.</p>
            <ul className="icons">
                <li><a href="https://twitter.com/kevinbcasas" className="icon brands fa-twitter" target="_blank" rel="noopener noreferrer"><span className="label">Twitter</span></a></li>
                <li><a href="https://www.facebook.com/kevinbcasas/" className="icon brands fa-facebook-f" target="_blank" rel="noopener noreferrer"><span className="label">Facebook</span></a></li>
                <li><a href="https://www.instagram.com/kevinbcasas/" className="icon brands fa-instagram" target="_blank" rel="noopener noreferrer"><span className="label">Instagram</span></a></li>
                <li><a href="https://www.linkedin.com/in/beovideskevin/" className="icon brands fa-linkedin" target="_blank" rel="noopener noreferrer"><span className="label">Linkedin</span></a></li>
                <li><a href="https://github.com/beovideskevin" className="icon brands fa-github" target="_blank" rel="noopener noreferrer"><span className="label">Facebook</span></a></li>
            </ul>
        </section>
    );
};

export default About;