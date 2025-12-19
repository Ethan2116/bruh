import Header from "./components/Header/Header";
import Frame1 from "./components/Frame/Frame1";
import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.container}>
        <Frame1 />
      </div>
    </main>
  );
}
