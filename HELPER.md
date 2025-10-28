# 🚀 EvalLab — Local Setup Helper

This guide will help you run EvalLab on your local machine in under 5 minutes.

---

## 📦 Prerequisites

You need **one** of the following to serve static files:

- **Python 3** (recommended, usually pre-installed on macOS/Linux)
- **Node.js** with `npx` or `http-server`
- **Go** (if you prefer a Go-based server)
- Any other static file server

---

## ⚡ Quick Start

### Option 1: Python 3 (Recommended)

```bash
# Navigate to the project directory
cd /Users/praveenghuge/go/src/github.com/cloudwizio/agentic/eval_ui

# Start Python's built-in HTTP server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

**Why Python?** It's pre-installed on most systems and requires zero configuration.

---

### Option 2: Node.js (http-server)

```bash
# Install http-server globally (one-time)
npm install -g http-server

# Navigate to project directory
cd /Users/praveenghuge/go/src/github.com/cloudwizio/agentic/eval_ui

# Start server with CORS enabled
http-server -p 8000 --cors

# Open in browser
open http://localhost:8000
```

---

### Option 3: Node.js (npx - no install needed)

```bash
# Navigate to project directory
cd /Users/praveenghuge/go/src/github.com/cloudwizio/agentic/eval_ui

# Use npx to run serve temporarily
npx serve -l 8000

# Open in browser
open http://localhost:8000
```

---

### Option 4: Go (if you're already in Go land)

Create a simple server:

```bash
# Create server.go in eval_ui directory
cat > server.go << 'EOF'
package main

import (
    "fmt"
    "net/http"
)

