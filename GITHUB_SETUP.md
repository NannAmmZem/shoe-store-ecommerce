# 🚀 GitHub Setup Guide

## How to Upload Your Shoe Store Project to GitHub

Follow these steps to create a GitHub repository and upload your complete project.

---

## Prerequisites

1. **Git installed** on your computer
   - Check: `git --version`
   - If not installed, download from: https://git-scm.com/download/win

2. **GitHub account**
   - Create free account at: https://github.com/signup
   - Verify your email address

---

## Step 1: Initialize Git Repository

Open PowerShell in your project folder and run:

```powershell
cd "C:\Users\Nann\Documents\Shoes Store"

# Initialize git repository
git init

# Check status
git status
```

---

## Step 2: Configure Git (First Time Only)

Set your name and email (use your GitHub email):

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 3: Add Files to Git

```powershell
# Add all files
git add .

# Check what will be committed
git status

# Create first commit
git commit -m "Initial commit: Complete shoe store e-commerce project"
```

---

## Step 4: Create GitHub Repository

### Option A: Using GitHub Website (Easier)

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name:** `shoe-store-ecommerce` (or your preferred name)
   - **Description:** `Full-stack shoe e-commerce website built with Next.js 14, PostgreSQL, and Docker`
   - **Visibility:** Choose Public or Private
   - ⚠️ **DO NOT** check "Add README" or any other files
3. Click **Create repository**

### Option B: Using GitHub CLI (Advanced)

```powershell
# Install GitHub CLI first: winget install GitHub.cli
gh auth login
gh repo create shoe-store-ecommerce --public --source=. --remote=origin
```

---

## Step 5: Connect to GitHub and Push

After creating the repository on GitHub, you'll see instructions. Run these commands:

```powershell
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/shoe-store-ecommerce.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example:**
```powershell
git remote add origin https://github.com/johndoe/shoe-store-ecommerce.git
git branch -M main
git push -u origin main
```

When prompted, enter your GitHub credentials or use a Personal Access Token.

---

## Step 6: Verify Upload

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/shoe-store-ecommerce`
2. You should see all your files uploaded
3. The README.md should display on the main page

---

## 🔑 GitHub Personal Access Token (If Password Doesn't Work)

GitHub no longer accepts passwords for git operations. You need a Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Give it a name: "Shoe Store Project"
4. Select scopes: Check **repo** (full control of private repositories)
5. Click **Generate token**
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing to GitHub

---

## 📁 What Gets Uploaded (and What Doesn't)

### ✅ Uploaded to GitHub:
- All source code (app/, components/, lib/)
- Configuration files (package.json, tsconfig.json, etc.)
- Documentation (README.md, SETUP_GUIDE.md, etc.)
- Database initialization scripts (init-db/)
- Docker configuration (docker-compose.yml)

### ❌ NOT Uploaded (via .gitignore):
- node_modules/ (too large, can be reinstalled)
- .next/ (build files, regenerated)
- .env.local (contains secrets)
- Docker volumes data
- Test files (test-*.js)

---

## 🎨 Making Your Repository Look Professional

### Add a Nice README Badge

Add this to the top of your README.md:

```markdown
# 👟 Shoe Store E-Commerce

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=for-the-badge&logo=docker)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

> Full-stack e-commerce platform for selling shoes, built for university project
```

### Add Topics/Tags

On your GitHub repository page:
1. Click **⚙️ Settings**
2. Under "Topics", add:
   - `nextjs`
   - `ecommerce`
   - `postgresql`
   - `docker`
   - `typescript`
   - `tailwindcss`

---

## 🔄 Future Updates (After Initial Upload)

When you make changes to your project:

```powershell
# Check what changed
git status

# Add changed files
git add .

# Commit changes
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

---

## 📸 Add Screenshots to GitHub

1. Take screenshots of your application
2. Create a folder: `screenshots/` in your project
3. Save images: `homepage.png`, `products.png`, `admin.png`, etc.
4. Update README.md to include them:

```markdown
## Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### Products Page
![Products](screenshots/products.png)

### Admin Dashboard
![Admin](screenshots/admin.png)
```

5. Commit and push:
```powershell
git add screenshots/
git add README.md
git commit -m "Add screenshots"
git push
```

---

## 🚨 Important: Protect Your Secrets

⚠️ **Never commit these files:**
- `.env.local` (contains database passwords)
- `.env` (if it has real production secrets)
- Any files with API keys or passwords

These are already in `.gitignore`, but double-check!

---

## 🎓 For University Submission

Your repository will include:

✅ Complete source code
✅ Documentation (README, SETUP_GUIDE, BUSINESS_PLAN)
✅ Database schema and design
✅ Docker configuration for easy setup
✅ Installation instructions
✅ Test scripts
✅ Professional README with project description

Professors can:
- Clone your repository
- Run `docker compose up -d`
- Run `npm install`
- Run `node fix-passwords.js`
- Run `npm run dev`
- See your working application!

---

## 📋 Quick Command Summary

```powershell
# First time setup
cd "C:\Users\Nann\Documents\Shoes Store"
git init
git add .
git commit -m "Initial commit: Complete shoe store project"
git remote add origin https://github.com/YOUR_USERNAME/shoe-store-ecommerce.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Your commit message"
git push
```

---

## 🆘 Troubleshooting

### "Permission denied" Error
- Use a Personal Access Token instead of password
- Follow the steps in "GitHub Personal Access Token" section above

### "Remote already exists" Error
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/shoe-store-ecommerce.git
```

### Want to Start Over?
```powershell
# Remove git repository
rm -r -Force .git

# Start fresh
git init
git add .
git commit -m "Initial commit"
```

### Files Not Uploading?
Check if they're in .gitignore:
```powershell
git check-ignore -v filename.txt
```

---

## ✅ Verification Checklist

After uploading, verify on GitHub:

- [ ] All source files are visible
- [ ] README.md displays correctly
- [ ] Documentation files are present
- [ ] docker-compose.yml is there
- [ ] package.json shows dependencies
- [ ] .env.local is NOT visible (good!)
- [ ] node_modules/ is NOT visible (good!)

---

## 🌟 Optional: Add GitHub Actions (CI/CD)

Create `.github/workflows/test.yml` for automatic testing:

```yaml
name: Test Application

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
```

---

## 🎉 You're Done!

Your shoe store project is now on GitHub! 

**Share your repository:**
- Repository URL: `https://github.com/YOUR_USERNAME/shoe-store-ecommerce`
- Add this link to your university report
- Share with professors or teammates

**Good luck with your project presentation! 🎓👟✨**
