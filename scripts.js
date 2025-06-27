// ================================
// SABOR & ARTE - JAVASCRIPT
// ================================

// Variáveis globais
let currentUser = null;
let reservations = [];
let menuItems = [
    {
        id: 1,
        name: "Bruschetta Artesanal",
        price: 18.90,
        category: "entrada",
        description: "Pão italiano tostado com tomates frescos, manjericão e azeite extra virgem",
        rating: 5,
        reviews: 127
    },
    {
        id: 2,
        name: "Carpaccio de Salmão",
        price: 32.90,
        category: "entrada",
        description: "Fatias finas de salmão fresco com alcaparras, rúcula e molho cítrico",
        rating: 4.5,
        reviews: 89
    },
    {
        id: 3,
        name: "Risotto de Camarão",
        price: 45.90,
        category: "entrada",
        description: "Risotto cremoso com camarões grandes, aspargos e queijo parmesão",
        rating: 5,
        reviews: 203
    },
    {
        id: 4,
        name: "Filé Wellington",
        price: 78.90,
        category: "principal",
        description: "Filé mignon envolvido em massa folhada com cogumelos e ervas finas",
        rating: 5,
        reviews: 156
    },
    {
        id: 5,
        name: "Paella Valenciana",
        price: 65.90,
        category: "principal",
        description: "Arroz espanhol tradicional com frutos do mar, frango e açafrão",
        rating: 4.5,
        reviews: 174
    },
    {
        id: 6,
        name: "Lasanha da Casa",
        price: 42.90,
        category: "principal",
        description: "Lasanha tradicional com molho bolonhesa, bechamel e queijos especiais",
        rating: 5,
        reviews: 245
    }
];

// ================================
// INICIALIZAÇÃO
// ================================
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Configurar navbar scroll effect
    setupNavbarScrollEffect();
    
    // Configurar smooth scrolling
    setupSmoothScrolling();
    
    // Configurar scroll reveal animations
    setupScrollReveal();
    
    // Configurar formulários
    setupForms();
    
    // Configurar menu interativo
    setupInteractiveMenu();
    
    // Configurar sistema de reservas
    setupReservationSystem();
    
    console.log('Sabor & Arte - Website inicializado com sucesso!');
}

// ================================
// NAVBAR E NAVEGAÇÃO
// ================================
function setupNavbarScrollEffect() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });
}

// ================================
// ANIMAÇÕES E SCROLL REVEAL
// ================================
function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observar todos os elementos com classe 'reveal'
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
}

// ================================
// FORMULÁRIOS
// ================================
function setupForms() {
    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Formulário de reserva
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservationForm);
    }

    // Configurar validação em tempo real
    setupFormValidation();
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };

    // Simular envio (em produção, enviar para servidor)
    simulateFormSubmission(contactData, 'contato')
        .then(() => {
            showNotification('Mensagem enviada com sucesso! Retornaremos em breve.', 'success');
            e.target.reset();
        })
        .catch(() => {
            showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        });
}

function handleReservationForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reservationData = {
        id: Date.now(),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        guests: parseInt(formData.get('guests')),
        specialRequest: formData.get('specialRequest'),
        timestamp: new Date().toISOString(),
        status: 'pendente'
    };

    // Validar disponibilidade
    if (isTimeSlotAvailable(reservationData.date, reservationData.time)) {
        reservations.push(reservationData);
        showNotification('Reserva solicitada com sucesso! Confirmaremos por email.', 'success');
        e.target.reset();
        updateReservationsList();
    } else {
        showNotification('Horário não disponível. Escolha outro horário.', 'warning');
    }
}

function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Validações específicas
    switch (fieldName) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Email inválido';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\d\s\-\(\)]{10,}$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Telefone inválido';
            }
            break;
            
        case 'date':
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'Data não pode ser no passado';
            }
            break;
    }

    // Mostrar/ocultar erro
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ================================
// SISTEMA DE RESERVAS
// ================================
function setupReservationSystem() {
    loadReservations();
    updateReservationsList();
}

function loadReservations() {
    // Em produção, carregar do servidor
    // Para demo, usar dados fictícios
    if (reservations.length === 0) {
        reservations = [
            {
                id: 1,
                name: "João Silva",
                email: "joao@email.com",
                phone: "(11) 99999-9999",
                date: "2025-06-28",
                time: "19:30",
                guests: 4,
                status: "confirmada"
            },
            {
                id: 2,
                name: "Maria Santos",
                email: "maria@email.com",
                phone: "(11) 88888-8888",
                date: "2025-06-29",
                time: "20:00",
                guests: 2,
                status: "pendente"
            }
        ];
    }
}

function isTimeSlotAvailable(date, time) {
    // Verificar se já existe reserva para o mesmo horário
    const existingReservation = reservations.find(r => 
        r.date === date && r.time === time && r.status !== 'cancelada'
    );
    
    return !existingReservation;
}

function updateReservationsList() {
    const reservationsList = document.getElementById('reservationsList');
    if (!reservationsList) return;

    if (reservations.length === 0) {
        reservationsList.innerHTML = '<p class="text-muted text-center">Nenhuma reserva encontrada.</p>';
        return;
    }

    const html = reservations.map(reservation => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h5 class="card-title mb-1">${reservation.name}</h5>
                        <p class="card-text mb-1">
                            <i class="fas fa-calendar mr-2"></i>${formatDate(reservation.date)}
                            <i class="fas fa-clock ml-3 mr-2"></i>${reservation.time}
                            <i class="fas fa-users ml-3 mr-2"></i>${reservation.guests} pessoas
                        </p>
                        <p class="card-text">
                            <i class="fas fa-envelope mr-2"></i>${reservation.email}
                            <i class="fas fa-phone ml-3 mr-2"></i>${reservation.phone}
                        </p>
                    </div>
                    <div class="col-md-4 text-md-right">
                        <span class="badge badge-${getStatusBadgeClass(reservation.status)} mb-2">
                            ${getStatusText(reservation.status)}
                        </span>
                        <div>
                            <button class="btn btn-sm btn-outline-success mr-1" onclick="updateReservationStatus(${reservation.id}, 'confirmada')">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="updateReservationStatus(${reservation.id}, 'cancelada')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    reservationsList.innerHTML = html;
}

function updateReservationStatus(reservationId, newStatus) {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
        reservation.status = newStatus;
        updateReservationsList();
        
        const statusText = getStatusText(newStatus);
        showNotification(`Reserva ${statusText.toLowerCase()} com sucesso!`, 'success');
    }
}

