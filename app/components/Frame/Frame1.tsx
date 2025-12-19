"use client";

import React from "react";
import styles from "./Frame1.module.css";

export default function Frame6() {
    return (
        <section className={styles.root}>
            <h1 className={styles.title}>
                <span className={styles.titleGradient}>
                    Music Without Limits
                </span>
            </h1>

            <p className={styles.subtitle}>
                Say goodbye to interruptions and enjoy uninterrupted music streaming.
                With our ad-free platform, you’ll have access to millions of songs.
            </p>

            <button className={styles.button}>
                Sign Up
            </button>
        </section>
    );
}