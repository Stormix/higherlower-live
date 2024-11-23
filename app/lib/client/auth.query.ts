import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { getEvent } from "vinxi/http";

export const getAuth = createServerFn({ method: "GET" }).handler(() => {
  const event = getEvent();
  return event?.context?.auth ?? null;
});

export const authQueryOptions = () =>
  queryOptions({
    queryKey: ["getAuth"],
    queryFn: () => getAuth(),
  });

export const useAuthQuery = () => {
  return useSuspenseQuery(authQueryOptions());
};
