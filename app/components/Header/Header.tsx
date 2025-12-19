"use client";

import React from "react";
import styles from "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.wrap}>
            <div className={styles.bar}>
                <div className={styles.left}>
                    <span className={styles.logo}>Mahir</span>
                </div>

                <nav className={styles.nav} aria-label="Primary">
                    <a className={styles.link} href="#">Home</a>
                    <a className={styles.link} href="#">New Arrivals</a>
                    <a className={styles.link} href="#">Download</a>
                    <a className={styles.link} href="#">Pricing</a>
                </nav>

                <div className={styles.right}>
                    <a className={styles.login} href="/api/auth/login">Log in</a>
                    <button className={styles.signup} type="button">Sign Up</button>
                </div>
            </div>
        </header>
    );
}