func main() {
    fs := http.FileServer(http.Dir("."))
    http.Handle("/", fs)
    
    fmt.Println("EvalLab running at http://localhost:8000")
    http.ListenAndServe(":8000, nil)
}
EOF

# Run the server
go run server.go

# Open in browser
open http://localhost:8000
```

---

### Option 5: VS Code Live Server Extension

1. Install **Live Server** extension in VS Code
2. Open `eval_ui` folder in VS Code
3. Right-click on `index.html`
4. Select **"Open with Live Server"**
5. Browser opens automatically at `http://127.0.0.1:5500`

---

## 🔍 Verify Installation

After starting the server, you should see:

✅ **Top navbar** with "EvalLab" logo and user menu  
✅ **Left sidebar** with Projects, Datasets, Evaluations, Models, Settings  
✅ **Three-column layout** with evaluation list, result viewer, and filters  
✅ **Mock data loaded** — 3 evaluations visible in the list  

---

## 🧪 Test the Application

### 1. Select an Evaluation
- Click on "Baseline GPT-4 Test" in the evaluation list
- You should see the output, test results, logs, and LLM judge scores

### 2. Run a Simulation
- Edit the prompt or user input in the "Prompt Editor" card
- Click **"Run Evaluation"** button
- Wait 2 seconds (simulated API call)
- View the mock response in the **Output** tab

### 3. Apply Filters
- Use the filter dropdowns in the right panel
- Filter by Project, Status, or Model
- Click **"Clear Filters"** to reset

### 4. Test Keyboard Shortcuts
- **Ctrl/Cmd + R**: Run evaluation
- **Ctrl/Cmd + F**: Focus on project filter
- **Ctrl/Cmd + B**: Toggle sidebar collapse/expand
- **Escape**: Close mobile sidebar (on mobile devices)

---

## 🐛 Troubleshooting

### Issue: Page loads but no data appears

**Cause:** `mock-data.json` not found or failed to load

**Solution:**
```bash
# Verify all files exist
ls -la eval_ui/
# You should see: index.html, styles.css, app.js, mock-data.json

# Check browser console (F12) for errors
# Look for: "Failed to load mock data"
```

---

### Issue: Styles look broken (no colors/spacing)

**Cause:** Bootstrap CSS not loading from CDN

**Solution:**
1. Check your internet connection
2. Or download Bootstrap locally:

```bash
cd eval_ui
mkdir -p assets/css

# Download Bootstrap
curl -o assets/css/bootstrap.min.css \
  https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css

# Update index.html to use local file
# Change: <link href="https://cdn.jsdelivr.net..." />
# To:     <link href="assets/css/bootstrap.min.css" />
```

---

### Issue: JavaScript errors in console

**Cause:** Browser doesn't support ES6 modules or fetch API

**Solution:**
- Use a modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Update your browser to the latest version

---

### Issue: CORS errors when loading JSON

**Cause:** Browser security prevents loading local files

**Solution:**
- **Don't** open `index.html` directly (file:///)
- **Always** use a web server (Python, Node, etc.)
- If using Python, make sure you're running from the correct directory

---

### Issue: Port 8000 already in use

**Solution:**
```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process (replace PID)
kill -9 <PID>

# Or use a different port
python3 -m http.server 3000
```

---

## 📂 File Structure Checklist

Ensure you have all required files:

```
eval_ui/
├── index.html          ✅ Main dashboard page
├── styles.css          ✅ Custom styles
├── app.js              ✅ Application logic
├── mock-data.json      ✅ Sample data
├── README.md           ✅ Project documentation
└── HELPER.md           ✅ This file (setup guide)
```

Verify with:
```bash
cd /Users/praveenghuge/go/src/github.com/cloudwizio/agentic/eval_ui
ls -1
```

---

## 🔗 API Integration (Next Steps)

When you're ready to connect to a real backend:

### 1. Update API endpoints in `app.js`

Find the `API` object and uncomment the `// TODO:` lines:

```javascript
// filepath: app.js (lines ~50-150)

async getProjects() {
    // Remove this line:
    // const data = await this.loadMockData();
    
    // Uncomment this line:
    return fetch('/api/projects').then(res => res.json());
}
```

### 2. Configure API base URL

Add at the top of `app.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000'; // Your backend URL

const API = {
    async getProjects() {
        return fetch(`${API_BASE_URL}/api/projects`)
            .then(res => res.json());
    },
    // ...rest of methods
};
```

### 3. Handle authentication (if needed)

```javascript
const API = {
    headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
        'Content-Type': 'application/json'
    },
    
    async getProjects() {
        return fetch(`${API_BASE_URL}/api/projects`, {
            headers: this.headers
        }).then(res => res.json());
    }
};
```

### 4. Test with your backend

```bash
# Start your backend server
cd ../backend
go run main.go  # or npm start, etc.

# In another terminal, start the frontend
cd ../eval_ui
python3 -m http.server 8000

# Open browser and check Network tab (F12)
# Verify API calls are being made correctly
```

---

## 🎨 Customization

### Change Primary Color

Edit `styles.css`:

```css
/* filepath: styles.css (line ~1) */
:root {
    --primary-indigo: #6366f1;  /* Change this hex value */
    /* ...existing code... */
}
```

### Add Your Logo

Replace the robot icon in `index.html`:

```html
<!-- filepath: index.html (line ~20) -->
<a class="navbar-brand d-flex align-items-center" href="#">
    <img src="assets/logo.png" alt="EvalLab" height="32" class="me-2">
    <span class="fw-bold">Mavvrik EvalLab</span>
</a>
```

### Toggle Sidebar Behavior

The sidebar can be collapsed to save screen space:

1. **Desktop**: Click the sidebar toggle button in the top toolbar
2. **Keyboard**: Press **Ctrl/Cmd + B**
3. **Persistent**: Your preference is saved in browser localStorage

**Collapsed Mode Features:**
- Icons-only navigation
- Hover to see tooltips
- More space for main content
- Auto-restores on page reload

**Mobile Behavior:**
- Sidebar slides in from left
- Tap hamburger menu (☰) to open
- Tap outside or press Escape to close
- Auto-closes after navigation

---

## 💡 Pro Tips

1. **Use Chrome DevTools** for debugging (F12)
2. **Disable browser cache** during development (F12 → Network → Disable cache)
3. **Use incognito mode** to test fresh sessions
4. **Bookmark** `http://localhost:8000` for quick access
5. **Keep browser console open** to catch errors early
6. **Collapse sidebar** (Ctrl+B) for more screen space when working with large outputs
7. **Mobile testing**: Use Chrome DevTools device emulation (Ctrl+Shift+M)

---

**Happy Evaluating! 🎉**

If you encounter issues not covered here, check the browser console (F12) and look for specific error messages.
