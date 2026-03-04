document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    fetchHealthData();
});

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatDays = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    return `${d} Day${d !== 1 ? 's' : ''}`;
};

const updateElement = (id, value, isSkeleton = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value;
    if (!isSkeleton) {
        el.classList.remove('skeleton');
    } else {
        el.classList.add('skeleton');
    }
};

const updateStatusBadge = (id, status) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = status;
    el.classList.remove('skeleton', 'status-up', 'status-down');
    if (status === 'UP' || status === 'CONNECTED') {
        el.classList.add('status-up');
    } else {
        el.classList.add('status-down');
    }
};

const setSkeletons = () => {
    const elements = [
        'status-api', 'uptime-api', 'status-db', 'latency-db', 
        'memory-used', 'memory-total', 'node-version', 'uptime-os'
    ];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('skeleton');
    });
    const osPlatform = document.getElementById('os-platform');
    if (osPlatform) osPlatform.textContent = 'Loading Platform Info...';
};

window.fetchHealthData = async () => {
    const icon = document.getElementById('refresh-icon');
    if (icon) icon.classList.add('spinning');
    setSkeletons();

    try {
        const response = await fetch('/api/health');
        
        // If the response is not ok, the API is down
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        // API Status
        updateStatusBadge('status-api', data.status);
        updateElement('uptime-api', formatTime(data.uptime.system));

        // Database Status
        updateStatusBadge('status-db', data.database.status);
        if (data.database.latencyMs) {
            updateElement('latency-db', `${data.database.latencyMs} ms`);
        } else {
            updateElement('latency-db', '-- ms');
        }

        // Memory
        updateElement('memory-used', data.process.memoryUsage.rss);
        updateElement('memory-total', data.system.totalMemory);

        // System
        updateElement('node-version', `Node ${data.process.nodeVersion}`);
        updateElement('uptime-os', formatDays(data.uptime.os));
        
        const osSub = document.getElementById('os-platform');
        if (osSub) osSub.textContent = `${data.system.platform} ${data.system.release} — ${data.system.cpuCores} Cores`;

        // Timestamp
        const date = new Date(data.timestamp);
        const lastUpdated = document.getElementById('last-updated');
        if (lastUpdated) lastUpdated.innerHTML = `Last polled: <span style="color: var(--clr-primary)">${date.toLocaleTimeString()}</span>`;

    } catch (error) {
        console.error('Failed to fetch health data:', error);
        
        // Mark API as Down
        updateStatusBadge('status-api', 'DOWN');
        updateElement('uptime-api', 'ERROR');
        
        // DB Unknown
        updateStatusBadge('status-db', 'UNKNOWN');
        updateElement('latency-db', '--');

        // Timestamp
        const lastUpdated = document.getElementById('last-updated');
        if (lastUpdated) lastUpdated.innerHTML = `Last polled: <span style="color: #ef4444">Connection Failed</span>`;
    } finally {
        if (icon) setTimeout(() => icon.classList.remove('spinning'), 500);
    }
};
