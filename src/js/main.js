// SmartReads - Library Management System Frontend

class SmartReadsSystem {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentUser = null;
        this.data = {
            books: [],
            authors: [],
            categories: [],
            publishers: []
        };
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.loadSampleData();
        this.updateDashboard();
        this.showSection('dashboard');
        this.updateUserInfo();
    }

    checkAuthentication() {
        const user = localStorage.getItem('smartreads_user');
        if (!user) {
            window.location.href = 'auth.html';
            return;
        }

        this.currentUser = JSON.parse(user);
        
        // Check if session is still valid (24 hours)
        const loginTime = new Date(this.currentUser.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
            localStorage.removeItem('smartreads_user');
            window.location.href = 'auth.html';
            return;
        }
    }

    updateUserInfo() {
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        
        if (this.currentUser) {
            userName.textContent = this.currentUser.role === 'admin' ? 'Admin User' : 'Library User';
            userRole.textContent = this.currentUser.role === 'admin' ? 'Administrator' : 'User';
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Mobile navigation toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Modal controls
        const modal = document.getElementById('modal');
        const modalClose = document.getElementById('modalClose');
        modalClose.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        // Add buttons
        document.getElementById('quickAddBtn').addEventListener('click', () => this.showAddBookForm());
        document.getElementById('addBookBtn').addEventListener('click', () => this.showAddBookForm());
        document.getElementById('addAuthorBtn').addEventListener('click', () => this.showAddAuthorForm());
        document.getElementById('addCategoryBtn').addEventListener('click', () => this.showAddCategoryForm());
        document.getElementById('addPublisherBtn').addEventListener('click', () => this.showAddPublisherForm());

        // Search functionality
        document.getElementById('bookSearch').addEventListener('input', (e) => {
            this.searchBooks(e.target.value);
        });
        document.getElementById('authorSearch').addEventListener('input', (e) => {
            this.searchAuthors(e.target.value);
        });
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('smartreads_user');
            this.showToast('Logged out successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 1000);
        }
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;

        // Load section-specific data
        switch (sectionName) {
            case 'books':
                this.renderBooks();
                break;
            case 'authors':
                this.renderAuthors();
                break;
            case 'categories':
                this.renderCategories();
                break;
            case 'publishers':
                this.renderPublishers();
                break;
        }
    }

    loadSampleData() {
        // Enhanced sample data for SmartReads
        this.data = {
            books: [
                {
                    id: 1,
                    isbn: 'SR001',
                    name: 'The Art of Clean Code',
                    serialName: 'ACC2024',
                    description: 'A comprehensive guide to writing maintainable and elegant code',
                    authors: [{ id: 1, name: 'Robert C. Martin' }],
                    categories: [{ id: 1, name: 'Programming' }],
                    publishers: [{ id: 1, name: 'Prentice Hall' }]
                },
                {
                    id: 2,
                    isbn: 'SR002',
                    name: 'Machine Learning Fundamentals',
                    serialName: 'MLF2024',
                    description: 'Introduction to machine learning concepts and algorithms',
                    authors: [{ id: 2, name: 'Andrew Ng' }],
                    categories: [{ id: 2, name: 'Data Science' }],
                    publishers: [{ id: 2, name: 'MIT Press' }]
                },
                {
                    id: 3,
                    isbn: 'SR003',
                    name: 'Digital Transformation',
                    serialName: 'DT2024',
                    description: 'How technology is reshaping business and society',
                    authors: [{ id: 3, name: 'Satya Nadella' }],
                    categories: [{ id: 3, name: 'Business' }],
                    publishers: [{ id: 3, name: 'Harvard Business Review Press' }]
                },
                {
                    id: 4,
                    isbn: 'SR004',
                    name: 'Quantum Computing Explained',
                    serialName: 'QCE2024',
                    description: 'Understanding the future of computing technology',
                    authors: [{ id: 4, name: 'John Preskill' }],
                    categories: [{ id: 4, name: 'Technology' }],
                    publishers: [{ id: 4, name: 'Academic Press' }]
                }
            ],
            authors: [
                { id: 1, name: 'Robert C. Martin', description: 'Software craftsman and clean code advocate', booksCount: 1 },
                { id: 2, name: 'Andrew Ng', description: 'AI researcher and educator', booksCount: 1 },
                { id: 3, name: 'Satya Nadella', description: 'CEO of Microsoft and technology leader', booksCount: 1 },
                { id: 4, name: 'John Preskill', description: 'Quantum physicist and researcher', booksCount: 1 }
            ],
            categories: [
                { id: 1, name: 'Programming', booksCount: 1 },
                { id: 2, name: 'Data Science', booksCount: 1 },
                { id: 3, name: 'Business', booksCount: 1 },
                { id: 4, name: 'Technology', booksCount: 1 }
            ],
            publishers: [
                { id: 1, name: 'Prentice Hall', booksCount: 1 },
                { id: 2, name: 'MIT Press', booksCount: 1 },
                { id: 3, name: 'Harvard Business Review Press', booksCount: 1 },
                { id: 4, name: 'Academic Press', booksCount: 1 }
            ]
        };
    }

    updateDashboard() {
        document.getElementById('totalBooks').textContent = this.data.books.length;
        document.getElementById('totalAuthors').textContent = this.data.authors.length;
        document.getElementById('totalCategories').textContent = this.data.categories.length;
        document.getElementById('totalPublishers').textContent = this.data.publishers.length;

        this.renderRecentActivity();
    }

    renderRecentActivity() {
        const activityList = document.getElementById('activityList');
        const activities = [
            { icon: 'fas fa-plus', title: 'New book added', description: 'Quantum Computing Explained was added to the library', time: '1 hour ago' },
            { icon: 'fas fa-edit', title: 'Author updated', description: 'John Preskill\'s information was updated', time: '3 hours ago' },
            { icon: 'fas fa-book', title: 'Book borrowed', description: 'The Art of Clean Code was borrowed', time: '5 hours ago' },
            { icon: 'fas fa-user-plus', title: 'New user registered', description: 'A new user joined SmartReads', time: '1 day ago' }
        ];

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description} • ${activity.time}</p>
                </div>
            </div>
        `).join('');
    }

    renderBooks() {
        const tbody = document.getElementById('booksTableBody');
        tbody.innerHTML = this.data.books.map(book => `
            <tr>
                <td>${book.isbn}</td>
                <td>${book.name}</td>
                <td>${book.authors.map(a => a.name).join(', ')}</td>
                <td>${book.categories.map(c => c.name).join(', ')}</td>
                <td>${book.publishers.map(p => p.name).join(', ')}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" onclick="smartReads.viewBook(${book.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="smartReads.editBook(${book.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="smartReads.deleteBook(${book.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderAuthors() {
        const tbody = document.getElementById('authorsTableBody');
        tbody.innerHTML = this.data.authors.map(author => `
            <tr>
                <td>${author.name}</td>
                <td>${author.description}</td>
                <td>${author.booksCount}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" onclick="smartReads.editAuthor(${author.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="smartReads.deleteAuthor(${author.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = this.data.categories.map(category => `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">${category.name}</h3>
                    <div class="card-actions">
                        <button class="action-btn edit-btn" onclick="smartReads.editCategory(${category.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="smartReads.deleteCategory(${category.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <p><strong>Books:</strong> ${category.booksCount}</p>
                    <p class="text-secondary">Category for organizing books by topic</p>
                </div>
            </div>
        `).join('');
    }

    renderPublishers() {
        const grid = document.getElementById('publishersGrid');
        grid.innerHTML = this.data.publishers.map(publisher => `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">${publisher.name}</h3>
                    <div class="card-actions">
                        <button class="action-btn edit-btn" onclick="smartReads.editPublisher(${publisher.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="smartReads.deletePublisher(${publisher.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <p><strong>Books Published:</strong> ${publisher.booksCount}</p>
                    <p class="text-secondary">Publishing house for books in our library</p>
                </div>
            </div>
        `).join('');
    }

    // Modal functions
    showModal(title, content) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('modal').classList.add('active');
    }

    closeModal() {
        document.getElementById('modal').classList.remove('active');
    }

    // Form functions
    showAddBookForm() {
        const form = `
            <form id="bookForm">
                <div class="form-group">
                    <label class="form-label">ISBN</label>
                    <input type="text" class="form-input" name="isbn" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Book Name</label>
                    <input type="text" class="form-input" name="name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Serial Name</label>
                    <input type="text" class="form-input" name="serialName" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" name="description" required></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Author</label>
                    <select class="form-select" name="authorId" required>
                        <option value="">Select Author</option>
                        ${this.data.authors.map(author => `<option value="${author.id}">${author.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-select" name="categoryId" required>
                        <option value="">Select Category</option>
                        ${this.data.categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Publisher</label>
                    <select class="form-select" name="publisherId" required>
                        <option value="">Select Publisher</option>
                        ${this.data.publishers.map(publisher => `<option value="${publisher.id}">${publisher.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="smartReads.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Book</button>
                </div>
            </form>
        `;

        this.showModal('Add New Book', form);

        document.getElementById('bookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBook(new FormData(e.target));
        });
    }

    showAddAuthorForm() {
        const form = `
            <form id="authorForm">
                <div class="form-group">
                    <label class="form-label">Author Name</label>
                    <input type="text" class="form-input" name="name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" name="description" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="smartReads.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Author</button>
                </div>
            </form>
        `;

        this.showModal('Add New Author', form);

        document.getElementById('authorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAuthor(new FormData(e.target));
        });
    }

    showAddCategoryForm() {
        const form = `
            <form id="categoryForm">
                <div class="form-group">
                    <label class="form-label">Category Name</label>
                    <input type="text" class="form-input" name="name" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="smartReads.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Category</button>
                </div>
            </form>
        `;

        this.showModal('Add New Category', form);

        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory(new FormData(e.target));
        });
    }

    showAddPublisherForm() {
        const form = `
            <form id="publisherForm">
                <div class="form-group">
                    <label class="form-label">Publisher Name</label>
                    <input type="text" class="form-input" name="name" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="smartReads.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Publisher</button>
                </div>
            </form>
        `;

        this.showModal('Add New Publisher', form);

        document.getElementById('publisherForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPublisher(new FormData(e.target));
        });
    }

    // CRUD operations
    addBook(formData) {
        const authorId = parseInt(formData.get('authorId'));
        const categoryId = parseInt(formData.get('categoryId'));
        const publisherId = parseInt(formData.get('publisherId'));

        const author = this.data.authors.find(a => a.id === authorId);
        const category = this.data.categories.find(c => c.id === categoryId);
        const publisher = this.data.publishers.find(p => p.id === publisherId);

        const newBook = {
            id: Date.now(),
            isbn: formData.get('isbn'),
            name: formData.get('name'),
            serialName: formData.get('serialName'),
            description: formData.get('description'),
            authors: [author],
            categories: [category],
            publishers: [publisher]
        };

        this.data.books.push(newBook);
        
        // Update counts
        author.booksCount++;
        category.booksCount++;
        publisher.booksCount++;

        this.closeModal();
        this.renderBooks();
        this.updateDashboard();
        this.showToast('Book added successfully!', 'success');
    }

    addAuthor(formData) {
        const newAuthor = {
            id: Date.now(),
            name: formData.get('name'),
            description: formData.get('description'),
            booksCount: 0
        };

        this.data.authors.push(newAuthor);
        this.closeModal();
        this.renderAuthors();
        this.updateDashboard();
        this.showToast('Author added successfully!', 'success');
    }

    addCategory(formData) {
        const newCategory = {
            id: Date.now(),
            name: formData.get('name'),
            booksCount: 0
        };

        this.data.categories.push(newCategory);
        this.closeModal();
        this.renderCategories();
        this.updateDashboard();
        this.showToast('Category added successfully!', 'success');
    }

    addPublisher(formData) {
        const newPublisher = {
            id: Date.now(),
            name: formData.get('name'),
            booksCount: 0
        };

        this.data.publishers.push(newPublisher);
        this.closeModal();
        this.renderPublishers();
        this.updateDashboard();
        this.showToast('Publisher added successfully!', 'success');
    }

    // View, Edit, Delete functions
    viewBook(id) {
        const book = this.data.books.find(b => b.id === id);
        if (!book) return;

        const content = `
            <div class="book-details">
                <div class="form-group">
                    <label class="form-label">ISBN</label>
                    <p>${book.isbn}</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <p>${book.name}</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Serial Name</label>
                    <p>${book.serialName}</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <p>${book.description}</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Author(s)</label>
                    <p>${book.authors.map(a => a.name).join(', ')}</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <p>${book.categories.map(c => c.name).join(', ')}</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Publisher</label>
                    <p>${book.publishers.map(p => p.name).join(', ')}</p>
                </div>
            </div>
        `;

        this.showModal('Book Details', content);
    }

    editBook(id) {
        const book = this.data.books.find(b => b.id === id);
        if (!book) return;

        const form = `
            <form id="editBookForm">
                <input type="hidden" name="id" value="${book.id}">
                <div class="form-group">
                    <label class="form-label">ISBN</label>
                    <input type="text" class="form-input" name="isbn" value="${book.isbn}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Book Name</label>
                    <input type="text" class="form-input" name="name" value="${book.name}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Serial Name</label>
                    <input type="text" class="form-input" name="serialName" value="${book.serialName}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" name="description" required>${book.description}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="smartReads.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Book</button>
                </div>
            </form>
        `;

        this.showModal('Edit Book', form);

        document.getElementById('editBookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateBook(new FormData(e.target));
        });
    }

    updateBook(formData) {
        const id = parseInt(formData.get('id'));
        const bookIndex = this.data.books.findIndex(b => b.id === id);
        
        if (bookIndex !== -1) {
            this.data.books[bookIndex] = {
                ...this.data.books[bookIndex],
                isbn: formData.get('isbn'),
                name: formData.get('name'),
                serialName: formData.get('serialName'),
                description: formData.get('description')
            };

            this.closeModal();
            this.renderBooks();
            this.showToast('Book updated successfully!', 'success');
        }
    }

    deleteBook(id) {
        if (confirm('Are you sure you want to delete this book?')) {
            const bookIndex = this.data.books.findIndex(b => b.id === id);
            if (bookIndex !== -1) {
                const book = this.data.books[bookIndex];
                
                // Update counts
                book.authors.forEach(author => {
                    const authorObj = this.data.authors.find(a => a.id === author.id);
                    if (authorObj) authorObj.booksCount--;
                });
                book.categories.forEach(category => {
                    const categoryObj = this.data.categories.find(c => c.id === category.id);
                    if (categoryObj) categoryObj.booksCount--;
                });
                book.publishers.forEach(publisher => {
                    const publisherObj = this.data.publishers.find(p => p.id === publisher.id);
                    if (publisherObj) publisherObj.booksCount--;
                });

                this.data.books.splice(bookIndex, 1);
                this.renderBooks();
                this.updateDashboard();
                this.showToast('Book deleted successfully!', 'success');
            }
        }
    }

    editAuthor(id) {
        const author = this.data.authors.find(a => a.id === id);
        if (!author) return;

        const form = `
            <form id="editAuthorForm">
                <input type="hidden" name="id" value="${author.id}">
                <div class="form-group">
                    <label class="form-label">Author Name</label>
                    <input type="text" class="form-input" name="name" value="${author.name}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" name="description" required>${author.description}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="smartReads.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Author</button>
                </div>
            </form>
        `;

        this.showModal('Edit Author', form);

        document.getElementById('editAuthorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateAuthor(new FormData(e.target));
        });
    }

    updateAuthor(formData) {
        const id = parseInt(formData.get('id'));
        const authorIndex = this.data.authors.findIndex(a => a.id === id);
        
        if (authorIndex !== -1) {
            this.data.authors[authorIndex] = {
                ...this.data.authors[authorIndex],
                name: formData.get('name'),
                description: formData.get('description')
            };

            this.closeModal();
            this.renderAuthors();
            this.showToast('Author updated successfully!', 'success');
        }
    }

    deleteAuthor(id) {
        if (confirm('Are you sure you want to delete this author?')) {
            const authorIndex = this.data.authors.findIndex(a => a.id === id);
            if (authorIndex !== -1) {
                this.data.authors.splice(authorIndex, 1);
                this.renderAuthors();
                this.updateDashboard();
                this.showToast('Author deleted successfully!', 'success');
            }
        }
    }

    editCategory(id) {
        const category = this.data.categories.find(c => c.id === id);
        if (!category) return;

        const form = `
            <form id="editCategoryForm">
                <input type="hidden" name="id" value="${category.id}">
                <div class="form-group">
                    <label class="form-label">Category Name</label>
                    <input type="text" class="form-input" name="name" value="${category.name}" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="smartReads.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Category</button>
                </div>
            </form>
        `;

        this.showModal('Edit Category', form);

        document.getElementById('editCategoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateCategory(new FormData(e.target));
        });
    }

    updateCategory(formData) {
        const id = parseInt(formData.get('id'));
        const categoryIndex = this.data.categories.findIndex(c => c.id === id);
        
        if (categoryIndex !== -1) {
            this.data.categories[categoryIndex] = {
                ...this.data.categories[categoryIndex],
                name: formData.get('name')
            };

            this.closeModal();
            this.renderCategories();
            this.showToast('Category updated successfully!', 'success');
        }
    }

    deleteCategory(id) {
        if (confirm('Are you sure you want to delete this category?')) {
            const categoryIndex = this.data.categories.findIndex(c => c.id === id);
            if (categoryIndex !== -1) {
                this.data.categories.splice(categoryIndex, 1);
                this.renderCategories();
                this.updateDashboard();
                this.showToast('Category deleted successfully!', 'success');
            }
        }
    }

    editPublisher(id) {
        const publisher = this.data.publishers.find(p => p.id === id);
        if (!publisher) return;

        const form = `
            <form id="editPublisherForm">
                <input type="hidden" name="id" value="${publisher.id}">
                <div class="form-group">
                    <label class="form-label">Publisher Name</label>
                    <input type="text" class="form-input" name="name" value="${publisher.name}" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="smartReads.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Publisher</button>
                </div>
            </form>
        `;

        this.showModal('Edit Publisher', form);

        document.getElementById('editPublisherForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updatePublisher(new FormData(e.target));
        });
    }

    updatePublisher(formData) {
        const id = parseInt(formData.get('id'));
        const publisherIndex = this.data.publishers.findIndex(p => p.id === id);
        
        if (publisherIndex !== -1) {
            this.data.publishers[publisherIndex] = {
                ...this.data.publishers[publisherIndex],
                name: formData.get('name')
            };

            this.closeModal();
            this.renderPublishers();
            this.showToast('Publisher updated successfully!', 'success');
        }
    }

    deletePublisher(id) {
        if (confirm('Are you sure you want to delete this publisher?')) {
            const publisherIndex = this.data.publishers.findIndex(p => p.id === id);
            if (publisherIndex !== -1) {
                this.data.publishers.splice(publisherIndex, 1);
                this.renderPublishers();
                this.updateDashboard();
                this.showToast('Publisher deleted successfully!', 'success');
            }
        }
    }

    // Search functions
    searchBooks(query) {
        const filteredBooks = this.data.books.filter(book => 
            book.name.toLowerCase().includes(query.toLowerCase()) ||
            book.isbn.toLowerCase().includes(query.toLowerCase()) ||
            book.authors.some(author => author.name.toLowerCase().includes(query.toLowerCase()))
        );

        const tbody = document.getElementById('booksTableBody');
        tbody.innerHTML = filteredBooks.map(book => `
            <tr>
                <td>${book.isbn}</td>
                <td>${book.name}</td>
                <td>${book.authors.map(a => a.name).join(', ')}</td>
                <td>${book.categories.map(c => c.name).join(', ')}</td>
                <td>${book.publishers.map(p => p.name).join(', ')}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" onclick="smartReads.viewBook(${book.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="smartReads.editBook(${book.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="smartReads.deleteBook(${book.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    searchAuthors(query) {
        const filteredAuthors = this.data.authors.filter(author => 
            author.name.toLowerCase().includes(query.toLowerCase()) ||
            author.description.toLowerCase().includes(query.toLowerCase())
        );

        const tbody = document.getElementById('authorsTableBody');
        tbody.innerHTML = filteredAuthors.map(author => `
            <tr>
                <td>${author.name}</td>
                <td>${author.description}</td>
                <td>${author.booksCount}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" onclick="smartReads.editAuthor(${author.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="smartReads.deleteAuthor(${author.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Toast notifications
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        const container = document.getElementById('toastContainer');
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Loading spinner
    showLoading() {
        document.getElementById('loadingSpinner').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.remove('active');
    }
}

// Initialize the application
const smartReads = new SmartReadsSystem();