# Publish True Housing on GitHub — Windows + VS Code

**First confirm the tested ZIP files have replaced your old local app files and that `property-search-app-backup` still exists. Do not publish real customer information.**

## 1. Verify the project on Windows

Open VS Code with:

`C:\Users\Chaitanya Sharma\code\property-search-app`

Ensure `index.html`, `style.css`, `script.js`, `logic.js`, `assets/`, `tests/`, `README.md`, `INTERVIEW_GUIDE.md`, `TEST_REPORT.md`, `.gitignore`, and `screenshots/` are present. Open `index.html`, test your features and storage on refresh, then inspect DevTools Console.

If Node.js is installed, run in the VS Code PowerShell terminal:

```powershell
node --test tests/logic.test.js
```

Expected: 20 tests passed. You do **not** need Node.js to view the app, only to run the automated tests.

## 2. Create your GitHub repository

Sign in to `github.com/chaitanya0001-1` and create a **public**, **empty** repository named `property-search-app`. Do **not** generate another README, license, or .gitignore on GitHub, because your folder already contains files.

## 3. Inspect local Git status *before* changing anything

In the VS Code terminal:

```powershell
cd "C:\Users\Chaitanya Sharma\code\property-search-app"
git status
git remote -v
```

- If `git status` says **not a git repository**, run `git init`, then `git branch -M main`.
- If it already is a Git repository, do not reinitialize it; review existing changes and branches.
- If an `origin` remote already exists, inspect it carefully and do not add another. If it points to a different important repository, stop and resolve that before publishing.

## 4. Commit and push

Once inside the correct folder and after confirming no sensitive files will be committed:

```powershell
git add .
git status
git commit -m "Build True Housing property search portfolio demo"
```

If no `origin` exists, connect to your new repo:

```powershell
git remote add origin https://github.com/chaitanya0001-1/property-search-app.git
```

Push the branch:

```powershell
git push -u origin main
```

If your existing repository uses a branch other than `main`, check before changing it. If GitHub rejects the push, do not force-push; inspect the error.

## 5. Confirm GitHub content

Open `https://github.com/chaitanya0001-1/property-search-app` in a logged-out/incognito browser and ensure the README, source files, screenshots, tests, and `TEST_REPORT.md` are publicly readable. Consider pinning this repository to your GitHub profile after verifying the result.

## 6. What you can say in a resume

Use the project as a **vanilla JavaScript client-side portfolio application**. State the functionality and test count accurately, describe your personal role truthfully, and never claim a backend, Java, database, AWS deployment, authentication, or live True Housing data in this version.
