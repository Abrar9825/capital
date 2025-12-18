# GitHub PDF Storage Setup Guide

## ✅ Changes Done:
1. ❌ Removed Cloudinary
2. ✅ Added GitHub Integration with @octokit/rest
3. ✅ Fixed duplicate PDF pages
4. ✅ PDFs will now store in GitHub repo with public URL

---

## 🚀 Setup Steps:

### Step 1: Create GitHub Repository for Bills
```bash
1. Go to: https://github.com/new
2. Repository name: bills-storage (ya koi bhi naam)
3. Public ya Private (dono chalega)
4. Create repository
```

### Step 2: Generate GitHub Personal Access Token
```bash
1. Go to: https://github.com/settings/tokens
2. Click: "Generate new token" → "Generate new token (classic)"
3. Note/Description: "Capital Billing System"
4. Expiration: No expiration (ya apni marzi)
5. Select scopes:
   ✅ repo (full control)
6. Generate token
7. COPY TOKEN (bas ek baar dikhega!)
```

### Step 3: Create `bills` Folder in GitHub Repo
```bash
1. Open your repo: https://github.com/your-username/bills-storage
2. Click: "Add file" → "Create new file"
3. Type: bills/.gitkeep
4. Commit
```

### Step 4: Update .env File
```env
# Copy .env.example to .env
MONGODB_URI=mongodb://localhost:27017/capitalBilling
PORT=5000
API_URL=http://localhost:5000

# Add your GitHub details:
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=your-github-username
GITHUB_REPO=bills-storage
```

### Example:
```env
GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz
GITHUB_OWNER=johndoe
GITHUB_REPO=bills-storage
```

---

## 🎯 How It Works:

1. **Bill Generate** → PDF banegi
2. **GitHub Upload** → `bills/bill_123456.pdf` ke naam se upload
3. **Public URL** → `https://raw.githubusercontent.com/username/repo/main/bills/bill_123456.pdf`
4. **WhatsApp Share** → URL directly share ho jayega

---

## 📝 Test Karo:
```bash
npm start
# Bill generate karo
# "Share" button click karo
# GitHub me check karo: bills folder me PDF honi chahiye
```

---

## ⚡ Benefits:
- ✅ Free unlimited storage (GitHub LFS nahi chahiye for PDFs)
- ✅ Public URL - koi bhi access kar sakta
- ✅ Permanent - kabhi delete nahi hogi
- ✅ Version control built-in
- ✅ No duplicate pages
