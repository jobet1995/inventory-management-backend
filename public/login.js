document.addEventListener('DOMContentLoaded', () => {
    // If the user is already logged in, redirect them to admin
    const token = localStorage.getItem('admin_token');
    if (token) {
        window.location.href = '/admin';
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');
    
    errorEl.style.display = 'none';
    btn.innerHTML = '<span class="status-dot"></span> Authenticating...';
    btn.disabled = true;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Login failed');
        
        // We must check if the user has appropriate permissions
        // Assuming SUPER_ADMIN is the required role for the admin panel
        if (data.data.user.role !== 'SUPER_ADMIN') {
            throw new Error('Access Denied: Requires System Admin privileges');
        }

        // Store the JWT token for the session
        localStorage.setItem('admin_token', data.data.token);
        
        // Successful login, redirect to the admin panel
        btn.innerHTML = 'Redirecting...';
        setTimeout(() => {
            window.location.href = '/admin';
        }, 500);
        
    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
        btn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg> Authenticate';
        btn.disabled = false;
    }
});
