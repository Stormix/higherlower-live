import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter, isRedirect } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { DefaultCatchBoundary } from "./components/organisms/error-boundary";
import { NotFound } from "./components/organisms/not-found";
import { routeTree } from "./routeTree.gen";

export type RouterContext = {
  queryClient: QueryClient;
};

export function createRouter() {
  const queryClient = new QueryClient();

  const routerContext: RouterContext = {
    queryClient,
  };

  // handle redirect without useServerFn when using tanstack query
  queryClient.getQueryCache().config.onError = handleRedirectError;
  queryClient.getMutationCache().config.onError = handleRedirectError;

  const router = createTanStackRouter({
    routeTree,
    context: routerContext,
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  });

  function handleRedirectError(error: Error) {
    if (isRedirect(error)) {
      router.navigate(
        router.resolveRedirect({
          ...error,
          _fromLocation: router.state.location,
        }),
      );
    }
  }

  return routerWithQueryClient(router, queryClient);
}
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
