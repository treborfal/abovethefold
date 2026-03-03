# Codebase Task Proposals

## 1) Typo fix task
**Task:** Correct the typo in `js/abovethefold.js` comment from `Hide Header on on scroll down` to `Hide header on scroll down`.

**Why:** The duplicated word (`on on`) is a straightforward typo in a top-level comment and should be cleaned up for readability.

## 2) Bug fix task
**Task:** Replace or remove the jQuery fallback reference in `index.html` (`js/vendor/jquery.min.js`) because that path is not present in the repository.

**Why:** If CDN loading fails, the current fallback points to a missing local file, which can break subsequent scripts that depend on jQuery (`abovethefold.js`, FitText usage).

## 3) Documentation/comment discrepancy task
**Task:** Update the stale IE8 support comment in `index.html` near the HTML5 shim include to reflect current browser support policy (or remove the dead conditional block if no longer supported).

**Why:** The page includes a legacy comment and conditional block for IE8. This no longer matches modern support assumptions and creates confusion about actual compatibility expectations.

## 4) Test improvement task
**Task:** Add a lightweight browser test (e.g., Playwright) that loads `index.html`, stubs `links.json`, and asserts that:
- `#links-list` is populated from `secondaryLinks`
- each rendered link has `target="_blank"`
- no console errors occur during link rendering

**Why:** The dynamic link list is one of the few behavior-driven parts of the page and currently has no automated coverage. A small smoke test would catch regressions in JSON shape handling and DOM rendering.