function getStatusBadgeClass(status) {
    const classes = {
        'pendente': 'warning',
        'confirmada': 'success',
        'cancelada': 'danger'
    };
    return classes[status] || 'secondary';
}

function getStatusText(status) {
    const texts = {
        'pendente': 'Pendente',
        'confirmada': 'Confirmada',
        'cancelada': 'Cancelada'
    };
    return texts[status] || 'Desconhecido';
}

// ================================
// MENU INTERATIVO
// ================================
function setupInteractiveMenu() {
    createMenuFilters();
    renderMenuItems();
}

function createMenuFilters() {
    const filtersContainer = document.getElementById('menuFilters');
    if (!filtersContainer) return;

    const categories = ['todos', 'entrada', 'principal', 'sobremesa'];
    const categoryNames = {
        'todos': 'Todos',
        'entrada': 'Entradas',
        'principal': 'Pratos Principais',
        'sobremesa': 'Sobremesas'
    };

    const filtersHTML = categories.map(category => `
        <button class="btn btn-outline-primary mr-2 mb-2 filter-btn ${category === 'todos' ? 'active' : ''}" 
                data-category="${category}">
            ${categoryNames[category]}
        </button>
    `).join('');

    filtersContainer.innerHTML = filtersHTML;

    // Adicionar event listeners
    const filterButtons = filtersContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleMenuFilter);
    });
}

function handleMenuFilter(e) {
    const category = e.target.dataset.category;
    
    // Atualizar botão ativo
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filtrar e renderizar itens
    renderMenuItems(category);
}

function renderMenuItems(filterCategory = 'todos') {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;

    const filteredItems = filterCategory === 'todos' 
        ? menuItems 
        : menuItems.filter(item => item.category === filterCategory);

    const html = filteredItems.map(item => `
        <div class="col-lg-4 col-md-6 col-12 mb-4 menu-item-card" data-category="${item.category}">
            <div class="menu-item reveal">
                <h4>${item.name} <span class="price">R$ ${item.price.toFixed(2)}</span></h4>
                <p>${item.description}</p>
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        ${generateStarRating(item.rating)}
                        <small class="ml-2 text-muted">(${item.reviews} avaliações)</small>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="addToOrder(${item.id})">
                        <i class="fas fa-plus"></i> Adicionar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    menuContainer.innerHTML = html;
    
    // Reativar scroll reveal para novos elementos
    const revealElements = menuContainer.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        observer.observe(el);
    });
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let html = '';

    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star text-warning mr-1"></i>';
    }

    if (hasHalfStar) {
        html += '<i class="fas fa-star-half-alt text-warning mr-1"></i>';
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star text-warning mr-1"></i>';
    }

    return html;
}

function addToOrder(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
        showNotification(`${item.name} adicionado ao pedido!`, 'success');
        // Aqui você implementaria a lógica do carrinho
    }
}

// ================================
// UTILIDADES
// ================================
function simulateFormSubmission(data, type) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simular 90% de sucesso
            if (Math.random() > 0.1) {
                console.log(`${type} enviado:`, data);
                resolve(data);
            } else {
                reject(new Error('Erro simulado'));
            }
        }, 1500);
    });
}

function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert">
            <span>&times;</span>
        </button>
    `;

    document.body.appendChild(notification);

    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// ================================
// FUNCÕES ESPECÍFICAS PARA PÁGINAS
// ================================

// Função para a página de horários
function initializeSchedulePage() {
    updateCurrentStatus();
    setInterval(updateCurrentStatus, 60000); // Atualizar a cada minuto
}

function updateCurrentStatus() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM format

    const schedule = {
        1: { start: 1800, end: 2300 }, // Segunda
        2: { start: 1800, end: 2300 }, // Terça
        3: { start: 1800, end: 2300 }, // Quarta
        4: { start: 1800, end: 2330 }, // Quinta
        5: { start: 1800, end: 2400 }, // Sexta
        6: { start: 1200, end: 2400 }, // Sábado
        0: { start: 1200, end: 2200 }  // Domingo
    };

    const todaySchedule = schedule[currentDay];
    const isOpen = todaySchedule && currentTime >= todaySchedule.start && currentTime <= todaySchedule.end;

    // Atualizar status visual se existir elemento
    const statusElements = document.querySelectorAll('.status-badge');
    statusElements.forEach(el => {
        if (el.closest('tr').cells[0].textContent.includes(getDayName(currentDay))) {
            el.className = `badge badge-${isOpen ? 'success' : 'warning'}`;
            el.textContent = isOpen ? 'Aberto Agora' : 'Fechado';
        }
    });
}

function getDayName(dayIndex) {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[dayIndex];
}

// ================================
// EXPORT PARA PÁGINAS ESPECÍFICAS
// ================================
window.RestaurantApp = {
    initializeSchedulePage,
    updateCurrentStatus,
    handleContactForm,
    handleReservationForm,
    setupInteractiveMenu,
    showNotification
};