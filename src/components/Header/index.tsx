/* eslint-disable @next/next/no-img-element */
import React from "react";
import { SignInButton } from "./SignInButton";
import styles from "./styles.module.scss";
import { ActiveLink } from "../ActiveLink";
export const Header: React.FC = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/ig.news.svg" alt="ig.news" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
};
