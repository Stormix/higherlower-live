import { queryOptions, useQuery } from "@tanstack/react-query";
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
  const { data } = useQuery(authQueryOptions());
  return data?.user ?? null;
};
