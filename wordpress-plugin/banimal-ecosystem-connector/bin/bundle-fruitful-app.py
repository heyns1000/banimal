#!/usr/bin/env python3
"""Bundle the Fruitful™ OmniGrid app (heyns1000/fruitful) into this plugin's app/ folder.

The app is a static site written for a domain root ("/omnigrid-app.js", "/sectors/..."). Inside
WordPress it is served under /fruitful-app/, so every site-root link is rewritten to a relative one.
Nothing else in the pages changes: no markup, no CSS, no scripts beyond the link paths.

Checks before it writes anything (it refuses to build if one fails):
  - every bundled brand mark matches its pinned git blob SHA in banimal docs/brand/canonical-brand-manifest.json
  - no file carries a secret-shaped value or a personal contact detail

Usage: bin/bundle-fruitful-app.py <fruitful-repo> [<banimal-repo>]
"""
import hashlib, json, os, re, shutil, sys

SRC = os.path.abspath(sys.argv[1])
PLUGIN = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BANIMAL = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else os.path.join(PLUGIN, "..", ".."))
OUT = os.path.join(PLUGIN, "app")

# What a browser needs; repo tooling, docs and server code stay out of a live site.
SKIP_DIRS = {".git", ".github", "node_modules", "backend", "docs", "config", "dist", "tests", "__pycache__"}
KEEP_EXT = {".html", ".htm", ".js", ".css", ".json", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico",
            ".mp4", ".webm", ".mp3", ".woff", ".woff2", ".ttf", ".pdf", ".txt", ".xml"}
SKIP_FILES = {"package.json", "package-lock.json", "jest.config.js", "tsconfig.json", "vercel.json"}
SECRET = re.compile(r"(sk_live_[0-9A-Za-z]{10,}|sk_test_[0-9A-Za-z]{10,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|"
                    r"AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_\-]{35}|xox[baprs]-[0-9A-Za-z\-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)")
PERSONAL = re.compile(r"samperfox|082\s?601\s?3980|0826013980", re.I)


def blob_sha(data):
    return hashlib.sha1(b"blob %d\0" % len(data) + data).hexdigest()


def wanted(rel):
    parts = rel.split(os.sep)
    if any(p in SKIP_DIRS or p.startswith(".") for p in parts):
        return False
    name = parts[-1]
    return name not in SKIP_FILES and os.path.splitext(name)[1].lower() in KEEP_EXT


files = []
for dp, dns, fns in os.walk(SRC):
    dns[:] = [d for d in dns if d not in SKIP_DIRS and not d.startswith(".")]
    for fn in fns:
        rel = os.path.relpath(os.path.join(dp, fn), SRC)
        if wanted(rel):
            files.append(rel)
present = set(f.replace(os.sep, "/") for f in files)
top = {f.split("/")[0] for f in present}

# 1. brand marks: pinned SHAs only
manifest = json.load(open(os.path.join(BANIMAL, "docs/brand/canonical-brand-manifest.json")))
pins = {}
for group in ("canonicalBanimalLogo", "canonicalConnectorIcon"):
    for v in manifest.get(group, {}).values():
        pins[os.path.basename(v["path"])] = v["gitBlobSha"]
for name in os.listdir(os.path.join(BANIMAL, "docs/brand/assets")):
    pins.setdefault(name, blob_sha(open(os.path.join(BANIMAL, "docs/brand/assets", name), "rb").read()))
problems = []
for rel in files:
    base = os.path.basename(rel)
    if base in pins and ("brand" in rel.split(os.sep) or "assets" in rel.split(os.sep)):
        got = blob_sha(open(os.path.join(SRC, rel), "rb").read())
        if got != pins[base]:
            problems.append(f"brand mark differs from the pinned original: {rel}")

# 2. secrets and personal details
for rel in files:
    if os.path.splitext(rel)[1].lower() in {".html", ".htm", ".js", ".css", ".json", ".txt", ".xml", ".svg"}:
        text = open(os.path.join(SRC, rel), encoding="utf-8", errors="replace").read()
        if SECRET.search(text):
            problems.append(f"secret-shaped value in {rel}")
        if PERSONAL.search(text):
            problems.append(f"personal contact detail in {rel}")
if problems:
    print("REFUSED:\n  " + "\n  ".join(problems))
    sys.exit(1)

# 3. copy, rewriting site-root links to relative ones
ATTR = re.compile(r'''((?:src|href|action|poster|data-src)\s*=\s*)(["'])/(?!/)([^"'\s>]*)\2''', re.I)
CSSURL = re.compile(r'''(url\(\s*)(["']?)/(?!/)([^"')\s]+)\2(\s*\))''', re.I)
JSSTR = re.compile(r'''(['"])/((?:[A-Za-z0-9_\-]+/)*[A-Za-z0-9_\-.]+\.(?:html|htm|json|js|css|png|jpe?g|svg|webp|gif|mp4|pdf))\1''')


def rel_to(page_rel, target):
    path = re.split(r"[?#]", target, 1)
    tail = target[len(path[0]):]
    p = path[0] or "index.html"
    if p.endswith("/"):
        p += "index.html"
    r = os.path.relpath(p, os.path.dirname(page_rel) or ".").replace(os.sep, "/")
    return r + tail


if os.path.isdir(OUT):
    shutil.rmtree(OUT)
rewrites = 0
for rel in files:
    src, dst = os.path.join(SRC, rel), os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    ext = os.path.splitext(rel)[1].lower()
    if ext in {".html", ".htm", ".css"}:
        text = open(src, encoding="utf-8", errors="surrogateescape").read()
        page = rel.replace(os.sep, "/")

        def attr(m):
            global rewrites
            rewrites += 1
            return m.group(1) + m.group(2) + rel_to(page, m.group(3)) + m.group(2)

        def css(m):
            global rewrites
            rewrites += 1
            return m.group(1) + m.group(2) + rel_to(page, m.group(3)) + m.group(2) + m.group(4)

        def js(m):  # quoted paths into the app (loadTerminal('/sectors/...'), etc.); missing pages then hit the app's nearest-page fallback
            global rewrites
            if m.group(2).split("/")[0] not in top:  # only paths into the app's own folders
                return m.group(0)
            rewrites += 1
            return m.group(1) + rel_to(page, m.group(2)) + m.group(1)

        text = ATTR.sub(attr, text)
        text = CSSURL.sub(css, text)
        if ext != ".css":
            text = JSSTR.sub(js, text)
        open(dst, "w", encoding="utf-8", errors="surrogateescape").write(text)
    else:
        shutil.copy2(src, dst)

head = os.popen(f"git -C '{SRC}' rev-parse --short HEAD 2>/dev/null").read().strip()
branch = os.popen(f"git -C '{SRC}' rev-parse --abbrev-ref HEAD 2>/dev/null").read().strip()
json.dump({"source": "heyns1000/fruitful", "branch": branch, "commit": head, "files": len(files), "linksRewritten": rewrites},
          open(os.path.join(OUT, "bundle.json"), "w"), indent=1)
size = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(OUT) for f in fs)
print(f"app/: {len(files)} files, {size / 1e6:.1f} MB, {rewrites} links made relative, from {branch}@{head}")
