import { getCollection } from 'astro:content';

/** Prefix a path with the configured base (needed for GitHub Pages). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getTeams() {
  const teams = await getCollection('teams');
  return teams.sort((a, b) => a.data.order - b.data.order);
}

/** Ids of an entry plus all of its sub-areas. */
export function withChildren(id: string, teams: Awaited<ReturnType<typeof getTeams>>): string[] {
  return [id, ...teams.filter((t) => t.data.parent?.id === id).flatMap((t) => withChildren(t.id, teams))];
}

/** Tiles for top-level entries, or for the sub-areas of `parentId`. */
export async function getTeamTiles(parentId?: string) {
  const [posts, teams] = await Promise.all([getPosts(), getTeams()]);
  return teams
    .filter((t) => (t.data.parent?.id ?? undefined) === parentId)
    .map((t) => {
      const ids = withChildren(t.id, teams);
      const count = posts.filter((p) => ids.includes(p.data.team.id)).length;
      return {
        href: url(`solutions/${t.id}/`),
        name: t.data.name,
        description: t.data.description,
        meta: count === 0 ? 'Coming soon' : `${count} ${count === 1 ? 'post' : 'posts'}`,
        tags: teams.filter((c) => c.data.parent?.id === t.id).map((c) => c.data.name),
      };
    });
}

export async function getServices() {
  const services = await getCollection('services');
  return services.sort((a, b) => a.data.order - b.data.order);
}
