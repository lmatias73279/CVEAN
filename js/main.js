// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    // Animar barras de habilidades al hacer scroll
    animateSkills();
    
    // Configurar todos los event listeners
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Botón de contacto
    const contactBtn = document.getElementById('contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            const contacto = document.getElementById('contacto');
            if (contacto) {
                contacto.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Abrir modal de línea de tiempo
    const timelineBtn = document.getElementById('timeline-btn');
    if (timelineBtn) {
        timelineBtn.addEventListener('click', function() {
            const timelineModal = new bootstrap.Modal(document.getElementById('timelineModal'));
            timelineModal.show();
        });
    }
    
    // Formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('¡Mensaje enviado correctamente! Te responderé en breve.', 'success');
            this.reset();
        });
    }
    
    // Información de contacto interactiva
    document.querySelectorAll('.contact-info').forEach(element => {
        element.addEventListener('click', function() {
            const info = this.getAttribute('data-info');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(info).then(() => {
                    showToast(`¡${info} copiado al portapapeles!`, 'success');
                }).catch(() => {
                    showToast('No se pudo copiar al portapapeles', 'error');
                });
            } else {
                showToast('Tu navegador no soporta la copia al portapapeles', 'warning');
            }
        });
    });
    
    // Navegación scroll
    window.addEventListener('scroll', function() {
        // Efecto en navbar al hacer scroll
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Actualizar navegación activa
        updateActiveNav();
    });
}

// Animar barras de habilidades
function animateSkills() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-bar');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const skillsSection = document.getElementById('habilidades');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// Mostrar notificación toast
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toastId = 'toast-' + Date.now();
    
    const toast = document.createElement('div');
    toast.className = `custom-toast align-items-center border-0 mb-3`;
    toast.setAttribute('id', toastId);
    
    const toastClass = {
        'success': 'text-bg-success',
        'error': 'text-bg-danger',
        'warning': 'text-bg-warning',
        'info': 'text-bg-info'
    };
    
    const icons = {
        'success': 'bi-check-circle',
        'error': 'bi-exclamation-triangle',
        'warning': 'bi-exclamation-circle',
        'info': 'bi-info-circle'
    };
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body d-flex align-items-center">
                <i class="bi ${icons[type] || 'bi-info-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-progress"></div>
    `;
    
    toast.classList.add(toastClass[type] || 'text-bg-info');
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 4000
    });
    
    bsToast.show();
    
    // Eliminar el toast del DOM después de que se oculte
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("bg-music");
    const startButton = document.getElementById("start-music");

    function tryPlay() {
        audio.volume = 0.4;

        // Intentar reproducir dentro del mismo contexto del click
        audio.play()
            .then(() => {
                console.log("🎵 Música iniciada correctamente");
                startButton.style.display = "none"; // ocultar botón si estaba visible
            })
            .catch(err => {
                console.warn("Autoplay bloqueado, mostrando botón manual:", err);
                startButton.style.display = "block";
            });
    }

    // Primer clic o tecla en cualquier parte de la página
    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("keydown", tryPlay, { once: true });

    // Si falló, permitir al usuario iniciarlo manualmente
    startButton.addEventListener("click", tryPlay);
});
