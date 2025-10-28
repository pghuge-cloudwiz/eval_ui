// Import shared functionality if needed (for now, duplicate necessary code)

const API_BASE = 'http://localhost:8080/api';

const EvalState = {
    currentEvaluation: null,
    projects: [],
    evaluations: [],
    models: []
};

// Load mock data
async function loadMockData() {
    try {
        const response = await fetch('mock-data.json');
        if (!response.ok) throw new Error('Failed to load mock data');
        return await response.json();
    } catch (error) {
        console.error('Error loading mock data:', error);
        return null;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    showLoading(true);
    
    try {
        const data = await loadMockData();
        if (data) {
            EvalState.projects = data.projects || [];
            EvalState.evaluations = data.evaluations || [];
            EvalState.models = data.models || [];
        }
        
        // Populate UI
        populateFilters();
        renderEvaluationList(EvalState.evaluations);
        
        // Select first evaluation
        if (EvalState.evaluations.length > 0) {
            await selectEvaluation(EvalState.evaluations[0].id);
        }
        
        setupEventListeners();
        setupSidebarToggle();
        
    } catch (error) {
        console.error('Initialization error:', error);
    } finally {
        showLoading(false);
    }
});

function setupEventListeners() {
    document.getElementById('refreshEvalList')?.addEventListener('click', () => {
        renderEvaluationList(EvalState.evaluations);
    });
    
    document.getElementById('runEvaluationBtn')?.addEventListener('click', runEvaluation);
    document.getElementById('projectFilter')?.addEventListener('change', applyFilters);
    document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
    document.getElementById('modelFilter')?.addEventListener('change', applyFilters);
    document.getElementById('clearFiltersBtn')?.addEventListener('click', clearFilters);
    document.getElementById('runComparisonBtn')?.addEventListener('click', runComparison);
    document.getElementById('exportComparisonBtn')?.addEventListener('click', exportComparison);
    
    document.getElementById('compare-tab')?.addEventListener('shown.bs.tab', () => {
        renderModelSelection();
    });
}

function setupSidebarToggle() {
    const toggleSidebar = () => {
        const sidebar = document.getElementById('sidebarWrapper');
        const mainContent = document.getElementById('mainContentWrapper');
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    };

    document.getElementById('toggleSidebar')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebarCollapseBtn')?.addEventListener('click', function() {
        toggleSidebar();
        const icon = this.querySelector('i');
        const sidebar = document.getElementById('sidebarWrapper');
        
        if (sidebar.classList.contains('collapsed')) {
            icon.classList.replace('bi-chevron-left', 'bi-chevron-right');
            this.setAttribute('title', 'Expand Sidebar');
        } else {
            icon.classList.replace('bi-chevron-right', 'bi-chevron-left');
            this.setAttribute('title', 'Collapse Sidebar');
        }
    });

    document.getElementById('mobileSidebarToggle')?.addEventListener('click', function() {
        document.getElementById('sidebarWrapper').classList.toggle('show');
    });

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
    });
}

function populateFilters() {
    const projectFilter = document.getElementById('projectFilter');
    if (projectFilter) {
        projectFilter.innerHTML = '<option value="">All Projects</option>' +
            EvalState.projects.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('');
    }
    
    const modelFilter = document.getElementById('modelFilter');
    if (modelFilter) {
        modelFilter.innerHTML = '<option value="">All Models</option>' +
            EvalState.models.map(m => `<option value="${m.id}">${escapeHtml(m.name)}</option>`).join('');
    }
}

