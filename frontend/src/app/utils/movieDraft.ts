const MOVIE_DRAFT_KEY = "movie-create-draft";
const NEW_DIRECTOR_KEY = "movie-create-new-director";
const NEW_ACTORS_KEY = "movie-create-new-actors";

/* ---------------- Movie Draft ---------------- */

export function saveMovieDraft(data: any) {
  sessionStorage.setItem(
    MOVIE_DRAFT_KEY,
    JSON.stringify(data),
  );
}

export function restoreMovieDraft() {
  const draft = sessionStorage.getItem(
    MOVIE_DRAFT_KEY,
  );

  if (!draft) {
    return null;
  }

  return JSON.parse(draft);
}

export function clearMovieDraft() {
  sessionStorage.removeItem(
    MOVIE_DRAFT_KEY,
  );
}

/* ---------------- Director ---------------- */

export function saveNewDirector(id: number) {
  sessionStorage.setItem(
    NEW_DIRECTOR_KEY,
    id.toString(),
  );
}

export function getNewDirector() {
  const id = sessionStorage.getItem(
    NEW_DIRECTOR_KEY,
  );

  if (!id) {
    return null;
  }

  return Number(id);
}

export function clearNewDirector() {
  sessionStorage.removeItem(
    NEW_DIRECTOR_KEY,
  );
}

/* ---------------- Actors ---------------- */

export function saveNewActor(id: number) {
  const actors = getNewActors();

  if (!actors.includes(id)) {
    actors.push(id);
  }

  sessionStorage.setItem(
    NEW_ACTORS_KEY,
    JSON.stringify(actors),
  );
}

export function getNewActors(): number[] {
  const actors = sessionStorage.getItem(
    NEW_ACTORS_KEY,
  );

  if (!actors) {
    return [];
  }

  return JSON.parse(actors);
}

export function clearNewActors() {
  sessionStorage.removeItem(
    NEW_ACTORS_KEY,
  );
}