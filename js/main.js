document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }

  animateSkills();
  setupEventListeners();
  greetUser();
  highlightTopSkills();
  
  if (isWeekend() === true) {
    showToast('💡 Estás visitando en fin de semana. ¡Gracias por pasar!', 'info');
  }
});


function setupEventListeners() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const contactBtn = document.getElementById('contact-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      const contacto = document.getElementById('contacto');
      if (contacto) contacto.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const timelineBtn = document.getElementById('timeline-btn');
  if (timelineBtn) {
    timelineBtn.addEventListener('click', () => {
      const timelineModal = new bootstrap.Modal(document.getElementById('timelineModal'));
      timelineModal.show();
    });
  }

  const cvLink = document.querySelector('a[download][href$="01-CV.pdf"]');
  if (cvLink) {
    cvLink.addEventListener('click', e => {
      const ok = confirm('¿Deseas descargar el CV en PDF ahora?');
      if (!ok) {
        e.preventDefault();
        showToast('Descarga cancelada.', 'warning');
        return;
      }
      spawnParticles(e.pageX, e.pageY);
    });
  }

  document.querySelectorAll('.contact-info').forEach(el => {
    el.addEventListener('click', () => {
      const info = el.getAttribute('data-info');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(info).then(() => {
          showToast(`📋 ${info} copiado al portapapeles`, 'success');
        }).catch(() => showToast('No se pudo copiar al portapapeles', 'error'));
      } else {
        alert('Tu navegador no soporta la copia al portapapeles');
      }
    });
  });

  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 100) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(contactForm) === true) {
        alert('¡Mensaje enviado correctamente! Te responderé en breve.');
        contactForm.reset();
      }
    });
  }

  const profileImg = document.querySelector('.profile-img');
  if (profileImg) {
    let clicks = 0;
    profileImg.addEventListener('click', () => {
      clicks++;
      showToast(`🖼️ Clicks a la foto: ${clicks}`, 'info');
      if (clicks >= 5) {
        alert('¡Gracias por tu interés! 👋');
        clicks = 0;
      }
    });
  }

  const audio = document.getElementById('bg-music');
  const startButton = document.getElementById('start-music');
  function tryPlay() {
    audio.volume = 0.4;
    audio.play().then(() => {
      if (startButton) startButton.style.display = 'none';
    }).catch(() => {
      if (startButton) startButton.style.display = 'block';
    });
  }
  document.addEventListener('click', tryPlay, { once: true });
  document.addEventListener('keydown', tryPlay, { once: true });
  if (startButton) startButton.addEventListener('click', tryPlay);
}



function greetUser() {
  let name = localStorage.getItem('lfm_name');
  if (name == null) {
    name = prompt('¡Bienvenido! ¿Cómo te llamas?');
    if (name && name.trim().length >= 2) {
      localStorage.setItem('lfm_name', name.trim());
      alert(`Hola, ${name.trim()} 👋 Gracias por visitar mi portafolio.`);
    } else if (name === '' || name === null) {
      showToast('Puedes decirme tu nombre cuando quieras 🙂', 'info');
    }
  } else {
    showToast(`¡Hola de nuevo, ${name}!`, 'success');
  }
}

function highlightTopSkills() {
  const items = document.querySelectorAll('#habilidades .skill-item');
  for (let i = 0; i < items.length; i++) {
    const percentEl = items[i].querySelector('.skill-name span:last-child');
    const bar = items[i].querySelector('.progress-bar');
    if (!percentEl || !bar) continue;

    const value = parseInt(percentEl.textContent.replace('%', ''), 10);
    if (value >= 85) {
      bar.style.filter = 'saturate(1.3)';
      bar.style.boxShadow = '0 0 10px rgba(118, 75, 162, 0.5)';
      const badge = document.createElement('span');
      badge.textContent = 'Top';
      badge.className = 'ms-2 badge bg-primary';
      percentEl.after(badge);
    }
  }
}

function isWeekend() {
  const d = new Date().getDay();
  return d === 0 || d === 6;
}

function animateSkills() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          setTimeout(() => { bar.style.width = width + '%'; }, 200);
        });
      }
    });
  }, { threshold: 0.5 });

  const skillsSection = document.getElementById('habilidades');
  if (skillsSection) observer.observe(skillsSection);
}

function validateForm(form) {
  const requiredSelectors = ['#nombre', '#email', '#fecha', '#mensaje', '#terminos'];
  for (let i = 0; i < requiredSelectors.length; i++) {
    const el = form.querySelector(requiredSelectors[i]);
    if (!el) continue;

    if (el.type === 'checkbox' && el.checked !== true) {
      showToast('Debes aceptar la política de privacidad.', 'warning');
      el.focus();
      break;
    }

    if (el.type !== 'checkbox') {
      if (!el.value || el.value.trim().length < 2) {
        showToast('Por favor completa todos los campos obligatorios.', 'warning');
        el.focus();
        break;
      }
      if (el.id === 'fecha') {
        const today = new Date(); today.setHours(0,0,0,0);
        const chosen = new Date(el.value);
        if (chosen < today) {
          alert('La fecha de contacto no puede estar en el pasado.');
          el.focus();
          break;
        }
      }
    }

    if (i === requiredSelectors.length - 1) {
      return true;
    }
  }
  return false;
}

function spawnParticles(x, y) {
  const container = document.body;
  let i = 0;
  const max = 20;

  while (i < max) {
    if (document.hidden === true) break;
    const p = document.createElement('span');
    p.style.position = 'fixed';
    p.style.left = (x + (Math.random() * 40 - 20)) + 'px';
    p.style.top = (y + (Math.random() * 40 - 20)) + 'px';
    p.style.width = p.style.height = (6 + Math.random() * 6) + 'px';
    p.style.borderRadius = '50%';
    p.style.background = getComputedStyle(document.documentElement)
      .getPropertyValue('--secondary-color') || '#3498db';
    p.style.opacity = '0.9';
    p.style.pointerEvents = 'none';
    p.style.transform = 'translate(-50%, -50%)';
    p.style.transition = 'all .8s ease';

    container.appendChild(p);

    requestAnimationFrame(() => {
      p.style.opacity = '0';
      p.style.transform = `translate(${(Math.random() * 2 - 1) * 60}px, ${(Math.random() * 2 - 1) * 60}px) scale(0.6)`;
    });

    setTimeout(() => p.remove(), 900);
    i++;
  }
}

function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toastId = 'toast-' + Date.now();
  const toast = document.createElement('div');
  toast.className = 'toast custom-toast align-items-center border-0 mb-3';
  toast.setAttribute('id', toastId);
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  const classes = {
    success: 'text-bg-success',
    error: 'text-bg-danger',
    warning: 'text-bg-warning',
    info: 'text-bg-info'
  };
  const icons = {
    success: 'bi-check-circle',
    error: 'bi-exclamation-triangle',
    warning: 'bi-exclamation-circle',
    info: 'bi-info-circle'
  };

  toast.classList.add(classes[type] || 'text-bg-info');

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center">
        <i class="bi ${icons[type] || 'bi-info-circle'} me-2"></i> ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
    </div>
    <div class="toast-progress"></div>
  `;

  toastContainer.appendChild(toast);
  const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 4000 });
  bsToast.show();
  toast.addEventListener('hidden.bs.toast', () => toast.remove());
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