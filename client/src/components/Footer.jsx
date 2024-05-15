// client/src/components/Footer.jsx
import React from "react";

function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer>
            <p>Copyright © {year} RUTINE </p>
        </footer>
    );
}

export default Footer;
