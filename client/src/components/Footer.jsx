import React from "react";

function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer>
            <p>Copyright RUTINE {year}</p>
        </footer>
    );
}

export default Footer;
