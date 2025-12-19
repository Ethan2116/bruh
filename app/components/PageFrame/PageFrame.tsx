import React from "react";
import styles from "./PageFrame.module.css";

type Props = {
    children: React.ReactNode;
};

export default function PageFrame({ children }: Props) {
    return (
        <main className={styles.page}>
            <div className={styles.container}>{children}</div>
        </main>
    );
}
