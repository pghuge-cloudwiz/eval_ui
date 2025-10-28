# 📊 Dataset Management

Import, manage, and version control your evaluation datasets from multiple sources.

---

## 📋 Overview

The **Datasets** section allows you to:

- ✅ Import datasets from local files (CSV, JSON, JSONL)
- ✅ Import from GitHub repositories
- ✅ Import from URLs
- ✅ Version control your datasets
- ✅ Preview and validate data before importing
- ✅ Export datasets in multiple formats

---

## 🎯 Supported Import Methods

### 1. File Upload
Upload datasets from your local machine:
- **CSV**: Comma-separated values
- **JSON**: JavaScript Object Notation
- **JSONL**: JSON Lines (one JSON object per line)
- **TSV**: Tab-separated values
- **Excel**: .xlsx, .xls files

### 2. GitHub Repository
Import directly from GitHub:
- Public repositories
- Private repositories (with access token)
- Specific branches or tags
- Subdirectories within repos

### 3. URL Import
Fetch datasets from web URLs:
- Direct file URLs
- API endpoints returning JSON
- Cloud storage (S3, GCS with public access)

---

## 🚀 How to Import

### Method 1: File Upload

1. Click **"Import Dataset"** button
2. Select **"Upload File"** tab
3. Drag & drop or browse to select file
4. Preview data and configure options:
   - **Name**: Dataset identifier
   - **Description**: What this dataset contains
   - **Delimiter**: For CSV files (comma, tab, semicolon)
   - **Has Headers**: First row contains column names
5. Click **"Import"**

**Example CSV Structure:**
```csv
input,expected_output,category
"How do I reset password?","Go to settings and click reset","auth"
"What's your refund policy?","30-day money back guarantee","billing"
```

**Example JSON Structure:**
```json
[
  {
    "input": "How do I reset password?",
    "expected_output": "Go to settings and click reset",
    "category": "auth"
  },
  {
    "input": "What's your refund policy?",
    "expected_output": "30-day money back guarantee",
    "category": "billing"
  }
]
```

**Example JSONL Structure:**
```jsonl
{"input": "How do I reset password?", "expected_output": "Go to settings and click reset", "category": "auth"}
{"input": "What's your refund policy?", "expected_output": "30-day money back guarantee", "category": "billing"}
```

---

### Method 2: GitHub Import

1. Click **"Import Dataset"** button
2. Select **"GitHub"** tab
3. Enter repository details:
   - **Repository URL**: `https://github.com/user/repo`
   - **Branch/Tag**: `main` (default) or specific branch
   - **File Path**: `data/evaluations.json`
   - **Access Token**: (optional, for private repos)
4. Click **"Preview"** to validate
5. Click **"Import"**

**Example GitHub URLs:**
```
# Public repo
https://github.com/openai/evals/blob/main/evals/registry/data/test.jsonl

# Private repo (requires token)
https://github.com/myorg/private-evals/blob/main/datasets/customer-support.json

# Subdirectory
https://github.com/myorg/datasets/blob/main/v2/evaluations/qa-dataset.csv
```

**Required File Structure in Repo:**
```
repo/
├── data/
│   ├── train.json
│   ├── test.json
│   └── validation.json
├── README.md
└── .gitignore
```

---

### Method 3: URL Import

1. Click **"Import Dataset"** button
2. Select **"URL"** tab
3. Enter dataset URL:
   ```
   https://example.com/datasets/eval-data.json
   https://storage.googleapis.com/bucket/dataset.csv
   https://api.example.com/v1/datasets/123
   ```
4. Configure options:
   - **Authentication**: Bearer token, API key (if needed)
   - **Format**: Auto-detect or specify
5. Click **"Import"**

---

## 📝 Dataset Schema

### Required Fields
- `input` (string): The input prompt or question
- `expected_output` (string, optional): Expected LLM response

### Optional Metadata Fields
- `category` (string): Classification tag
- `difficulty` (string): easy, medium, hard
- `tags` (array): Custom tags for filtering
- `metadata` (object): Additional context

### Example Complete Schema
```json
{
  "input": "Explain quantum computing",
  "expected_output": "Quantum computing uses qubits...",
  "category": "technical",
  "difficulty": "hard",
  "tags": ["physics", "computing", "advanced"],
  "metadata": {
    "source": "Wikipedia",
    "last_updated": "2024-01-15",
    "author": "domain-expert"
  }
}
```

---

## 🔧 API Integration

### Upload File Endpoint

```http
POST /api/datasets/upload
Content-Type: multipart/form-data

{
  "file": <binary>,
  "name": "Customer Support Q&A",
  "description": "100 customer queries",
  "format": "csv"
}
```

**Response:**
```json
{
  "dataset_id": "ds-001",
  "name": "Customer Support Q&A",
  "rows": 100,
  "columns": ["input", "expected_output", "category"],
  "status": "imported",
  "created_at": "2024-02-12T10:00:00Z"
}
```

---

