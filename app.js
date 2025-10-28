/**
 * EvalLab - Application Logic
 * 
 * Architecture:
 * - State management for current project/evaluation
 * - Mock data loading (replaceable with real API calls)
 * - UI event handlers and rendering
 * - Accessibility features (keyboard navigation, ARIA)
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const AppState = {
    currentProject: null,
    currentEvaluation: null,
    projects: [],
    evaluations: [],
    testResults: {},
    llmJudgeScores: {},
    logs: {},
    models: [],
    filters: {
        project: '',
        status: '',
        model: ''
    }
};

// ============================================================================
// API INTEGRATION POINTS
// ============================================================================

/**
 * API Service - Replace mock implementation with real API calls
 * 
 * Expected API Endpoints:
 * - GET  /api/projects           → List all projects
 * - GET  /api/projects/:id       → Get project details
 * - POST /api/projects           → Create new project
 * 
 * - GET  /api/evaluations        → List evaluations (with filters)
 * - GET  /api/evaluations/:id    → Get evaluation details
 * - POST /api/evaluations        → Create new evaluation
 * - POST /api/evaluations/:id/run → Run evaluation
 * 
 * - GET  /api/evaluations/:id/results → Get test results
 * - GET  /api/evaluations/:id/logs    → Get execution logs
 * - GET  /api/evaluations/:id/judge   → Get LLM judge scores
 * 
 * - GET  /api/models             → List available models
 */

const API = {
    /**
     * Load all application data from mock-data.json
     * TODO: Replace with individual API calls when backend is ready
     */
    async loadMockData() {
        try {
            const response = await fetch('mock-data.json');
            if (!response.ok) throw new Error('Failed to load mock data');
            return await response.json();
        } catch (error) {
            console.error('Error loading mock data:', error);
            return null;
        }
    },

    /**
     * Fetch all projects
     * Integration point: GET /api/projects
     */
    async getProjects() {
        // TODO: return fetch('/api/projects').then(res => res.json());
        const data = await this.loadMockData();
        return data ? data.projects : [];
    },

    /**
     * Fetch all evaluations with optional filters
     * Integration point: GET /api/evaluations?project=X&status=Y&model=Z
     */
    async getEvaluations(filters = {}) {
        // TODO: const params = new URLSearchParams(filters);
        // TODO: return fetch(`/api/evaluations?${params}`).then(res => res.json());
        const data = await this.loadMockData();
        let evaluations = data ? data.evaluations : [];
        
        // Apply client-side filtering for mock data
        if (filters.project) {
            evaluations = evaluations.filter(e => e.project_id === filters.project);
        }
        if (filters.status) {
            evaluations = evaluations.filter(e => e.status === filters.status);
        }
        if (filters.model) {
            evaluations = evaluations.filter(e => e.model === filters.model);
        }
        
        return evaluations;
    },

    /**
     * Run an evaluation
     * Integration point: POST /api/evaluations/:id/run
     */
    async runEvaluation(evalId, prompt, userInput) {
        // TODO: return fetch(`/api/evaluations/${evalId}/run`, {
        // TODO:   method: 'POST',
        // TODO:   headers: { 'Content-Type': 'application/json' },
        // TODO:   body: JSON.stringify({ prompt, user_input: userInput })
        // TODO: }).then(res => res.json());
        
        // Mock: Simulate API call with delay
        showLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        showLoading(false);
        
        // Return mock result
        return {
            id: evalId,
            status: 'passed',
            output: `Mock output for evaluation ${evalId}\n\nPrompt: ${prompt}\nInput: ${userInput}\n\nThis is a simulated response. In production, this would contain the actual LLM output.`,
            duration_ms: 2000
        };
    },

    /**
     * Get test results for an evaluation
     * Integration point: GET /api/evaluations/:id/results
     */
    async getTestResults(evalId) {
        // TODO: return fetch(`/api/evaluations/${evalId}/results`).then(res => res.json());
        const data = await this.loadMockData();
        return data ? data.test_results[evalId] || [] : [];
    },

    /**
     * Get LLM judge scores
     * Integration point: GET /api/evaluations/:id/judge
     */
    async getLLMJudgeScores(evalId) {
        // TODO: return fetch(`/api/evaluations/${evalId}/judge`).then(res => res.json());
        const data = await this.loadMockData();
        return data ? data.llm_judge_scores[evalId] || null : null;
    },

    /**
     * Get execution logs
     * Integration point: GET /api/evaluations/:id/logs
     */
    async getLogs(evalId) {
        // TODO: return fetch(`/api/evaluations/${evalId}/logs`).then(res => res.text());
        const data = await this.loadMockData();
        return data ? data.logs[evalId] || '' : '';
    },

    /**
     * Get available models
     * Integration point: GET /api/models
     */
    async getModels() {
        // TODO: return fetch('/api/models').then(res => res.json());
        const data = await this.loadMockData();
        return data ? data.models : [];
    }
};

// ============================================================================
// UI RENDERING
// ============================================================================

/**
 * Render projects list view
 */
