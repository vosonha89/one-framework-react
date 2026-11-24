#!/usr/bin/env node
/**
 * Initializes a project scaffolded from one-react-template: renames every
 * branding touch point and optionally strips the demo feature so the new app
 * starts clean. Zero dependencies, idempotent, non-interactive (CI friendly).
 *
 * Usage: npm run init -- --name my-app [--title "My App"] [--api-url https://api.example.com]
 *                       [--strip-demo] [--dry-run] [--force]
 */
import { access, mkdir, readFile, rename, rm, rmdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const TEMPLATE_NAME = "one-react-template";
const TEMPLATE_TITLE = "One React Template";
const DEMO_API_URL = "https://dummyjson.com";
const DEFAULT_API_URL = "https://your-api-url.com";
const PROVENANCE_FILE = ".template.json";

/** Files that must exist for the current directory to be a template project. */
const ROOT_SIGNATURE = [
  "package.json",
  "vite.config.ts",
  "plopfile.mjs",
  "tsconfig.app.json",
  "src/main.tsx",
  "src/core/index.ts",
];

/** Paths the script must never write to or delete from. */
const DENIED_PREFIXES = ["src/core", "templates", "public", "dist", "node_modules"];

/** Mode-agnostic and per-mode environment files shipped by the template. */
const ENV_FILES = [
  "configuration/environment/.env",
  "configuration/environment/env.development",
  "configuration/environment/env.uat",
  "configuration/environment/env.production",
];

/** Demo feature closure removed by --strip-demo. */
const DEMO_FILES = [
  "src/views/sample/Sample.tsx",
  "src/views/sample/Sample.hook.tsx",
  "src/views/sample/Sample.state.ts",
  "src/views/sample/Sample.model.ts",
  "src/views/sample/Sample.scss",
  "src/views/ui-kit/UiKit.tsx",
  "src/views/ui-kit/UiKit.hook.tsx",
  "src/views/ui-kit/UiKit.state.ts",
  "src/views/ui-kit/UiKit.model.ts",
  "src/views/ui-kit/UiKit.scss",
  "src/services/sample.Service.ts",
  "src/services/requestObject/sample.Request.ts",
  "src/services/responseObject/sample.Response.ts",
  "src/types/sampleObject.ts",
];

/** Demo view folders emptied by --strip-demo (removed only when empty). */
const DEMO_DIRS = ["src/views/sample", "src/views/ui-kit"];

/** Starter home view written by --strip-demo (UI only, Tailwind styled). */
const HOME_VIEW = `import React from "react";
import { AppEnvironment } from "../../common/constants/appEnvironment";

/**
 * Starter home view. UI only; replace it with your own layered views.
 * @returns The home view element.
 */
function Home(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-semibold text-gray-900">
        {AppEnvironment.VITE_APP_TITLE}
      </h1>
      <p className="max-w-xl text-sm text-gray-600">
        Your project is ready. Generate a layered view with{" "}
        <code className="rounded bg-gray-100 px-1 py-0.5">
          npx plop view --name Product
        </code>
        .
      </p>
    </div>
  );
}

export default Home;
`;

/** Route table written by --strip-demo (demo routes removed). */
const HOME_ROUTER = `import { Navigate } from "react-router-dom";
import Home from "./views/home/Home";

/**
 * Application route names.
 */
export class AppRouterName {
  public static readonly home = "/";
  public static readonly noMatch = "*";
}

/**
 * Application route table.
 */
export const AppRouter = [
  {
    path: AppRouterName.noMatch,
    element: <Navigate to={AppRouterName.home} replace />,
  },
  {
    path: AppRouterName.home,
    element: <Home />,
  },
];
`;

/** Sample translations contract removed from languageText.ts by --strip-demo. */
const SAMPLE_TEXT_BLOCK = `/**
 * Sample feature translations.
 */
export interface SampleText {
  title: string;
  search: string;
  keyword: string;
  empty: string;
  price: string;
}

`;

/** Recorded plan entries, printed for --dry-run and for the final summary. */
const operations = [];

/**
 * Abort initialization with a user facing message.
 * @param {string} message Reason the initialization cannot continue.
 * @returns {never} Always throws.
 */
function fail(message) {
  throw new Error(message);
}

/**
 * Record a planned or applied operation.
 * @param {string} kind Operation kind: write, delete or skip.
 * @param {string} file Project relative path.
 * @param {string} detail Human readable description.
 * @returns {void}
 */
function record(kind, file, detail) {
  operations.push({ kind, file, detail });
}

/**
 * Parse CLI flags into an options object.
 * @param {string[]} argv Arguments after the script name.
 * @returns {{name: string|null, title: string|null, apiUrl: string|null, stripDemo: boolean, dryRun: boolean, force: boolean}} Parsed options.
 */
function parseArgs(argv) {
  const options = {
    name: null,
    title: null,
    apiUrl: null,
    stripDemo: false,
    dryRun: false,
    force: false,
  };
  const valueFlags = { "--name": "name", "--title": "title", "--api-url": "apiUrl" };
  const boolFlags = { "--strip-demo": "stripDemo", "--dry-run": "dryRun", "--force": "force" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const eq = arg.indexOf("=");
    const flag = eq === -1 ? arg : arg.slice(0, eq);
    if (Object.hasOwn(boolFlags, flag)) {
      options[boolFlags[flag]] = true;
    } else if (Object.hasOwn(valueFlags, flag)) {
      const value = eq === -1 ? argv[i + 1] : arg.slice(eq + 1);
      if (eq === -1) {
        i += 1;
      }
      if (!value || value.startsWith("--")) {
        fail(`${flag} requires a value.`);
      }
      options[valueFlags[flag]] = value;
    } else {
      fail(`Unknown option "${arg}". See the script header for usage.`);
    }
  }
  return options;
}

/**
 * Convert a folder name into a candidate npm package name.
 * @param {string} raw Raw folder or project name.
 * @returns {string} Lowercase kebab-case candidate.
 */
function sanitizeName(raw) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-~._]+/g, "-")
    .replace(/^[.-]+/, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Validate an npm package name.
 * @param {string} name Candidate package name.
 * @returns {void}
 */
function assertName(name) {
  const pattern = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
  if (!name || name.length > 214 || !pattern.test(name)) {
    fail(`Invalid package name "${name}". Use lowercase kebab-case, e.g. --name my-app.`);
  }
  if (name === TEMPLATE_NAME) {
    fail('Pick a project name other than "one-react-template", e.g. --name my-app.');
  }
}

/**
 * Validate a human readable app title (dotenv and HTML safe).
 * @param {string} title Candidate application title.
 * @returns {void}
 */
function assertTitle(title) {
  if (!title || title.length > 80 || /[\n\r$#"'`\\]/.test(title) || title.trim() !== title) {
    fail('Invalid title. Use 1-80 characters without quotes, $, #, backslashes or line breaks.');
  }
}

/**
 * Validate an API base URL used in environment files.
 * @param {string} url Candidate API base URL.
 * @returns {void}
 */
function assertApiUrl(url) {
  if (!/^https?:\/\/[^\s$#"'`\\]+$/.test(url)) {
    fail("Invalid --api-url. Use an http(s) URL without spaces, quotes, $ or #.");
  }
}

/**
 * Ensure the current directory is a template project, not an arbitrary folder.
 * @param {string} root Absolute project root.
 * @returns {Promise<void>}
 */
async function assertRoot(root) {
  if (root.split(path.sep).includes("node_modules")) {
    fail("Refusing to run inside node_modules.");
  }
  for (const rel of ROOT_SIGNATURE) {
    try {
      await access(path.join(root, rel));
    } catch {
      fail(`Not a one-react-template project (missing "${rel}"). Run npm run init inside the scaffolded app folder.`);
    }
  }
}

/**
 * Resolve a project relative path and enforce the write deny-list.
 * @param {string} root Absolute project root.
 * @param {string} rel Project relative path.
 * @returns {string} Absolute path inside the project.
 */
function resolveSafe(root, rel) {
  const abs = path.resolve(root, rel);
  if (abs !== root && !abs.startsWith(root + path.sep)) {
    fail(`Refusing to touch a path outside the project: ${rel}`);
  }
  const normalized = rel.split(path.sep).join("/");
  if (DENIED_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))) {
    fail(`Refusing to touch protected path: ${rel}`);
  }
  return abs;
}

/**
 * Read a UTF-8 file, returning null when it does not exist.
 * @param {string} file Absolute file path.
 * @returns {Promise<string|null>} File content or null.
 */
async function readText(file) {
  try {
    return await readFile(file, "utf8");
  } catch (err) {
    if (err && err.code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

/**
 * Keep the original trailing-newline state of a file.
 * @param {string|null} original Previous content, if any.
 * @param {string} next New content.
 * @returns {string} Content with matching end-of-file newline.
 */
function matchEol(original, next) {
  if (original === null) {
    return next;
  }
  const hadNewline = original.endsWith("\n");
  const hasNewline = next.endsWith("\n");
  if (hadNewline && !hasNewline) {
    return `${next}\n`;
  }
  if (!hadNewline && hasNewline) {
    return next.slice(0, -1);
  }
  return next;
}

/**
 * Write a file atomically, skipping identical content and honoring --dry-run.
 * @param {string} root Absolute project root.
 * @param {string} rel Project relative path.
 * @param {string} content Full new content.
 * @param {boolean} dryRun When true, only record the plan.
 * @returns {Promise<void>}
 */
async function writeText(root, rel, content, dryRun) {
  const abs = resolveSafe(root, rel);
  const previous = await readText(abs);
  const next = matchEol(previous, content);
  if (previous === next) {
    record("skip", rel, "already up to date");
    return;
  }
  record("write", rel, previous === null ? "create" : "update");
  if (dryRun) {
    return;
  }
  await mkdir(path.dirname(abs), { recursive: true });
  const tmp = `${abs}.${process.pid}.tmp`;
  await writeFile(tmp, next, "utf8");
  await rename(tmp, abs);
}

/**
 * Delete a file, tolerating an already removed demo file.
 * @param {string} root Absolute project root.
 * @param {string} rel Project relative path.
 * @param {boolean} dryRun When true, only record the plan.
 * @returns {Promise<void>}
 */
async function removeFile(root, rel, dryRun) {
  const abs = resolveSafe(root, rel);
  if ((await readText(abs)) === null) {
    record("skip", rel, "already removed");
    return;
  }
  record("delete", rel, "demo file");
  if (!dryRun) {
    await rm(abs, { force: true });
  }
}

/**
 * Remove a demo folder only when it is empty.
 * @param {string} root Absolute project root.
 * @param {string} rel Project relative directory.
 * @param {boolean} dryRun When true, only record the plan.
 * @returns {Promise<void>}
 */
async function removeEmptyDir(root, rel, dryRun) {
  const abs = resolveSafe(root, rel);
  if (dryRun) {
    record("delete", rel, "empty demo folder");
    return;
  }
  try {
    await rmdir(abs);
    record("delete", rel, "empty demo folder");
  } catch (err) {
    const reason = err && err.code === "ENOENT" ? "folder already removed" : "folder not empty, kept";
    record("skip", rel, reason);
  }
}

/**
 * Replace an exact token, returning null when the token is absent.
 * @param {string} content Current file content.
 * @param {string} from Exact token to replace.
 * @param {string} to Replacement text.
 * @returns {string|null} Updated content or null.
 */
function replaceToken(content, from, to) {
  return content.includes(from) ? content.split(from).join(to) : null;
}

/**
 * Replace the value of a dotenv style key on its own line.
 * @param {string} content Current file content.
 * @param {string} key Environment variable name.
 * @param {string} value New value.
 * @returns {string|null} Updated content or null when the key is absent.
 */
function replaceEnvValue(content, key, value) {
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (!pattern.test(content)) {
    return null;
  }
  const next = content.replace(pattern, `${key}=${value}`);
  return next === content ? null : next;
}

/**
 * Escape a title for safe insertion into HTML.
 * @param {string} value Raw title.
 * @returns {string} HTML escaped title.
 */
function escapeHtml(value) {
  return value
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;");
}

/**
 * Apply every branding rename target.
 * @param {string} root Absolute project root.
 * @param {{name: string, title: string, apiUrl: string}} options Resolved options.
 * @param {boolean} dryRun When true, only record the plan.
 * @returns {Promise<void>}
 */
async function applyRename(root, options, dryRun) {
  const { name, title, apiUrl } = options;

  const pkgRel = "package.json";
  const pkg = await readText(resolveSafe(root, pkgRel));
  const renamedPkg = replaceToken(pkg, `"name": "${TEMPLATE_NAME}"`, `"name": "${name}"`);
  if (renamedPkg !== null) {
    await writeText(root, pkgRel, renamedPkg, dryRun);
  } else {
    record("skip", pkgRel, "package name already customized");
  }

  for (const rel of ENV_FILES) {
    const content = await readText(resolveSafe(root, rel));
    if (content === null) {
      record("skip", rel, "environment file absent");
      continue;
    }
    let next = replaceEnvValue(content, "VITE_APP_TITLE", title) ?? content;
    const apiNext = apiUrl === DEFAULT_API_URL
      ? replaceToken(next, DEMO_API_URL, apiUrl)
      : replaceEnvValue(next, "VITE_APP_API_URL", apiUrl);
    next = apiNext ?? next;
    if (next === content) {
      record("skip", rel, "environment already up to date");
    } else {
      await writeText(root, rel, next, dryRun);
    }
  }

  const htmlRel = "index.html";
  const html = await readText(resolveSafe(root, htmlRel));
  const nextHtml = html === null ? null : replaceToken(html, `<title>${TEMPLATE_TITLE}</title>`, `<title>${escapeHtml(title)}</title>`);
  if (nextHtml !== null) {
    await writeText(root, htmlRel, nextHtml, dryRun);
  } else {
    record("skip", htmlRel, "title already customized");
  }

  for (const rel of ["src/assets/language/en.json", "src/assets/language/vi.json"]) {
    const content = await readText(resolveSafe(root, rel));
    const next = content === null ? null : replaceToken(content, `"appName": "${TEMPLATE_TITLE}"`, `"appName": ${JSON.stringify(title)}`);
    if (next !== null) {
      await writeText(root, rel, next, dryRun);
    } else {
      record("skip", rel, "appName already customized");
    }
  }

  const docTargets = [
    ["README.md", `# ${TEMPLATE_TITLE}`, `# ${title}`],
    ["agent.md", `# Agent Guide for ${TEMPLATE_NAME}`, `# Agent Guide for ${name}`],
    [".env.example", `# Example environment variables for ${TEMPLATE_NAME}`, `# Example environment variables for ${name}`],
  ];
  for (const [rel, from, to] of docTargets) {
    const content = await readText(resolveSafe(root, rel));
    const next = content === null ? null : replaceToken(content, from, to);
    if (next !== null) {
      await writeText(root, rel, next, dryRun);
    } else {
      record("skip", rel, "heading already customized");
    }
  }
}

/**
 * Remove the demo feature and install a clean starter home view.
 * @param {string} root Absolute project root.
 * @param {boolean} dryRun When true, only record the plan.
 * @returns {Promise<void>}
 */
async function applyStripDemo(root, dryRun) {
  for (const rel of DEMO_FILES) {
    await removeFile(root, rel, dryRun);
  }
  await writeText(root, "src/views/home/Home.tsx", HOME_VIEW, dryRun);
  await writeText(root, "src/AppRouter.tsx", HOME_ROUTER, dryRun);
  for (const rel of DEMO_DIRS) {
    await removeEmptyDir(root, rel, dryRun);
  }

  const typesRel = "src/common/types/languageText.ts";
  const types = await readText(resolveSafe(root, typesRel));
  if (types !== null) {
    let next = replaceToken(types, "  sample: SampleText;\n", "") ?? types;
    next = replaceToken(next, SAMPLE_TEXT_BLOCK, "") ?? next;
    if (next === types) {
      record("skip", typesRel, "sample contract already removed");
    } else {
      await writeText(root, typesRel, next, dryRun);
    }
  }

  for (const rel of ["src/assets/language/en.json", "src/assets/language/vi.json"]) {
    const content = await readText(resolveSafe(root, rel));
    if (content === null) {
      record("skip", rel, "locale file absent");
      continue;
    }
    const locale = JSON.parse(content);
    if (!Object.hasOwn(locale, "sample")) {
      record("skip", rel, "sample keys already removed");
      continue;
    }
    delete locale.sample;
    await writeText(root, rel, JSON.stringify(locale, null, 2), dryRun);
  }
}

/**
 * Write the provenance record describing this initialization.
 * @param {string} root Absolute project root.
 * @param {{name: string, title: string, stripDemo: boolean}} options Resolved options.
 * @param {object|null} previous Existing provenance record, if any.
 * @param {boolean} dryRun When true, only record the plan.
 * @returns {Promise<void>}
 */
async function writeProvenance(root, options, previous, dryRun) {
  const provenanceRecord = {
    templateVersion: (previous && previous.templateVersion) || "1.0.0",
    name: options.name,
    title: options.title,
    stripDemo: options.stripDemo,
    initializedAt: new Date().toISOString(),
  };
  await writeText(root, PROVENANCE_FILE, `${JSON.stringify(provenanceRecord, null, 2)}\n`, dryRun);
}

/**
 * Print the recorded plan or the applied summary.
 * @param {boolean} dryRun Whether the run was a dry run.
 * @returns {void}
 */
function printSummary(dryRun) {
  const rank = { write: 3, delete: 2, skip: 1 };
  const byFile = new Map();
  for (const op of operations) {
    const existing = byFile.get(op.file);
    if (!existing) {
      byFile.set(op.file, { kind: op.kind, detail: op.detail });
      continue;
    }
    if (rank[op.kind] > rank[existing.kind]) {
      existing.kind = op.kind;
    }
    existing.detail = `${existing.detail}; ${op.detail}`;
  }
  const counts = { write: 0, delete: 0, skip: 0 };
  for (const [file, op] of byFile) {
    counts[op.kind] += 1;
    console.log(`${dryRun ? "plan" : op.kind.padEnd(6)} ${file} (${op.detail})`);
  }
  console.log(`\n${dryRun ? "Dry run" : "Done"}: ${counts.write} written, ${counts.delete} deleted, ${counts.skip} skipped.`);
  if (!dryRun) {
    console.log("Next: npm install, then npm run dev. Review changes with git diff.");
  }
}

/**
 * Entry point: validate, plan and apply the initialization.
 * @returns {Promise<void>}
 */
async function main() {
  const root = process.cwd();
  const options = parseArgs(process.argv.slice(2));
  await assertRoot(root);

  const name = options.name ?? sanitizeName(path.basename(root));
  assertName(name);
  const title = options.title ?? name;
  assertTitle(title);
  const apiUrl = options.apiUrl ?? DEFAULT_API_URL;
  assertApiUrl(apiUrl);

  const provenance = await readText(resolveSafe(root, PROVENANCE_FILE));
  const previous = provenance === null ? null : JSON.parse(provenance);
  if (previous && previous.initializedAt && !options.force) {
    fail(`Already initialized as "${previous.name}" on ${previous.initializedAt}. Re-run with --force to override.`);
  }

  const pkg = JSON.parse(await readText(resolveSafe(root, "package.json")));
  if (pkg.name !== TEMPLATE_NAME && pkg.name !== name && !options.force) {
    fail(`package.json name is "${pkg.name}", expected "${TEMPLATE_NAME}" or "${name}". Use --force to override.`);
  }

  const resolved = { name, title, apiUrl, stripDemo: options.stripDemo };
  await applyRename(root, resolved, options.dryRun);
  if (options.stripDemo) {
    await applyStripDemo(root, options.dryRun);
  }
  await writeProvenance(root, resolved, previous, options.dryRun);
  printSummary(options.dryRun);
}

main().catch((err) => {
  console.error(`init failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});