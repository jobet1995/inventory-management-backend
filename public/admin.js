let currentToken = localStorage.getItem('admin_token');
let currentSchema = null;
let schemaData = [];
let currentSchemaDef = null;
let currentSchemaEnums = [];
let editingId = null;

// Auth Check & Login Handling
document.addEventListener('DOMContentLoaded', () => {
    if (currentToken) {
        // Show application
        document.getElementById('app-container').style.display = 'grid';
    } else {
        // Redirect to standalone login page
        window.location.href = '/login';
    }

    // Bind static global events
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeEntityModal);

    const createBtn = document.getElementById('create-btn');
    if (createBtn) createBtn.addEventListener('click', () => openEntityModal());

    const runQueryBtn = document.getElementById('run-query-btn');
    if (runQueryBtn) runQueryBtn.addEventListener('click', runRawQuery);

    // Schema Nav Delegation
    document.getElementById('schema-nav').addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('[data-action="toggle-submenu"]');
        if (toggleBtn) {
            const category = toggleBtn.closest('.menu-category');
            // Close others (accordion style) optionally:
            // document.querySelectorAll('.menu-category').forEach(c => c !== category && c.classList.remove('open'));
            category.classList.toggle('open');
            return;
        }

        const btn = e.target.closest('.schema-btn');
        if (btn) {
            if (btn.dataset.action === 'dashboard') {
                selectDashboard(btn);
            } else if (btn.dataset.action === 'query') {
                selectQueryRunner(btn);
            } else if (btn.dataset.model) {
                selectSchema(btn.dataset.model, btn);
            }
        }
    });

    // Data Table Delegation (Edit/Delete)
    document.getElementById('data-body').addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-action-btn');
        if (editBtn) openEntityModal(editBtn.dataset.id);
        
        const deleteBtn = e.target.closest('.delete-action-btn');
        if (deleteBtn) deleteEntity(deleteBtn.dataset.id);
    });
});

const logout = () => {
    localStorage.removeItem('admin_token');
    currentToken = null;
    window.location.href = '/login';
};
const getHeaders = () => ({
    'Authorization': `Bearer ${currentToken}`,
    'Content-Type': 'application/json'
});

// Generic Fetch Wrapper
const fetchAPI = async (endpoint, options = {}) => {
    const res = await fetch(`/api/admin${endpoint}`, {
        ...options,
        headers: getHeaders()
    });
    
    if (res.status === 401 || res.status === 403) {
        logout();
        throw new Error('Session expired or unauthorized');
    }
    
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'API request failed');
    }
    
    if (res.status === 204) return null;
    return res.json();
};

// Removed fetchModels: Sidebar is now a bespoke hardcoded application menu