function renderEvaluationList(evaluations) {
    const listContainer = document.getElementById('evaluationList');
    if (!listContainer) return;
    
    if (!evaluations || evaluations.length === 0) {
        listContainer.innerHTML = '<div class="p-3 text-muted">No evaluations found</div>';
        return;
    }
    
    listContainer.innerHTML = evaluations.map(eval => `
        <a href="#" 
           class="list-group-item list-group-item-action ${EvalState.currentEvaluation?.id === eval.id ? 'active' : ''}"
           data-eval-id="${eval.id}"
           role="button">
            <div class="eval-item-header">
                <span class="eval-item-title">${escapeHtml(eval.name)}</span>
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

async function selectEvaluation(evalId) {
    const data = await loadMockData();
    if (!data) return;
    
    const evaluation = EvalState.evaluations.find(e => e.id === evalId);
    if (!evaluation) return;
    
    EvalState.currentEvaluation = evaluation;
    
    // Update UI
    renderEvaluationList(EvalState.evaluations);
    renderOutput(evaluation);
    renderMetadata(evaluation);
    renderTestResults(data.test_results[evalId] || []);
    renderLogs(data.logs[evalId] || '');
    renderJudgeScores(data.llm_judge_scores[evalId] || null);
    
    // Populate prompt editor
    document.getElementById('promptInput').value = evaluation.prompt || '';
    document.getElementById('userInput').value = evaluation.user_input || '';
}

async function runEvaluation() {
    const prompt = document.getElementById('promptInput').value;
    const userInput = document.getElementById('userInput').value;
    
    if (!prompt || !userInput) {
        alert('Please enter both system prompt and user input');
        return;
    }
    
    showLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    showLoading(false);
    
    const result = {
        output: `Mock output:\n\nPrompt: ${prompt}\nInput: ${userInput}\n\nThis is a simulated response.`,
        status: 'passed',
        duration_ms: 2000
    };
    
    if (EvalState.currentEvaluation) {
        EvalState.currentEvaluation.output = result.output;
        EvalState.currentEvaluation.status = result.status;
        EvalState.currentEvaluation.duration_ms = result.duration_ms;
    }
    
    renderOutput(EvalState.currentEvaluation);
    document.getElementById('output-tab').click();
}

function applyFilters() {
    const projectFilter = document.getElementById('projectFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const modelFilter = document.getElementById('modelFilter').value;
    
    let filtered = EvalState.evaluations;
    
    if (projectFilter) filtered = filtered.filter(e => e.project_id === projectFilter);
    if (statusFilter) filtered = filtered.filter(e => e.status === statusFilter);
    if (modelFilter) filtered = filtered.filter(e => e.model === modelFilter);
    
    renderEvaluationList(filtered);
}

function clearFilters() {
    document.getElementById('projectFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('modelFilter').value = '';
    renderEvaluationList(EvalState.evaluations);
}

async function runComparison() {
    const selectedModels = Array.from(
        document.querySelectorAll('#modelSelection input[type="checkbox"]:checked')
    ).map(input => ({ id: input.value, name: input.dataset.modelName }));
    
    if (selectedModels.length < 2) {
        alert('Please select at least 2 models to compare');
        return;
    }
    
    showLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    showLoading(false);
    
    const mockResults = selectedModels.map(model => ({
        model_id: model.id,
        model_name: model.name,
        output: `Sample output from ${model.name}`,
        overall_score: 8 + Math.random() * 2,
        accuracy: 8 + Math.random() * 2,
        helpfulness: 8 + Math.random() * 2,
        latency_ms: 1000 + Math.random() * 3000,
        cost: 0.01 + Math.random() * 0.05,
        pass_rate: Math.floor(80 + Math.random() * 20)
    }));
    
    renderComparisonResults(mockResults);
}

function exportComparison() {
    alert('Export feature coming soon!');
}

// Rendering functions (output, tests, logs, judge, metadata, model selection, comparison results)
// Copy from app.js renderOutput, renderTestResults, renderLogs, renderJudgeScores, renderMetadata, renderModelSelection, renderComparisonResults

function renderOutput(evaluation) {
    const outputContent = document.getElementById('outputContent');
    if (!outputContent) return;
    
    if (!evaluation || !evaluation.output) {
        outputContent.innerHTML = '<div class="text-center text-muted py-5"><i class="bi bi-play-circle fs-1"></i><p class="mt-3">Run an evaluation to see results</p></div>';
        return;
    }
    
    outputContent.innerHTML = `
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong>Status:</strong>
                <span class="badge badge-${evaluation.status}">${evaluation.status.toUpperCase()}</span>
            </div>
            <div class="mb-2"><strong>Duration:</strong> ${formatDuration(evaluation.duration_ms)}</div>
        </div>
        <div class="border rounded p-3 bg-light">
            <pre class="mb-0" style="white-space: pre-wrap;">${escapeHtml(evaluation.output)}</pre>
        </div>
    `;
}

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
                <div class="progress-bar bg-success" role="progressbar" style="width: ${passRate}%"></div>
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

function renderLogs(logs) {
    const logsContent = document.getElementById('logsContent');
    if (!logsContent) return;
    const pre = logsContent.querySelector('pre');
    if (pre) pre.textContent = logs || 'No logs available';
}

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
                    <div class="progress-bar" role="progressbar" style="width: ${value * 10}%"></div>
                </div>
            </div>
        `).join('')}
        ${scores.feedback ? `<div class="mt-3 p-3 border rounded bg-light"><strong>Feedback:</strong><p class="mb-0 mt-2">${escapeHtml(scores.feedback)}</p></div>` : ''}
    `;
}

function renderMetadata(evaluation) {
    const metadataContent = document.getElementById('metadataContent');
    if (!metadataContent) return;
    
    if (!evaluation) {
        metadataContent.innerHTML = '<p class="text-muted small">Select an evaluation to view metadata</p>';
        return;
    }
    
    const projectName = EvalState.projects.find(p => p.id === evaluation.project_id)?.name || 'Unknown';
    
    metadataContent.innerHTML = `
        <dl class="metadata-table mb-0">
            <dt>Evaluation ID</dt>
            <dd><code class="small">${evaluation.id}</code></dd>
            <dt>Project</dt>
            <dd>${escapeHtml(projectName)}</dd>
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
        </dl>
    `;
}

function renderModelSelection() {
    const modelSelection = document.getElementById('modelSelection');
    if (!modelSelection) return;
    
    modelSelection.innerHTML = EvalState.models.map(model => `
        <div class="col-6">
            <label class="model-selection-card">
                <div class="d-flex align-items-center">
                    <input type="checkbox" class="me-2" value="${model.id}" data-model-name="${model.name}">
                    <div class="flex-grow-1">
                        <div class="fw-bold">${model.name}</div>
                        <small class="text-muted">${model.provider}</small>
                    </div>
                </div>
            </label>
        </div>
    `).join('');
    
    modelSelection.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            e.target.closest('.model-selection-card').classList.toggle('selected', e.target.checked);
        });
    });
}

function renderComparisonResults(results) {
    const comparisonResults = document.getElementById('comparisonResults');
    if (!comparisonResults || !results || results.length === 0) return;
    
    const bestModel = results.reduce((best, current) => current.overall_score > best.overall_score ? current : best);
    
    comparisonResults.innerHTML = `
        <h6 class="mb-3">Comparison Results</h6>
        <div class="table-responsive mb-3">
            <table class="comparison-table">
                <thead>
                    <tr><th>Model</th><th>Overall Score</th><th>Latency</th><th>Cost</th><th>Pass Rate</th></tr>
                </thead>
                <tbody>
                    ${results.map(result => `
                        <tr class="${result.model_id === bestModel.model_id ? 'table-success' : ''}">
                            <td><strong>${result.model_name}</strong> ${result.model_id === bestModel.model_id ? '<span class="badge bg-success ms-2">Winner</span>' : ''}</td>
                            <td>${result.overall_score.toFixed(1)}/10</td>
                            <td>${formatDuration(result.latency_ms)}</td>
                            <td>$${result.cost.toFixed(4)}</td>
                            <td>${result.pass_rate}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
}

function formatDuration(ms) {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

function formatMetricName(metric) {
    return metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        if (show) spinner.classList.remove('d-none');
        else spinner.classList.add('d-none');
    }
}
