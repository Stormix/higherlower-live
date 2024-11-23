import Button from "@/components/atoms/button";
import Footer from "@/components/molecules/footer";
import { signIn } from "@/lib/client/auth";
import { createFileRoute } from "@tanstack/react-router";
import { FaTwitch } from "react-icons/fa";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center gap-4 w-1/4 flex-grow">
        <h1 className="text-gradient text-4xl font-bold">HigherOrLower</h1>
        <h2 className="text-sm uppercase">Controlled by Twitch Chat</h2>

        <Button
          aria-label="Login with Twitch"
          intent="twitch"
          icon={<FaTwitch size={24} />}
          className="gap-4 px-8 my-8"
          onClick={() =>
            signIn.social({
              provider: "twitch",
              callbackURL: "/game",
            })
          }
        >
          Login with Twitch
        </Button>
        <p className="text-xs text-muted text-center leading-5">By signing in you accept our TOS & Privacy policy.</p>
      </div>

      <Footer />
    </main>
  );
}