function renderProjectsView() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Projects</h1>
            <button type="button" class="btn btn-sm btn-primary" onclick="showNewProjectModal()">
                <i class="bi bi-plus-lg me-1"></i>New Project
            </button>
        </div>

        <div class="row g-3">
            ${AppState.projects.map(project => `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${escapeHtml(project.name)}</h5>
                            <p class="card-text text-muted">${escapeHtml(project.description || 'No description')}</p>
                            <div class="mb-2">
                                <small class="text-muted">
                                    <i class="bi bi-cpu me-1"></i>${project.model || 'No model set'}
                                </small>
                            </div>
                            <div class="mb-3">
                                <small class="text-muted">
                                    <i class="bi bi-calendar me-1"></i>${formatDate(project.created_at)}
                                </small>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <div class="btn-group w-100" role="group">
                                <button class="btn btn-sm btn-outline-primary" onclick="viewProject('${project.id}')">
                                    <i class="bi bi-eye me-1"></i>View
                                </button>
                                <button class="btn btn-sm btn-outline-secondary" onclick="editProject('${project.id}')">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteProject('${project.id}')">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Render settings view
 */
function renderSettingsView() {
    const mainContent = document.getElementById('mainContent');
    
    // Load saved settings or use defaults
    const settings = {
        budget: localStorage.getItem('evalBudget') || '100.00',
        budgetPeriod: localStorage.getItem('evalBudgetPeriod') || 'monthly',
        defaultModel: localStorage.getItem('defaultModel') || '',
        autoRun: localStorage.getItem('autoRun') === 'true',
        notifications: localStorage.getItem('notifications') === 'true'
    };
    
    mainContent.innerHTML = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Settings</h1>
        </div>

        <div class="row">
            <div class="col-lg-8">
                <!-- Budget Settings -->
                <div class="card mb-3">
                    <div class="card-header">
                        <i class="bi bi-piggy-bank me-2"></i>Budget Management
                    </div>
                    <div class="card-body">
                        <form id="budgetForm">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="budgetAmount" class="form-label">Budget Amount (USD)</label>
                                    <div class="input-group">
                                        <span class="input-group-text">$</span>
                                        <input type="number" class="form-control" id="budgetAmount" 
                                               value="${settings.budget}" step="0.01" min="0" required>
                                    </div>
                                    <small class="text-muted">Maximum spending limit for evaluations</small>
                                </div>
                                <div class="col-md-6">
                                    <label for="budgetPeriod" class="form-label">Budget Period</label>
                                    <select class="form-select" id="budgetPeriod">
                                        <option value="daily" ${settings.budgetPeriod === 'daily' ? 'selected' : ''}>Daily</option>
                                        <option value="weekly" ${settings.budgetPeriod === 'weekly' ? 'selected' : ''}>Weekly</option>
                                        <option value="monthly" ${settings.budgetPeriod === 'monthly' ? 'selected' : ''}>Monthly</option>
                                        <option value="yearly" ${settings.budgetPeriod === 'yearly' ? 'selected' : ''}>Yearly</option>
                                    </select>
                                </div>
                            </div>

                            <div class="alert alert-info">
                                <i class="bi bi-info-circle me-2"></i>
                                <strong>Current Usage:</strong> $0.00 / $${settings.budget} ${settings.budgetPeriod}
                                <div class="progress mt-2" style="height: 8px;">
                                    <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                                </div>
                            </div>

                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="budgetAlert" checked>
                                <label class="form-check-label" for="budgetAlert">
                                    Alert me when budget reaches 80%
                                </label>
                            </div>

                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="budgetStop" checked>
                                <label class="form-check-label" for="budgetStop">
                                    Stop evaluations when budget is exceeded
                                </label>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Model Settings -->
                <div class="card mb-3">
                    <div class="card-header">
                        <i class="bi bi-cpu me-2"></i>Model Configuration
                    </div>
                    <div class="card-body">
                        <form id="modelForm">
                            <div class="mb-3">
                                <label for="defaultModel" class="form-label">Default Model</label>
                                <select class="form-select" id="defaultModel">
                                    <option value="">No default (prompt each time)</option>
                                    ${AppState.models.map(m => `
                                        <option value="${m.id}" ${settings.defaultModel === m.id ? 'selected' : ''}>
                                            ${m.name} - ${m.provider}
                                        </option>
                                    `).join('')}
                                </select>
                                <small class="text-muted">Model to use by default for new evaluations</small>
                            </div>

                            <div class="mb-3">
                                <label for="temperature" class="form-label">
                                    Default Temperature: <span id="temperatureValue">0.7</span>
                                </label>
                                <input type="range" class="form-range" id="temperature" 
                                       min="0" max="2" step="0.1" value="0.7">
                                <div class="d-flex justify-content-between">
                                    <small class="text-muted">More focused</small>
                                    <small class="text-muted">More creative</small>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="maxTokens" class="form-label">Default Max Tokens</label>
                                <input type="number" class="form-control" id="maxTokens" 
                                       value="1000" min="1" max="4000">
                                <small class="text-muted">Maximum length of generated responses</small>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Automation Settings -->
                <div class="card mb-3">
                    <div class="card-header">
                        <i class="bi bi-gear me-2"></i>Automation
                    </div>
                    <div class="card-body">
                        <form id="automationForm">
                            <div class="form-check form-switch mb-3">
                                <input class="form-check-input" type="checkbox" id="autoRun" 
                                       ${settings.autoRun ? 'checked' : ''}>
                                <label class="form-check-label" for="autoRun">
                                    <strong>Auto-run evaluations on save</strong>
                                    <br>
                                    <small class="text-muted">Automatically execute evaluations when prompt is saved</small>
                                </label>
                            </div>

                            <div class="form-check form-switch mb-3">
                                <input class="form-check-input" type="checkbox" id="notifications" 
                                       ${settings.notifications ? 'checked' : ''}>
                                <label class="form-check-label" for="notifications">
                                    <strong>Enable notifications</strong>
                                    <br>
                                    <small class="text-muted">Receive alerts when evaluations complete</small>
                                </label>
                            </div>

                            <div class="form-check form-switch mb-3">
                                <input class="form-check-input" type="checkbox" id="darkMode">
                                <label class="form-check-label" for="darkMode">
                                    <strong>Dark mode</strong>
                                    <br>
                                    <small class="text-muted">Switch to dark theme (coming soon)</small>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button type="button" class="btn btn-outline-secondary" onclick="resetSettings()">
                        <i class="bi bi-arrow-counterclockwise me-1"></i>Reset to Defaults
                    </button>
                    <button type="button" class="btn btn-primary" onclick="saveSettings()">
                        <i class="bi bi-check-lg me-1"></i>Save Settings
                    </button>
                </div>
            </div>

            <div class="col-lg-4">
                <!-- Cost Calculator -->
                <div class="card mb-3">
                    <div class="card-header">
                        <i class="bi bi-calculator me-2"></i>Cost Calculator
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="calcEvaluations" class="form-label">Number of Evaluations</label>
                            <input type="number" class="form-control" id="calcEvaluations" 
                                   value="100" min="1" onchange="calculateCost()">
                        </div>
                        <div class="mb-3">
                            <label for="calcTokens" class="form-label">Avg Tokens per Evaluation</label>
                            <input type="number" class="form-control" id="calcTokens" 
                                   value="500" min="1" onchange="calculateCost()">
                        </div>
                        <div class="mb-3">
                            <label for="calcModel" class="form-label">Model</label>
                            <select class="form-select" id="calcModel" onchange="calculateCost()">
                                ${AppState.models.map(m => `
                                    <option value="${m.id}" data-cost="${m.cost_per_1k_tokens || 0.002}">
                                        ${m.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between align-items-center">
                            <strong>Estimated Cost:</strong>
                            <h4 class="mb-0 text-primary" id="estimatedCost">$0.00</h4>
                        </div>
                        <small class="text-muted">Based on current pricing</small>
                    </div>
                </div>

                <!-- API Keys -->
                <div class="card">
                    <div class="card-header">
                        <i class="bi bi-key me-2"></i>API Keys
                    </div>
                    <div class="card-body">
                        <p class="small text-muted">Configure API keys for LLM providers</p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-sm btn-outline-primary" onclick="alert('API key management coming soon')">
                                <i class="bi bi-plus-lg me-1"></i>Add API Key
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Setup event listeners for settings
    setupSettingsListeners();
}

/**
 * Render models view
 */
function renderModelsView() {
    const mainContent = document.getElementById('mainContent');
    
    if (!AppState.models || AppState.models.length === 0) {
        mainContent.innerHTML = `
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Available Models</h1>
            </div>
            <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                No models available. Please check your configuration.
            </div>
        `;
        return;
    }
    
    mainContent.innerHTML = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Available Models</h1>
        </div>

        <div class="row g-3">
            ${AppState.models.map(model => `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${escapeHtml(model.name)}</h5>
                            <p class="text-muted">${escapeHtml(model.provider)}</p>
                            <hr>
                            <dl class="mb-0">
                                <dt class="small">Context Window</dt>
                                <dd class="mb-2">${(model.context_window || model.context_length || 0).toLocaleString()} tokens</dd>
                                
                                <dt class="small">Cost per 1K tokens</dt>
                                <dd class="mb-0">$${(model.cost_per_1k_tokens || 0.002).toFixed(4)}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Project management functions
 */
function viewProject(projectId) {
    const project = AppState.projects.find(p => p.id === projectId);
    if (!project) return;
    
    alert(`View Project: ${project.name}\n\nEvaluations: ${AppState.evaluations.filter(e => e.project_id === projectId).length}\nModel: ${project.model}\n\n(Detailed view coming soon)`);
}

function editProject(projectId) {
    alert(`Edit project: ${projectId}\n(Feature coming soon)`);
}

function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    alert(`Delete project: ${projectId}\n(Feature coming soon)`);
}

function showNewProjectModal() {
    alert('New Project modal will open here.\n(Feature coming soon)');
}

/**
 * Settings management functions
 */
function setupSettingsListeners() {
    // Temperature slider
    const tempSlider = document.getElementById('temperature');
    const tempValue = document.getElementById('temperatureValue');
    if (tempSlider && tempValue) {
        tempSlider.addEventListener('input', (e) => {
            tempValue.textContent = e.target.value;
        });
    }
    
    // Calculate cost on load
    calculateCost();
}

function calculateCost() {
    const evaluations = parseInt(document.getElementById('calcEvaluations')?.value || 100);
    const tokens = parseInt(document.getElementById('calcTokens')?.value || 500);
    const modelSelect = document.getElementById('calcModel');
    const costPerK = parseFloat(modelSelect?.options[modelSelect.selectedIndex]?.dataset.cost || 0.002);
    
    const totalTokens = evaluations * tokens;
    const cost = (totalTokens / 1000) * costPerK;
    
    const costElement = document.getElementById('estimatedCost');
    if (costElement) {
        costElement.textContent = `$${cost.toFixed(2)}`;
    }
}

function saveSettings() {
    const settings = {
        budget: document.getElementById('budgetAmount')?.value,
        budgetPeriod: document.getElementById('budgetPeriod')?.value,
        defaultModel: document.getElementById('defaultModel')?.value,
        autoRun: document.getElementById('autoRun')?.checked,
        notifications: document.getElementById('notifications')?.checked,
        temperature: document.getElementById('temperature')?.value,
        maxTokens: document.getElementById('maxTokens')?.value
    };
    
    // Save to localStorage
    Object.entries(settings).forEach(([key, value]) => {
        const storageKey = key === 'budget' ? 'evalBudget' : key === 'budgetPeriod' ? 'evalBudgetPeriod' : key;
        localStorage.setItem(storageKey, value);
    });
    
    alert('Settings saved successfully!');
}

function resetSettings() {
    if (!confirm('Reset all settings to defaults?')) return;
    
    // Clear localStorage
    ['evalBudget', 'evalBudgetPeriod', 'defaultModel', 'autoRun', 'notifications', 'temperature', 'maxTokens'].forEach(key => {
        localStorage.removeItem(key);
    });
    
    // Re-render settings view
    renderSettingsView();
}

/**
 * Load section based on navigation
 */
function loadSection(section) {
    switch(section) {
        case 'Projects':
            renderProjectsView();
            break;
        case 'models':
            renderModelsView();
            break;
        case 'settings':
            renderSettingsView();
            break;
        default:
            renderProjectsView();
    }
}

// ============================================================================
// SIDEBAR MANAGEMENT
// ============================================================================

/**
 * Toggle sidebar collapsed state
 */
function toggleSidebar() {
    const sidebarWrapper = document.getElementById('sidebarWrapper');
    const isCollapsed = sidebarWrapper.classList.contains('collapsed');
    
    if (isCollapsed) {
        expandSidebar();
    } else {
        collapseSidebar();
    }
    
    // Save preference to localStorage
    localStorage.setItem('sidebarCollapsed', !isCollapsed);
}

/**
 * Collapse the sidebar
 */
function collapseSidebar() {
    const sidebarWrapper = document.getElementById('sidebarWrapper');
    sidebarWrapper.classList.add('collapsed');
    
    // Update button icon and title
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    collapseBtn.setAttribute('title', 'Expand Sidebar (Ctrl+B)');
    
    const toggleBtn = document.getElementById('toggleSidebar');
    if (toggleBtn) {
        toggleBtn.querySelector('i').className = 'bi bi-layout-sidebar-inset-reverse';
        toggleBtn.setAttribute('title', 'Expand Sidebar (Ctrl+B)');
    }
}

/**
 * Expand the sidebar
 */
function expandSidebar() {
    const sidebarWrapper = document.getElementById('sidebarWrapper');
    sidebarWrapper.classList.remove('collapsed');
    
    // Update button icon and title
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    collapseBtn.setAttribute('title', 'Collapse Sidebar (Ctrl+B)');
    
    const toggleBtn = document.getElementById('toggleSidebar');
    if (toggleBtn) {
        toggleBtn.querySelector('i').className = 'bi bi-layout-sidebar-inset';
        toggleBtn.setAttribute('title', 'Collapse Sidebar (Ctrl+B)');
    }
}

/**
 * Toggle mobile sidebar (show/hide)
 */
function toggleMobileSidebar() {
    const sidebarWrapper = document.getElementById('sidebarWrapper');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebarWrapper.classList.toggle('show');
    
    if (overlay) {
        overlay.classList.toggle('show');
    } else {
        // Create overlay if it doesn't exist
        const newOverlay = document.createElement('div');
        newOverlay.className = 'sidebar-overlay show';
        newOverlay.addEventListener('click', toggleMobileSidebar);
        document.body.appendChild(newOverlay);
    }
}

/**
 * Restore sidebar state from localStorage
 */
function restoreSidebarState() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    if (isCollapsed) {
        collapseSidebar();
    }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Select and display an evaluation
 */
async function selectEvaluation(evalId) {
    const evaluation = AppState.evaluations.find(e => e.id === evalId);
    if (!evaluation) return;
    
    AppState.currentEvaluation = evaluation;
    
    // Update UI
    renderEvaluationList(AppState.evaluations);
    renderOutput(evaluation);
    renderMetadata(evaluation);
    
    // Load and render test results
    const testResults = await API.getTestResults(evalId);
    renderTestResults(testResults);
    
    // Load and render logs
    const logs = await API.getLogs(evalId);
    renderLogs(logs);
    
    // Load and render LLM judge scores
    const judgeScores = await API.getLLMJudgeScores(evalId);
    renderJudgeScores(judgeScores);
    
    // Populate prompt editor
    document.getElementById('promptInput').value = evaluation.prompt || '';
    document.getElementById('userInput').value = evaluation.user_input || '';
}

/**
 * Run evaluation simulation
 */
async function runEvaluation() {
    const prompt = document.getElementById('promptInput').value;
    const userInput = document.getElementById('userInput').value;
    
    if (!prompt || !userInput) {
        alert('Please enter both system prompt and user input');
        return;
    }
    
    const evalId = AppState.currentEvaluation?.id || 'eval-new';
    
    try {
        const result = await API.runEvaluation(evalId, prompt, userInput);
        
        // Update current evaluation with result
        if (AppState.currentEvaluation) {
            AppState.currentEvaluation.output = result.output;
            AppState.currentEvaluation.status = result.status;
            AppState.currentEvaluation.duration_ms = result.duration_ms;
        }
        
        // Re-render output
        renderOutput(AppState.currentEvaluation);
        
        // Switch to Output tab
        const outputTab = document.getElementById('output-tab');
        outputTab.click();
        
    } catch (error) {
        console.error('Error running evaluation:', error);
        alert('Failed to run evaluation. Check console for details.');
    }
}

/**
 * Apply filters to evaluation list
 */
async function applyFilters() {
    const filters = {
        project: document.getElementById('projectFilter').value,
        status: document.getElementById('statusFilter').value,
        model: document.getElementById('modelFilter').value
    };
    
    AppState.filters = filters;
    const evaluations = await API.getEvaluations(filters);
    AppState.evaluations = evaluations;
    renderEvaluationList(evaluations);
}

/**
 * Clear all filters
 */
async function clearFilters() {
    document.getElementById('projectFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('modelFilter').value = '';
    await applyFilters();
}

/**
 * Run comparison across multiple models
 */
async function runComparison() {
    const selectedModels = Array.from(
        document.querySelectorAll('#modelSelection input[type="checkbox"]:checked')
    ).map(input => ({
        id: input.value,
        name: input.dataset.modelName
    }));
    
    if (selectedModels.length < 2) {
        alert('Please select at least 2 models to compare');
        return;
    }
    
    if (selectedModels.length > 5) {
        alert('Please select no more than 5 models');
        return;
    }
    
    const prompt = document.getElementById('promptInput').value;
    const userInput = document.getElementById('userInput').value;
    
    if (!prompt || !userInput) {
        alert('Please enter both system prompt and user input');
        return;
    }
    
    showLoading(true);
    
    try {
        // Simulate comparison API call
        // TODO: Replace with actual API call
        // const response = await fetch('/api/comparisons', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         models: selectedModels.map(m => m.id),
        //         prompt,
        //         input: userInput
        //     })
        // });
        
        // Mock comparison results
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const mockResults = selectedModels.map((model, index) => ({
            model_id: model.id,
            model_name: model.name,
            output: `Sample output from ${model.name}:\n\n${prompt}\n\nUser: ${userInput}\n\nAssistant: This is a mock response for comparison purposes.`,
            overall_score: 8 + Math.random() * 2,
            accuracy: 8 + Math.random() * 2,
            helpfulness: 8 + Math.random() * 2,
            latency_ms: 1000 + Math.random() * 3000,
            cost: 0.01 + Math.random() * 0.05,
            pass_rate: Math.floor(80 + Math.random() * 20)
        }));
        
        renderComparisonResults(mockResults);
        
    } catch (error) {
        console.error('Error running comparison:', error);
        alert('Failed to run comparison. Check console for details.');
    } finally {
        showLoading(false);
    }
}

/**
 * Export comparison results
 */
function exportComparison() {
    // TODO: Implement export functionality
    alert('Export feature coming soon! Will export to CSV/JSON/PDF.');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
}

function formatDuration(ms) {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

function formatMetricName(metric) {
    return metric.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function getProjectName(projectId) {
    const project = AppState.projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the application
 */
async function init() {
    showLoading(true);
    
    try {
        // Load all data
        AppState.projects = await API.getProjects();
        AppState.evaluations = await API.getEvaluations();
        AppState.models = await API.getModels();
        
        // Check for URL parameter to load specific section
        const urlParams = new URLSearchParams(window.location.search);
        const section = urlParams.get('section');
        
        if (section) {
            // Load the requested section
            loadSection(section);
            
            // Update active nav link
            document.querySelectorAll('.sidebar .nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href')?.includes(`section=${section}`)) {
                    link.classList.add('active');
                }
            });
        } else {
            // Show Projects view by default
            renderProjectsView();
            
            // Set Projects as active in sidebar
            document.querySelectorAll('.sidebar .nav-link').forEach(link => {
                link.classList.remove('active');
                const linkSection = link.dataset.section || link.querySelector('.nav-text')?.textContent.trim();
                if (linkSection === 'Projects') {
                    link.classList.add('active');
                }
            });
        }
        
        // Populate sidebar
        populateRecentProjects();
        populateFilters();
        
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to load application data. Check console for details.');
    } finally {
        showLoading(false);
    }
}

/**
 * Populate filter dropdowns
 */
function populateFilters() {
    // Project filter
    const projectFilter = document.getElementById('projectFilter');
    if (projectFilter) {
        projectFilter.innerHTML = '<option value="">All Projects</option>' +
            AppState.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    }
    
    // Model filter
    const modelFilter = document.getElementById('modelFilter');
    if (modelFilter) {
        modelFilter.innerHTML = '<option value="">All Models</option>' +
            AppState.models.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Run evaluation button
    const runBtn = document.getElementById('runEvaluationBtn');
    if (runBtn) {
        runBtn.addEventListener('click', runEvaluation);
    }
    
    // Refresh evaluation list
    const refreshBtn = document.getElementById('refreshEvalList');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            await applyFilters();
        });
    }
    
    // Filter changes
    const projectFilter = document.getElementById('projectFilter');
    const statusFilter = document.getElementById('statusFilter');
    const modelFilter = document.getElementById('modelFilter');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    
    if (projectFilter) projectFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (modelFilter) modelFilter.addEventListener('change', applyFilters);
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Comparison functionality
    const runComparisonBtn = document.getElementById('runComparisonBtn');
    const exportComparisonBtn = document.getElementById('exportComparisonBtn');
    
    if (runComparisonBtn) runComparisonBtn.addEventListener('click', runComparison);
    if (exportComparisonBtn) exportComparisonBtn.addEventListener('click', exportComparison);
    
    // Switch to Compare tab - render model selection
    const compareTab = document.getElementById('compare-tab');
    if (compareTab) {
        compareTab.addEventListener('shown.bs.tab', () => {
            renderModelSelection();
        });
    }
    
    // Sidebar toggle buttons
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    
    if (toggleSidebarBtn) toggleSidebarBtn.addEventListener('click', toggleSidebar);
    if (sidebarCollapseBtn) sidebarCollapseBtn.addEventListener('click', toggleSidebar);
    
    // Mobile sidebar toggle
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', toggleMobileSidebar);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + R: Run evaluation
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            const runBtn = document.getElementById('runEvaluationBtn');
            if (runBtn) runEvaluation();
        }
        
        // Ctrl/Cmd + F: Focus filter
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const projectFilter = document.getElementById('projectFilter');
            if (projectFilter) projectFilter.focus();
        }
        
        // Ctrl/Cmd + B: Toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
        
        // Escape: Close mobile sidebar
        if (e.key === 'Escape') {
            const sidebarWrapper = document.getElementById('sidebarWrapper');
            if (sidebarWrapper && sidebarWrapper.classList.contains('show')) {
                toggleMobileSidebar();
            }
        }
    });
    
    // Sidebar navigation with proper section handling
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for hash links or data-section links, not real page links
            const href = this.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('#') && !this.hasAttribute('data-section')) {
                // Allow normal navigation for real page links like datasets.html
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('#sidebar .nav-link').forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get section from data-section or text content
            const section = this.dataset.section || this.querySelector('.nav-text')?.textContent.trim();
            
            // Handle section switching
            if (section) {
                loadSection(section);
            }
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Remove mobile sidebar classes on desktop
            if (window.innerWidth >= 768) {
                const sidebarWrapper = document.getElementById('sidebarWrapper');
                const overlay = document.querySelector('.sidebar-overlay');
                
                if (sidebarWrapper) sidebarWrapper.classList.remove('show');
                if (overlay) overlay.remove();
            }
        }, 250);
    });
}

// ============================================================================
// APPLICATION START
// ============================================================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupEventListeners();
        restoreSidebarState();
        init();
    });
} else {
    setupEventListeners();
    restoreSidebarState();
    init();
}

/**
 * Populate recent projects in sidebar
 */
function populateRecentProjects() {
    const recentProjects = document.getElementById('recentProjects');
    if (!recentProjects) return;
    
    const recent = AppState.projects.slice(0, 5);
    
    if (recent.length === 0) {
        recentProjects.innerHTML = '<li class="nav-item px-3 py-2"><small class="text-muted">No recent projects</small></li>';
        return;
    }
    
    recentProjects.innerHTML = recent.map(project => `
        <li class="nav-item">
            <a class="nav-link" href="#" onclick="viewProject('${project.id}'); return false;">
                <i class="bi bi-folder2 me-2"></i>
                <span class="nav-text">${escapeHtml(project.name)}</span>
            </a>
        </li>
    `).join('');
}

/**
 * Render the list of evaluations in the left panel
 */
function renderEvaluationList(evaluations) {
    const listContainer = document.getElementById('evaluationList');
    if (!listContainer) return;
    
    if (!evaluations || evaluations.length === 0) {
        listContainer.innerHTML = '<div class="p-3 text-muted">No evaluations found</div>';
        return;
    }
    
    listContainer.innerHTML = evaluations.map(eval => `
        <a href="#" 
           class="list-group-item list-group-item-action ${AppState.currentEvaluation?.id === eval.id ? 'active' : ''}"
           data-eval-id="${eval.id}"
           role="button"
           aria-label="Evaluation ${eval.name}">
            <div class="eval-item-header">
                <span class="eval-item-title">${eval.name}</span>
                <span class="badge badge-${eval.status}">${eval.status}</span>
            </div>
            <div class="eval-item-meta">
                <span><i class="bi bi-cpu"></i> ${eval.model}</span>
                <span><i class="bi bi-clock"></i> ${formatDuration(eval.duration_ms)}</span>
            </div>
            <div class="mt-2">
                <small class="text-muted">${formatDate(eval.created_at)}</small>
            </div>
        </a>
    `).join('');
    
    // Add click handlers
    listContainer.querySelectorAll('[data-eval-id]').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            const evalId = e.currentTarget.dataset.evalId;
            await selectEvaluation(evalId);
        });
    });
}

/**
 * Render evaluation output in the Output tab
 */
function renderOutput(evaluation) {
    const outputContent = document.getElementById('outputContent');
    if (!outputContent) return;
    
    if (!evaluation || !evaluation.output) {
        outputContent.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="bi bi-play-circle fs-1"></i>
                <p class="mt-3">Run an evaluation to see results</p>
            </div>
        `;
        return;
    }
    
    outputContent.innerHTML = `
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong>Status:</strong>
                <span class="badge badge-${evaluation.status}">${evaluation.status.toUpperCase()}</span>
            </div>
            <div class="mb-2">
                <strong>Duration:</strong> ${formatDuration(evaluation.duration_ms)}
            </div>
        </div>
        <div class="border rounded p-3 bg-light">
            <pre class="mb-0" style="white-space: pre-wrap;">${escapeHtml(evaluation.output)}</pre>
        </div>
    `;
}

/**
 * Render test results in the Tests tab
 */
function renderTestResults(results) {
    const testsContent = document.getElementById('testsContent');
    if (!testsContent) return;
    
    if (!results || results.length === 0) {
        testsContent.innerHTML = '<p class="text-muted">No test results available</p>';
        return;
    }
    
    const passedCount = results.filter(r => r.status === 'passed').length;
    const totalCount = results.length;
    const passRate = ((passedCount / totalCount) * 100).toFixed(1);
    
    testsContent.innerHTML = `
        <div class="mb-3">
            <div class="d-flex justify-content-between mb-2">
                <span><strong>${passedCount}/${totalCount}</strong> tests passed</span>
                <span><strong>${passRate}%</strong></span>
            </div>
            <div class="progress">
                <div class="progress-bar bg-success" role="progressbar" 
                     style="width: ${passRate}%" 
                     aria-valuenow="${passRate}" 
                     aria-valuemin="0" 
                     aria-valuemax="100"></div>
            </div>
        </div>
        <div>
            ${results.map(test => `
                <div class="test-result-item ${test.status}">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <strong>${test.test_name}</strong>
                        <span class="badge badge-${test.status}">
                            <i class="bi bi-${test.status === 'passed' ? 'check-circle' : 'x-circle'}"></i>
                            ${test.status}
                        </span>
                    </div>
                    <p class="mb-1 small">${test.message}</p>
                    <small class="text-muted">Execution time: ${test.execution_time_ms}ms</small>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Render execution logs in the Logs tab
 */
function renderLogs(logs) {
    const logsContent = document.getElementById('logsContent');
    if (!logsContent) return;
    
    const pre = logsContent.querySelector('pre');
    if (pre) {
        pre.textContent = logs || 'No logs available';
    }
}

/**
 * Render LLM judge scores in the Judge tab
 */
function renderJudgeScores(scores) {
    const judgeContent = document.getElementById('judgeContent');
    if (!judgeContent) return;
    
    if (!scores) {
        judgeContent.innerHTML = '<p class="text-muted">No LLM judge scores available</p>';
        return;
    }
    
    const scoreEntries = Object.entries(scores).filter(([key]) => key !== 'feedback' && key !== 'overall');
    
    judgeContent.innerHTML = `
        <div class="judge-score mb-3" style="background-color: var(--bg-light); border: 2px solid var(--primary-indigo);">
            <div>
                <div class="score-label">Overall Score</div>
                <div class="score-value">${scores.overall.toFixed(1)}/10</div>
            </div>
            <i class="bi bi-stars fs-1 text-warning"></i>
        </div>
        
        <h6 class="mb-3">Detailed Scores</h6>
        ${scoreEntries.map(([metric, value]) => `
            <div class="judge-score">
                <div>
                    <div class="score-label">${formatMetricName(metric)}</div>
                    <div class="score-value" style="font-size: 1.2rem;">${value.toFixed(1)}</div>
                </div>
                <div class="progress" style="width: 100px; height: 8px;">
                    <div class="progress-bar" role="progressbar" 
                         style="width: ${value * 10}%" 
                         aria-valuenow="${value}" 
                         aria-valuemin="0" 
                         aria-valuemax="10"></div>
                </div>
            </div>
        `).join('')}
        
        ${scores.feedback ? `
            <div class="mt-3 p-3 border rounded bg-light">
                <strong>Feedback:</strong>
                <p class="mb-0 mt-2">${escapeHtml(scores.feedback)}</p>
            </div>
        ` : ''}
    `;
}

/**
 * Render evaluation metadata in the right panel
 */
function renderMetadata(evaluation) {
    const metadataContent = document.getElementById('metadataContent');
    if (!metadataContent) return;
    
    if (!evaluation) {
        metadataContent.innerHTML = '<p class="text-muted small">Select an evaluation to view metadata</p>';
        return;
    }
    
    metadataContent.innerHTML = `
        <dl class="metadata-table mb-0">
            <dt>Evaluation ID</dt>
            <dd><code class="small">${evaluation.id}</code></dd>
            
            <dt>Project</dt>
            <dd>${getProjectName(evaluation.project_id)}</dd>
            
            <dt>Model</dt>
            <dd><span class="badge bg-secondary">${evaluation.model}</span></dd>
            
            <dt>Status</dt>
            <dd><span class="badge badge-${evaluation.status}">${evaluation.status}</span></dd>
            
            <dt>Created</dt>
            <dd>${formatDate(evaluation.created_at)}</dd>
            
            <dt>Duration</dt>
            <dd>${formatDuration(evaluation.duration_ms)}</dd>
            
            ${evaluation.total_tests ? `
                <dt>Tests</dt>
                <dd>${evaluation.passed_tests || 0}/${evaluation.total_tests} passed</dd>
            ` : ''}
            
            ${evaluation.metadata ? `
                <dt>Temperature</dt>
                <dd>${evaluation.metadata.temperature}</dd>
                
                <dt>Max Tokens</dt>
                <dd>${evaluation.metadata.max_tokens}</dd>
                
                <dt>Dataset</dt>
                <dd>${evaluation.metadata.dataset}</dd>
            ` : ''}
        </dl>
    `;
}

/**
 * Render model selection for comparison
 */
function renderModelSelection() {
    const modelSelection = document.getElementById('modelSelection');
    if (!modelSelection) return;
    
    if (!AppState.models || AppState.models.length === 0) {
        modelSelection.innerHTML = '<p class="text-muted">No models available</p>';
        return;
    }
    
    modelSelection.innerHTML = AppState.models.map(model => `
        <div class="col-6">
            <label class="model-selection-card">
                <div class="d-flex align-items-center">
                    <input type="checkbox" class="me-2" value="${model.id}" 
                           data-model-name="${model.name}">
                    <div class="flex-grow-1">
                        <div class="fw-bold">${model.name}</div>
                        <small class="text-muted">${model.provider}</small>
                    </div>
                </div>
            </label>
        </div>
    `).join('');
    
    // Add change listeners
    modelSelection.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const card = e.target.closest('.model-selection-card');
            if (e.target.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    });
}

/**
 * Render comparison results
 */
function renderComparisonResults(results) {
    const comparisonResults = document.getElementById('comparisonResults');
    if (!comparisonResults) return;
    
    if (!results || results.length === 0) {
        comparisonResults.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="bi bi-box-arrow-in-right fs-1"></i>
                <p class="mt-3">No comparison results yet</p>
            </div>
        `;
        return;
    }
    
    // Find best model
    const bestModel = results.reduce((best, current) => 
        current.overall_score > best.overall_score ? current : best
    );
    
    comparisonResults.innerHTML = `
        <h6 class="mb-3">Comparison Results</h6>
        
        <!-- Summary Table -->
        <div class="table-responsive mb-3">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Model</th>
                        <th>Overall Score</th>
                        <th>Latency</th>
                        <th>Cost</th>
                        <th>Pass Rate</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(result => `
                        <tr class="${result.model_id === bestModel.model_id ? 'table-success' : ''}">
                            <td>
                                <strong>${result.model_name}</strong>
                                ${result.model_id === bestModel.model_id ? '<span class="badge bg-success ms-2">Winner</span>' : ''}
                            </td>
                            <td class="${result.overall_score === bestModel.overall_score ? 'metric-value best' : 'metric-value'}">
                                ${result.overall_score.toFixed(1)}/10
                            </td>
                            <td>${formatDuration(result.latency_ms)}</td>
                            <td>$${result.cost.toFixed(4)}</td>
                            <td>${result.pass_rate}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <!-- Detailed Comparison Cards -->
        <div class="accordion" id="comparisonAccordion">
            ${results.map((result, index) => `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                            ${result.model_name} - ${result.overall_score.toFixed(1)}/10
                        </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                         data-bs-parent="#comparisonAccordion">
                        <div class="accordion-body">
                            <div class="mb-3">
                                <strong>Output:</strong>
                                <pre class="mt-2 p-2 border rounded bg-light">${escapeHtml(result.output)}</pre>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <div class="comparison-metric">
                                        <span class="metric-label">Accuracy</span>
                                        <span class="metric-value">${result.accuracy.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="comparison-metric">
                                        <span class="metric-label">Helpfulness</span>
                                        <span class="metric-value">${result.helpfulness.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
