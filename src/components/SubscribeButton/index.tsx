import React from "react";
import { useSession, signIn } from "next-auth/react";
import styles from "./styles.module.scss";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import { useRouter } from "next/router";

interface SubscribeButtonProps {
  priceId: string;
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  priceId,
}) => {
  const { data: session } = useSession();

  const { push } = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    if (session?.activeSubscription) {
      push("/posts");
      return;
    }
    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;
      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
      console.log(err);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};
