import Card from "@/components/molecules/card";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

async function readCount() {
  return 10;
}

const getCount = createServerFn({
  method: "GET",
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    return count + data;
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <>
      <Card header="HigherOrLower">
        <div>Hello</div>
      </Card>
    </>
  );
}
