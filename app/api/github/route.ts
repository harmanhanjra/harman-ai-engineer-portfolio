import { NextResponse } from "next/server";

const GITHUB_URL = "https://api.github.com/users/harmanhanjra/repos?sort=updated&per_page=12";
const TIMEOUT_MS = 5_000;

type GitHubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
};

function isGitHubRepo(value: unknown): value is GitHubRepo {
  if (!value || typeof value !== "object") return false;
  const repo = value as Record<string, unknown>;
  return (
    typeof repo.name === "string" &&
    typeof repo.html_url === "string" &&
    (typeof repo.description === "string" || repo.description === null) &&
    (typeof repo.language === "string" || repo.language === null) &&
    typeof repo.stargazers_count === "number" &&
    typeof repo.fork === "boolean"
  );
}

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(GITHUB_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 900 },
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      return NextResponse.json([], { status: 200 });
    }

    const repos = payload
      .filter(isGitHubRepo)
      .filter((repo) => !repo.fork)
      .slice(0, 6)
      .map(({ fork: _fork, ...repo }) => repo);

    return NextResponse.json(repos, {
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  } finally {
    clearTimeout(timeout);
  }
}
