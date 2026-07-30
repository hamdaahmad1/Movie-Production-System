import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function goBack(
  router: AppRouterInstance,
  defaultPath: string,
) {
  const returnTo =
    new URLSearchParams(window.location.search).get(
      "returnTo",
    );

  if (returnTo === "movie") {
    router.push("/movies/create");
    return;
  }

  router.push(defaultPath);
}

export function navigateAfterDirectorCreate(
  router: AppRouterInstance,
) {
  const returnTo =
    new URLSearchParams(window.location.search).get(
      "returnTo",
    );

  if (returnTo === "movie") {
    router.push("/movies/create");
    return;
  }

  router.push("/directors");
}

export function navigateAfterActorCreate(
  router: AppRouterInstance,
) {
  const returnTo =
    new URLSearchParams(window.location.search).get(
      "returnTo",
    );

  if (returnTo === "movie") {
    router.push("/movies/create");
    return;
  }

  router.push("/actors");
}