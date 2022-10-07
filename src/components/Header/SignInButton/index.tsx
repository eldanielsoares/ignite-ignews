import React from "react";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { useSession, signIn, signOut } from "next-auth/react";

export const SignInButton: React.FC = () => {
  const { data: session } = useSession();
  return (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => {
        if (!session) {
          signIn("github");
        } else {
          signOut();
        }
      }}
    >
      <FaGithub color={session ? "#04d361" : "#eba417"} />
      {session ? session.user.name : "Signin with Github"}
      {session && <FiX color="#737380" className={styles.closeIcon} />}
    </button>
  );
};
