// Library Management System - Frontend JavaScript

class LibraryManagementSystem {
    constructor() {
        this.currentSection = 'dashboard';
        this.data = {
            books: [],
            authors: [],
            categories: [],
            publishers: []
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.updateDashboard();
        this.showSection('dashboard');
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

        // Modal controls
        const modal = document.getElementById('modal');
        const modalClose = document.getElementById('modalClose');
        modalClose.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        // Add buttons
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
        // Sample data to demonstrate functionality
        this.data = {
            books: [
                {
                    id: 1,
                    isbn: 'AP1287',
                    name: 'Spring in Action',
                    serialName: 'CXEF12389',
                    description: 'Comprehensive guide to Spring Framework',
                    authors: [{ id: 1, name: 'Matt' }],
                    categories: [{ id: 1, name: 'Programming' }],
                    publishers: [{ id: 1, name: 'Manning Publications' }]
                },
                {
                    id: 2,
                    isbn: 'BP567#R',
                    name: 'Spring Microservices',
                    serialName: 'KCXEF12389',
                    description: 'Building microservices with Spring Boot',
                    authors: [{ id: 2, name: 'Maxwell' }],
                    categories: [{ id: 2, name: 'Architecture' }],
                    publishers: [{ id: 2, name: 'O\'Reilly Media' }]
                },
                {
                    id: 3,
                    isbn: 'GH67F#',
                    name: 'Spring Boot',
                    serialName: 'UV#JH',
                    description: 'Modern Spring Boot development',
                    authors: [{ id: 3, name: 'Josh Lang' }],
                    categories: [{ id: 1, name: 'Programming' }],
                    publishers: [{ id: 3, name: 'Packt Publishing' }]
                }
            ],
            authors: [
                { id: 1, name: 'Matt', description: 'Spring Framework expert', booksCount: 1 },
                { id: 2, name: 'Maxwell', description: 'Microservices architect', booksCount: 1 },
                { id: 3, name: 'Josh Lang', description: 'Spring Boot specialist', booksCount: 1 }
            ],
            categories: [
                { id: 1, name: 'Programming', booksCount: 2 },
                { id: 2, name: 'Architecture', booksCount: 1 },
                { id: 3, name: 'Web Development', booksCount: 0 }
            ],
            publishers: [
                { id: 1, name: 'Manning Publications', booksCount: 1 },
                { id: 2, name: 'O\'Reilly Media', booksCount: 1 },
                { id: 3, name: 'Packt Publishing', booksCount: 1 }
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
            { icon: 'fas fa-plus', title: 'New book added', description: 'Spring Boot was added to the library', time: '2 hours ago' },
            { icon: 'fas fa-edit', title: 'Author updated', description: 'Josh Lang\'s information was updated', time: '4 hours ago' },
            { icon: 'fas fa-trash', title: 'Category removed', description: 'Outdated category was removed', time: '1 day ago' },
            { icon: 'fas fa-book', title: 'Book borrowed', description: 'Spring in Action was borrowed', time: '2 days ago' }
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
                        <button class="action-btn view-btn" onclick="librarySystem.viewBook(${book.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="librarySystem.editBook(${book.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="librarySystem.deleteBook(${book.id})" title="Delete">
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
                        <button class="action-btn edit-btn" onclick="librarySystem.editAuthor(${author.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="librarySystem.deleteAuthor(${author.id})" title="Delete">
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
                        <button class="action-btn edit-btn" onclick="librarySystem.editCategory(${category.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="librarySystem.deleteCategory(${category.id})" title="Delete">
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
                        <button class="action-btn edit-btn" onclick="librarySystem.editPublisher(${publisher.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="librarySystem.deletePublisher(${publisher.id})" title="Delete">
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
                    <button type="button" class="btn btn-secondary" onclick="librarySystem.closeModal()">Cancel</button>
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
                    <button type="button" class="btn btn-secondary" onclick="librarySystem.closeModal()">Cancel</button>
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
                    <button type="button" class="btn btn-secondary" onclick="librarySystem.closeModal()">Cancel</button>
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
                    <button type="button" class="btn btn-secondary" onclick="librarySystem.closeModal()">Cancel</button>
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
                    <button type="button" class="btn btn-secondary" onclick="librarySystem.closeModal()">Cancel</button>
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
                    <button type="button" class="btn btn-secondary" onclick="librarySystem.closeModal()">Cancel</button>
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
                    <button type="button" class="btn btn-secondary" onclick="librarySystem.closeModal()">Cancel</button>
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
                    <button type="button" class="btn btn-secondary" onclick="librarySystem.closeModal()">Cancel</button>
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
                        <button class="action-btn view-btn" onclick="librarySystem.viewBook(${book.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="librarySystem.editBook(${book.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="librarySystem.deleteBook(${book.id})" title="Delete">
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
                        <button class="action-btn edit-btn" onclick="librarySystem.editAuthor(${author.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="librarySystem.deleteAuthor(${author.id})" title="Delete">
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
const librarySystem = new LibraryManagementSystem();