### GitHub Import Endpoint

```http
POST /api/datasets/import/github
Content-Type: application/json

{
  "repo_url": "https://github.com/user/repo",
  "branch": "main",
  "file_path": "data/evals.json",
  "access_token": "ghp_xxx..." (optional)
}
```

**Response:**
```json
{
  "dataset_id": "ds-002",
  "name": "GitHub Evals Dataset",
  "source": "github",
  "commit_sha": "abc123...",
  "rows": 250,
  "status": "imported"
}
```

---

### URL Import Endpoint

```http
POST /api/datasets/import/url
Content-Type: application/json

{
  "url": "https://example.com/data.json",
  "headers": {
    "Authorization": "Bearer token..." (optional)
  }
}
```

---

## 💡 Best Practices

### 1. Data Quality
- ✅ Remove duplicates before importing
- ✅ Validate JSON syntax
- ✅ Use consistent field names
- ✅ Include expected outputs for automated testing

### 2. Version Control
- ✅ Use GitHub integration for version history
- ✅ Tag releases (v1.0, v2.0)
- ✅ Document dataset changes in commit messages

### 3. Security
- ✅ Never commit API keys to GitHub
- ✅ Use environment variables for tokens
- ✅ Restrict access to sensitive datasets

### 4. Organization
- ✅ Use descriptive dataset names
- ✅ Add detailed descriptions
- ✅ Tag datasets by use case
- ✅ Archive old/unused datasets

---

## 📊 Dataset Preview

After importing, you'll see:

| Field | Sample Value | Type | Actions |
|-------|--------------|------|---------|
| input | "How do I reset..." | string | Edit, Delete |
| expected_output | "Go to settings..." | string | Edit, Delete |
| category | "auth" | string | Edit, Delete |

**Statistics:**
- Total Rows: 100
- Columns: 3
- Missing Values: 2
- Last Updated: 2024-02-12

---

## 🔍 Validation Rules

### Automatic Validation
- ✅ Check for required fields (`input`)
- ✅ Detect encoding issues (UTF-8 required)
- ✅ Validate JSON structure
- ✅ Check for empty rows
- ✅ Detect duplicate entries

### Manual Review
- Review first 10 rows
- Check data types
- Verify expected outputs
- Validate categories/tags

---

## 📦 Export Options

### Export Formats
- **CSV**: For spreadsheet tools
- **JSON**: For APIs and scripts
- **JSONL**: For streaming/large datasets
- **Excel**: For non-technical users

### Export Settings
```javascript
{
  "format": "json",
  "include_metadata": true,
  "filter": {
    "category": "auth",
    "difficulty": ["medium", "hard"]
  },
  "limit": 100
}
```

---

## 🛠️ GitHub Integration Setup

### 1. Generate GitHub Personal Access Token

1. Go to GitHub → Settings → Developer Settings
2. Click **"Personal Access Tokens"** → **"Tokens (classic)"**
3. Click **"Generate new token"**
4. Select scopes:
   - `repo` (for private repos)
   - `public_repo` (for public repos only)
5. Copy token: `ghp_xxxxxxxxxxxx`

### 2. Add Token to EvalLab

```javascript
// In app settings or environment variables
const GITHUB_TOKEN = 'ghp_xxxxxxxxxxxx';

// Use in API calls
fetch('/api/datasets/import/github', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    repo_url: 'https://github.com/user/repo',
    file_path: 'data/evals.json'
  })
});
```

### 3. Set Up GitHub Webhook (Optional)

Auto-sync datasets when GitHub repo updates:

```yaml
# .github/workflows/sync-evals.yml
name: Sync Datasets to EvalLab

on:
  push:
    paths:
      - 'data/**'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger EvalLab Import
        run: |
          curl -X POST https://evallab.example.com/api/datasets/import/github \
            -H "Authorization: Bearer ${{ secrets.EVALLAB_TOKEN }}" \
            -d '{"repo_url": "${{ github.repository }}", "branch": "${{ github.ref }}"}'
```

---

## 🚨 Troubleshooting

### Issue: "Invalid file format"
- **Cause**: File encoding or structure issue
- **Solution**: 
  - Ensure UTF-8 encoding
  - Validate JSON syntax with jsonlint.com
  - Check CSV delimiters

### Issue: "GitHub import failed"
- **Cause**: Invalid token or private repo access
- **Solution**:
  - Regenerate GitHub token with correct scopes
  - Verify repo URL is correct
  - Check file path exists in repository

### Issue: "Dataset too large"
- **Cause**: File exceeds size limit
- **Solution**:
  - Split dataset into smaller files
  - Use JSONL format for streaming
  - Contact admin to increase limits

---

## 📚 Related Documentation

- [HELPER.md](HELPER.md) — Local setup guide
- [COMPARISON.md](COMPARISON.md) — Model comparison
- [README.md](README.md) — Project overview

---

**Happy Dataset Managing! 📊**

Import from anywhere, evaluate everywhere.
