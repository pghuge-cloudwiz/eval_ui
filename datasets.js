const API_BASE = 'http://localhost:8080/api';

// Load datasets on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDatasets();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('previewBtn')?.addEventListener('click', previewDataset);
    document.getElementById('importBtn')?.addEventListener('click', importDataset);
    document.getElementById('fileUpload')?.addEventListener('change', handleFileSelect);
    document.getElementById('refreshDatasetList')?.addEventListener('click', loadDatasets);
}

async function loadDatasets() {
    const container = document.getElementById('datasetList');
    
    // Show loading state
    container.innerHTML = `
        <div class="text-center text-muted py-5">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading datasets...</p>
        </div>
    `;
    
    try {
        // Try API first
        console.log('Attempting to fetch from API:', `${API_BASE}/datasets`);
        const response = await fetch(`${API_BASE}/datasets`);
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        
        const datasets = await response.json();
        console.log('Loaded datasets from API:', datasets);
        displayDatasets(datasets);
        
    } catch (error) {
        console.warn('API not available, loading mock data:', error.message);
        
        // Fallback to mock data
        try {
            console.log('Attempting to load mock-data.json');
            const mockResponse = await fetch('mock-data.json');
            
            if (!mockResponse.ok) {
                throw new Error(`Mock data returned ${mockResponse.status}`);
            }
            
            const mockData = await mockResponse.json();
            console.log('Loaded mock data:', mockData);
            
            if (mockData.datasets) {
                console.log('Found datasets in mock data:', mockData.datasets.length);
                displayDatasets(mockData.datasets);
            } else {
                throw new Error('No datasets property in mock data');
            }
            
        } catch (mockError) {
            console.error('Error loading mock data:', mockError);
            container.innerHTML = `
                <div class="alert alert-warning m-3" role="alert">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    <strong>Unable to load datasets</strong>
                    <p class="mb-0 mt-2">Using mock data for demonstration:</p>
                    <ul class="mb-0 mt-2 small">
                        <li>API Error: ${error.message}</li>
                        <li>Mock Data Error: ${mockError.message}</li>
                    </ul>
                    <button class="btn btn-sm btn-primary mt-2" onclick="loadDatasets()">
                        <i class="bi bi-arrow-clockwise me-1"></i>Retry
                    </button>
                </div>
            `;
            
            // Show demo data anyway
            displayDatasets(getDemoDatasets());
        }
    }
}

function getDemoDatasets() {
    return [
        {
            id: "ds-001",
            name: "Customer Support Q&A v1",
            description: "Collection of 500 customer support conversations",
            row_count: 500,
            created_at: "2024-01-15T10:30:00Z"
        },
        {
            id: "ds-002",
            name: "Code Generation Test Cases",
            description: "Programming problems and expected solutions",
            row_count: 250,
            created_at: "2024-01-20T14:22:00Z"
        },
        {
            id: "ds-003",
            name: "Medical FAQs",
            description: "Common medical questions and answers",
            row_count: 1200,
            created_at: "2024-02-01T09:15:00Z"
        },
        {
            id: "ds-004",
            name: "Sentiment Analysis Training Set",
            description: "Product reviews with sentiment labels",
            row_count: 5000,
            created_at: "2024-02-10T13:00:00Z"
        },
        {
            id: "ds-005",
            name: "Legal Document Summaries",
            description: "Legal contracts and their summaries",
            row_count: 150,
            created_at: "2024-02-12T10:30:00Z"
        }
    ];
}

function displayDatasets(datasets) {
    const container = document.getElementById('datasetList');
    
    if (!datasets || datasets.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="bi bi-database" style="font-size: 3rem;"></i>
                <p class="mt-3">No datasets yet. Import your first dataset to get started.</p>
                <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#importModal">
                    <i class="bi bi-upload me-2"></i>Import Dataset
                </button>
            </div>
        `;
        return;
    }

    const html = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Rows</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${datasets.map(ds => `
                    <tr>
                        <td><strong>${escapeHtml(ds.name)}</strong></td>
                        <td>${escapeHtml(ds.description || '-')}</td>
                        <td><span class="badge bg-secondary">${(ds.row_count || 0).toLocaleString()}</span></td>
                        <td><small class="text-muted">${formatDate(ds.created_at)}</small></td>
                        <td>
                            <div class="btn-group btn-group-sm" role="group">
                                <button class="btn btn-outline-primary" onclick="viewDataset('${ds.id}')" title="View details">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button class="btn btn-outline-secondary" onclick="downloadDataset('${ds.id}')" title="Download">
                                    <i class="bi bi-download"></i>
                                </button>
                                <button class="btn btn-outline-danger" onclick="deleteDataset('${ds.id}')" title="Delete">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="text-muted small mt-2 px-2">
            <i class="bi bi-info-circle me-1"></i>
            Showing ${datasets.length} dataset${datasets.length !== 1 ? 's' : ''}
        </div>
    `;
    
    container.innerHTML = html;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && !document.getElementById('datasetName').value) {
        document.getElementById('datasetName').value = file.name.replace(/\.[^/.]+$/, '');
    }
}

async function previewDataset() {
    // Implementation for preview
    showError('Preview functionality coming soon');
}

async function importDataset() {
    const activeTab = document.querySelector('.tab-pane.active').id;
    
    try {
        if (activeTab === 'uploadTab') {
            await importFromFile();
        } else if (activeTab === 'githubTab') {
            await importFromGithub();
        } else if (activeTab === 'urlTab') {
            await importFromUrl();
        }
        
        bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
        loadDatasets();
    } catch (error) {
        console.error('Import error:', error);
        showError('Failed to import dataset');
    }
}

async function importFromFile() {
    const fileInput = document.getElementById('fileUpload');
    const name = document.getElementById('datasetName').value;
    const description = document.getElementById('datasetDesc').value;
    
    if (!fileInput.files[0]) {
        throw new Error('Please select a file');
    }
    
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('name', name);
    formData.append('description', description);
    
    const response = await fetch(`${API_BASE}/datasets/upload`, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) throw new Error('Upload failed');
}

async function importFromGithub() {
    const data = {
        url: document.getElementById('githubUrl').value,
        branch: document.getElementById('githubBranch').value,
        path: document.getElementById('githubPath').value,
        token: document.getElementById('githubToken').value
    };
    
    const response = await fetch(`${API_BASE}/datasets/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('GitHub import failed');
}

async function importFromUrl() {
    const data = {
        url: document.getElementById('datasetUrl').value,
        auth: document.getElementById('urlAuth').value
    };
    
    const response = await fetch(`${API_BASE}/datasets/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('URL import failed');
}

function viewDataset(id) {
    alert(`View dataset: ${id}\n\nThis would open a detailed view of the dataset.\n(Feature coming soon)`);
    // window.location.href = `dataset-view.html?id=${id}`;
}

function downloadDataset(id) {
    alert(`Download dataset: ${id}\n\nThis would download the dataset file.\n(Feature coming soon)`);
}

async function deleteDataset(id) {
    if (!confirm('Are you sure you want to delete this dataset?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/datasets/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadDatasets();
        }
    } catch (error) {
        console.error('Delete error:', error);
        showError('Failed to delete dataset');
    }
}

function showError(message) {
    alert(message);
}
