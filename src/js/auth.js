// SmartReads Authentication System

class AuthSystem {
    constructor() {
        this.currentTab = 'signin';
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordToggles();
        this.setupPasswordStrength();
        this.loadDemoCredentials();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Form submissions
        document.getElementById('signinForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignIn(e.target);
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignUp(e.target);
        });

        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const provider = e.currentTarget.classList.contains('google') ? 'Google' : 'Microsoft';
                this.handleSocialLogin(provider);
            });
        });

        // Demo credentials click
        document.querySelectorAll('.demo-item').forEach(item => {
            item.addEventListener('click', () => {
                this.fillDemoCredentials(item);
            });
        });
    }

    setupPasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const input = e.target.closest('.input-wrapper').querySelector('input');
                const icon = e.target.closest('.password-toggle').querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    setupPasswordStrength() {
        const passwordInput = document.querySelector('#signup input[placeholder="Password"]');
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        if (passwordInput && strengthBar && strengthText) {
            passwordInput.addEventListener('input', (e) => {
                const password = e.target.value;
                const strength = this.calculatePasswordStrength(password);
                
                strengthBar.style.width = `${strength.percentage}%`;
                strengthBar.style.background = strength.color;
                strengthText.textContent = strength.text;
                strengthText.style.color = strength.color;
            });
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score += 25;
        else feedback.push('at least 8 characters');

        if (/[a-z]/.test(password)) score += 25;
        else feedback.push('lowercase letter');

        if (/[A-Z]/.test(password)) score += 25;
        else feedback.push('uppercase letter');

        if (/[0-9]/.test(password)) score += 25;
        else feedback.push('number');

        if (/[^A-Za-z0-9]/.test(password)) score += 10;

        let strength = {
            percentage: Math.min(score, 100),
            color: '#ef4444',
            text: 'Weak password'
        };

        if (score >= 80) {
            strength.color = '#10b981';
            strength.text = 'Strong password';
        } else if (score >= 60) {
            strength.color = '#f59e0b';
            strength.text = 'Good password';
        } else if (score >= 40) {
            strength.color = '#f97316';
            strength.text = 'Fair password';
        }

        if (feedback.length > 0 && score < 80) {
            strength.text = `Add: ${feedback.slice(0, 2).join(', ')}`;
        }

        return strength;
    }

    switchTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(tab).classList.add('active');

        this.currentTab = tab;
    }

    handleSignIn(form) {
        this.showLoading();

        const formData = new FormData(form);
        const email = formData.get('email') || form.querySelector('input[type="email"]').value;
        const password = formData.get('password') || form.querySelector('input[type="password"]').value;
        const role = formData.get('role') || form.querySelector('input[name="role"]:checked').value;

        // Simulate API call delay
        setTimeout(() => {
            this.hideLoading();

            // Check demo credentials
            if (this.validateDemoCredentials(email, password, role)) {
                this.showToast('Sign in successful! Redirecting...', 'success');
                setTimeout(() => {
                    this.redirectToApp(role);
                }, 1500);
            } else {
                // Check registered users
                const user = this.users.find(u => u.email === email && u.password === password && u.role === role);
                if (user) {
                    this.showToast('Sign in successful! Redirecting...', 'success');
                    setTimeout(() => {
                        this.redirectToApp(role);
                    }, 1500);
                } else {
                    this.showToast('Invalid credentials. Please try again.', 'error');
                    this.shakeForm(form);
                }
            }
        }, 1500);
    }

    handleSignUp(form) {
        this.showLoading();

        const formData = new FormData(form);
        const firstName = formData.get('firstName') || form.querySelector('input[placeholder="First Name"]').value;
        const lastName = formData.get('lastName') || form.querySelector('input[placeholder="Last Name"]').value;
        const email = formData.get('email') || form.querySelector('input[type="email"]').value;
        const password = formData.get('password') || form.querySelector('input[placeholder="Password"]').value;
        const confirmPassword = formData.get('confirmPassword') || form.querySelector('input[placeholder="Confirm Password"]').value;
        const role = formData.get('role') || form.querySelector('input[name="role"]:checked').value;
        const termsAccepted = form.querySelector('input[type="checkbox"]').checked;

        // Validate form
        const validation = this.validateSignUpForm({
            firstName, lastName, email, password, confirmPassword, role, termsAccepted
        });

        setTimeout(() => {
            this.hideLoading();

            if (!validation.isValid) {
                this.showToast(validation.message, 'error');
                this.shakeForm(form);
                return;
            }

            // Check if user already exists
            if (this.users.find(u => u.email === email)) {
                this.showToast('An account with this email already exists.', 'error');
                this.shakeForm(form);
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                firstName,
                lastName,
                email,
                password,
                role,
                createdAt: new Date().toISOString()
            };

            this.users.push(newUser);
            this.saveUsers();

            this.showToast('Account created successfully! You can now sign in.', 'success');
            
            // Switch to sign in tab and pre-fill email
            setTimeout(() => {
                this.switchTab('signin');
                document.querySelector('#signin input[type="email"]').value = email;
                document.querySelector(`#signin input[value="${role}"]`).checked = true;
            }, 1500);
        }, 1500);
    }

    validateSignUpForm(data) {
        if (!data.firstName.trim()) {
            return { isValid: false, message: 'First name is required.' };
        }

        if (!data.lastName.trim()) {
            return { isValid: false, message: 'Last name is required.' };
        }

        if (!this.isValidEmail(data.email)) {
            return { isValid: false, message: 'Please enter a valid email address.' };
        }

        if (data.password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long.' };
        }

        if (data.password !== data.confirmPassword) {
            return { isValid: false, message: 'Passwords do not match.' };
        }

        if (!data.termsAccepted) {
            return { isValid: false, message: 'Please accept the terms of service.' };
        }

        return { isValid: true };
    }

    validateDemoCredentials(email, password, role) {
        const demoCredentials = {
            admin: { email: 'admin@smartreads.com', password: 'admin123' },
            user: { email: 'user@smartreads.com', password: 'user123' }
        };

        return demoCredentials[role] && 
               demoCredentials[role].email === email && 
               demoCredentials[role].password === password;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleSocialLogin(provider) {
        this.showLoading();
        
        setTimeout(() => {
            this.hideLoading();
            this.showToast(`${provider} login is not implemented in this demo.`, 'info');
        }, 1000);
    }

    fillDemoCredentials(demoItem) {
        const text = demoItem.textContent;
        const isAdmin = text.includes('Admin');
        const email = isAdmin ? 'admin@smartreads.com' : 'user@smartreads.com';
        const password = isAdmin ? 'admin123' : 'user123';
        const role = isAdmin ? 'admin' : 'user';

        // Switch to sign in tab if not already there
        if (this.currentTab !== 'signin') {
            this.switchTab('signin');
        }

        // Fill form
        setTimeout(() => {
            document.querySelector('#signin input[type="email"]').value = email;
            document.querySelector('#signin input[type="password"]').value = password;
            document.querySelector(`#signin input[value="${role}"]`).checked = true;
            
            this.showToast('Demo credentials filled! Click Sign In to continue.', 'info');
        }, 100);
    }

    loadDemoCredentials() {
        // This method can be used to load demo credentials from an external source
        // For now, they're hardcoded in the HTML
    }

    redirectToApp(role) {
        // Store user session
        localStorage.setItem('smartreads_user', JSON.stringify({
            role: role,
            loginTime: new Date().toISOString()
        }));

        // Redirect to main application
        window.location.href = 'index.html';
    }

    loadUsers() {
        const stored = localStorage.getItem('smartreads_users');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('smartreads_users', JSON.stringify(this.users));
    }

    shakeForm(form) {
        form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;

        const container = document.getElementById('toastContainer');
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    showLoading() {
        document.getElementById('loadingSpinner').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.remove('active');
    }
}

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the authentication system
const authSystem = new AuthSystem();

// Check if user is already logged in
const currentUser = localStorage.getItem('smartreads_user');
if (currentUser && window.location.pathname.includes('auth.html')) {
    const user = JSON.parse(currentUser);
    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
    
    // Auto-redirect if logged in within last 24 hours
    if (hoursSinceLogin < 24) {
        window.location.href = 'index.html';
    }
}