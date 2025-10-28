# 🧠 EvalLab — LLM Evaluation Dashboard (Bootstrap 5)

EvalLab is a responsive **Bootstrap-based web UI** for evaluating Large Language Model (LLM) outputs.  
It provides a clean interface to manage projects, run evaluations, view results, and inspect LLM-as-judge scores.

---

## 📋 Overview

**Goal:**  
Provide an intuitive and extensible frontend to visualize LLM evaluation results — including **execution tests**, **static analysis**, and **LLM-as-judge** feedback.

**Stack:**  
- **HTML5 / CSS3 / JavaScript (ES6)**  
- **Bootstrap 5** for layout and components  
- **Bootstrap Icons** for icons  
- **Mock JSON data** (replaceable with real APIs)  

> 🧩 The app can later be integrated with LangSmith, OpenAI Evals, or custom REST APIs.

---

## 🧭 Project Structure

eval-lab/
├── index.html # Main dashboard page
├── styles.css # Custom styles overriding Bootstrap
├── app.js # Core JS logic: state mgmt, events, mock data loading
├── mock-data.json # Sample project/evaluation data
├── assets/
│ ├── logo.svg
│ └── icons/
│ └── *.svg
├── README.md # You're here
└── /docs/
└── ui-spec.md # Detailed UI & component spec (optional)

---

## 🎨 Adding Your Logo

1. **Download the CloudWiz logo** or use your company logo
2. **Save it as `logo.png`** in the `eval_ui/` directory
3. **Recommended size**: 200x200px or similar square format
4. The logo will automatically appear in the navbar with proper styling

**Alternative**: If you prefer the robot icon, remove the `<img>` tag in `index.html` line 24 and uncomment the icon.

---

## 🚀 Quick Start

```bash
# Navigate to project directory
cd /Users/praveenghuge/go/src/github.com/cloudwizio/agentic/eval_ui

# Start a local server (Python)
python3 -m http.server 8000

# Open browser
open http://localhost:8000
```

For detailed setup instructions, see **[HELPER.md](HELPER.md)**.

---

## ✨ Features

- ✅ **Responsive Dashboard** — Works on desktop, tablet, and mobile
- ✅ **Collapsible Sidebar** — Save screen space (Ctrl+B)
- ✅ **Three-Column Layout** — Evaluation list, results viewer, metadata
- ✅ **Mock Data Integration** — Test without backend
- ✅ **Tabbed Results** — Output, Tests, Logs, LLM Judge scores
- ✅ **Keyboard Shortcuts** — Power user friendly
- ✅ **Accessibility** — ARIA labels, keyboard navigation

---

## 🔌 API Integration

The app is designed to work with REST APIs. See `app.js` for integration points:

### Expected Endpoints

```
GET  /api/projects              → List all projects
GET  /api/evaluations           → List evaluations (with filters)
POST /api/evaluations/:id/run   → Run evaluation
GET  /api/evaluations/:id/results → Test results
GET  /api/evaluations/:id/logs    → Execution logs
GET  /api/evaluations/:id/judge   → LLM judge scores
GET  /api/models                → Available models
```

### Swap Mock Data for Real APIs

In `app.js`, replace the mock implementation:

```javascript
// Before (mock)
async getProjects() {
    const data = await this.loadMockData();
    return data ? data.projects : [];
}

// After (real API)
async getProjects() {
    return fetch('/api/projects').then(res => res.json());
}
```

---

## 📚 Documentation

- **[HELPER.md](HELPER.md)** — Local setup and troubleshooting
- **[mock-data.json](mock-data.json)** — Sample data structure
- **Bootstrap 5 Docs** — https://getbootstrap.com/docs/5.3/

---

## 🛠️ Customization

### Change Colors

Edit `styles.css`:

```css
:root {
    --primary-indigo: #6366f1;  /* Your brand color */
    --secondary-slate: #64748b;
}
```

### Add New Sidebar Items

Edit `index.html` in the sidebar section:

```html
<li class="nav-item">
    <a class="nav-link" href="#" data-section="analytics">
        <i class="bi bi-graph-up me-2"></i>
        <span class="nav-text">Analytics</span>
    </a>
</li>
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this in your projects.

---

## 🆘 Support

Having issues? Check:

1. **Browser console (F12)** for error messages
2. **[HELPER.md](HELPER.md)** for common issues
3. **Network tab** to verify API calls

---

**Built with ❤️ for the LLM evaluation community**