const selectDashboard = (btnEl) => {
    currentSchema = null;
    document.querySelectorAll('.schema-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    document.getElementById('current-schema-title').textContent = 'System Dashboard';
    document.getElementById('create-btn').style.display = 'none';
    
    document.getElementById('grid-container').style.display = 'none';
    document.getElementById('query-container').classList.remove('active');
    document.getElementById('dashboard-container').style.display = 'flex';
};

const selectQueryRunner = (btnEl) => {
    currentSchema = null;
    document.querySelectorAll('.schema-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    document.getElementById('current-schema-title').textContent = 'Query Terminal';
    document.getElementById('create-btn').style.display = 'none';
    
    document.getElementById('dashboard-container').style.display = 'none';
    document.getElementById('grid-container').style.display = 'none';
    document.getElementById('query-container').classList.add('active');
};

const runRawQuery = async () => {
    const input = document.getElementById('query-input').value;
    const output = document.getElementById('query-output');
    const btn = document.getElementById('run-query-btn');
    
    if (!input.trim()) return;

    btn.textContent = 'Executing...';
    btn.disabled = true;
    output.style.color = 'var(--clr-text)';
    output.textContent = 'Running query...';

    try {
        const response = await fetch('/api/admin/query', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ query: input })
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Execution failed');
        
        output.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        output.style.color = '#ef4444';
        output.textContent = `Error: ${err.message}`;
    } finally {
        btn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Execute';
        btn.disabled = false;
    }
};

const selectSchema = async (modelName, btnEl) => {
    // Show table, hide others
    document.getElementById('dashboard-container').style.display = 'none';
    document.getElementById('grid-container').style.display = 'block';
    document.getElementById('query-container').classList.remove('active');
    document.getElementById('create-btn').style.display = 'flex';

    currentSchema = modelName;
    document.querySelectorAll('.schema-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    
    let label = modelName.replace(/([A-Z])/g, ' $1').trim();
    if (!label.endsWith('s') && !['Stock', 'Inventory'].includes(label)) {
        if (label.endsWith('y')) label = label.slice(0, -1) + 'ies';
        else label += 's';
    }
    document.getElementById('current-schema-title').textContent = label;
    document.getElementById('create-btn').disabled = false;
    
    try {
        const res = await fetchAPI(`/schema/${currentSchema}`);
        currentSchemaDef = res.fields || [];
        currentSchemaEnums = res.enums || [];
    } catch(err) {
        console.error("Failed to load schema def", err);
        currentSchemaDef = null;
        currentSchemaEnums = [];
    }

    await loadData();
};

const showSkeletons = () => {
    const tbody = document.getElementById('data-body');
    tbody.innerHTML = Array(5).fill('<tr class="skeleton-row"><td><div style="height:20px;width:100%;border-radius:4px" class="skeleton"></div></td><td><div style="height:20px;width:100%;border-radius:4px" class="skeleton"></div></td></tr>').join('');
};

const loadData = async () => {
    showSkeletons();
    try {
        const response = await fetchAPI(`/${currentSchema}?limit=50`);
        schemaData = response.data;
        renderTable();
    } catch (err) {
        document.getElementById('data-body').innerHTML = `<tr><td colspan="100%" style="color:#ef4444;text-align:center;">Failed to load data: ${err.message}</td></tr>`;
    }
};

const renderTable = () => {
    const thead = document.getElementById('data-head');
    const tbody = document.getElementById('data-body');
    
    if (!schemaData.length) {
        thead.innerHTML = '<tr><th>No Data Found</th></tr>';
        tbody.innerHTML = '<tr><td style="text-align:center;color:var(--clr-text-muted);">The schema is currently empty.</td></tr>';
        return;
    }

    // Attempt to hide complex objects and keep primitives
    const sample = schemaData[0];
    const columns = Object.keys(sample).filter(k => typeof sample[k] !== 'object' || sample[k] === null);
    
    // Header
    thead.innerHTML = '<tr>' + columns.map(col => `<th>${col}</th>`).join('') + '<th style="text-align:right">Actions</th></tr>';
    
    // Body
    tbody.innerHTML = schemaData.map(row => {
        const tds = columns.map(col => {
            let val = row[col];
            if (val === null || val === undefined) val = '<span style="color:var(--clr-text-muted);font-style:italic">null</span>';
            // Truncate long strings
            if (typeof val === 'string' && val.length > 50) val = val.substring(0, 50) + '...';
            return `<td>${val}</td>`;
        }).join('');
        
        return `<tr>
            ${tds}
            <td class="action-cell">
                <button class="action-btn edit-action-btn" data-id="${row.id}" title="Edit">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="action-btn danger delete-action-btn" data-id="${row.id}" title="Delete">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        </tr>`;
    }).join('');
};

const deleteEntity = async (id) => {
    if (!confirm(`Are you sure you want to permanently delete this ${currentSchema}?`)) return;
    try {
        await fetchAPI(`/${currentSchema}/${id}`, { method: 'DELETE' });
        loadData();
    } catch (err) {
        alert('Failed to delete: ' + err.message);
    }
};

// Modal Logic
const openEntityModal = (id = null) => {
    editingId = id;
    const modal = document.getElementById('entity-modal');
    const title = document.getElementById('modal-title');
    const formContainer = document.getElementById('dynamic-inputs');
    
    formContainer.innerHTML = '';
    title.textContent = id ? `Update ${currentSchema}` : `Create ${currentSchema}`;
    
    let targetObj = {};
    if (id) {
        targetObj = schemaData.find(d => d.id === id) || {};
    }

    if (!currentSchemaDef) {
        formContainer.innerHTML = '<p style="color:#ef4444">Cannot load schema definition from the server.</p>';
        modal.classList.add('active');
        return;
    }

    // Build form inputs directly from Prisma DMMF definition!
    currentSchemaDef.forEach(field => {
        // Skip relational tables/objects
        if (field.kind === 'object') return;
        
        const key = field.name;
        const isReadonly = (key === 'id' || field.isUpdatedAt || key.toLowerCase().includes('createdat'));
        
        // Hide auto-managed fields on creation entirely
        if (!id && isReadonly) return;
        
        let val = targetObj[key] !== undefined ? targetObj[key] : '';
        if (val === null) val = '';

        // Check if type is an Enum
        const enumMatch = currentSchemaEnums.find(e => e.name === field.type);

        let inputType = 'text';
        if (field.type === 'Int' || field.type === 'Float' || field.type === 'Decimal') inputType = 'number';

        let inputHtml = '';
        if (enumMatch) {
            const options = enumMatch.values.map(v => `<option value="${v.name}" ${val === v.name ? 'selected' : ''}>${v.name}</option>`).join('');
            inputHtml = `
                <select name="${key}" class="form-input" ${isReadonly ? 'readonly disabled style="opacity:0.5"' : ''}>
                    ${!field.isRequired ? '<option value="">-- None --</option>' : ''}
                    ${options}
                </select>
            `;
        } else if (field.type === 'Boolean') {
            inputHtml = `
                <select name="${key}" class="form-input" ${isReadonly ? 'readonly disabled style="opacity:0.5"' : ''}>
                    <option value="true" ${val === true ? 'selected' : ''}>True</option>
                    <option value="false" ${val === false || val === '' ? 'selected' : ''}>False</option>
                </select>
            `;
        } else if (field.type === 'DateTime') {
             // Convert ISO date to datetime-local format
             let dateVal = val ? new Date(val).toISOString().slice(0, 16) : '';
             inputHtml = `<input type="datetime-local" name="${key}" class="form-input" value="${dateVal}" ${isReadonly ? 'readonly style="opacity:0.5"' : ''}>`;
        } else {
             inputHtml = `<input type="${inputType}" name="${key}" class="form-input" value="${val}" ${isReadonly ? 'readonly style="opacity:0.5"' : ''}>`;
        }

        formContainer.innerHTML += `
            <div class="form-group">
                <label class="form-label">${key} ${field.isRequired && !isReadonly ? '<span style="color:#ef4444">*</span>' : ''}</label>
                ${inputHtml}
            </div>
        `;
    });

    modal.classList.add('active');
};

const closeEntityModal = () => {
    document.getElementById('entity-modal').classList.remove('active');
};

document.getElementById('entity-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-btn');
    btn.textContent = 'Saving...';
    btn.disabled = true;

    try {
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());
        
        // Accurate Type casting based on Prisma Schema Definition
        if (currentSchemaDef) {
            currentSchemaDef.forEach(f => {
                if (payload[f.name] !== undefined) {
                    if (payload[f.name] === '') {
                        payload[f.name] = null; // Backend prisma handles null vs undefined
                    } else if (f.type === 'Int' || f.type === 'Float' || f.type === 'Decimal') {
                        payload[f.name] = Number(payload[f.name]);
                    } else if (f.type === 'Boolean') {
                        payload[f.name] = payload[f.name] === 'true';
                    } else if (f.type === 'DateTime' && payload[f.name]) {
                        payload[f.name] = new Date(payload[f.name]).toISOString();
                    }
                }
            });
        }

        // Drop readonly keys from updates
        delete payload.id;
        delete payload.createdAt;
        delete payload.updatedAt;

        if (editingId) {
            await fetchAPI(`/${currentSchema}/${editingId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            await fetchAPI(`/${currentSchema}`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        
        closeEntityModal();
        loadData();
    } catch (err) {
        alert('Failed to save entity: ' + err.message);
    } finally {
        btn.textContent = 'Save Object';
        btn.disabled = false;
    }
});
