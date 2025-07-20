// Dark mode toggle
const toggle = document.getElementById('dark-mode-toggle');
const body = document.body;

toggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  // Sauvegarde le choix dans le localStorage
  if (body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
    toggle.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    toggle.textContent = '🌙';
  }
});

// Appliquer le thème sauvegardé au chargement
window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    body.classList.add('dark');
    toggle.textContent = '☀️';
  } else {
    toggle.textContent = '🌙';
  }
  // Animation d'entrée sur le titre
  const title = document.querySelector('.hero-title');
  title.style.opacity = 0;
  setTimeout(() => {
    title.style.transition = 'opacity 1.2s';
    title.style.opacity = 1;
  }, 200);
});

// Animation réseau neuronal en fond
const canvas = document.getElementById('bg-neurons');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  let points = [];
  const POINTS = 32;
  const MAX_DIST = 140;
  const SPEED = 0.4;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  function randomPoint() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED
    };
  }
  function initPoints() {
    points = [];
    for (let i = 0; i < POINTS; i++) {
      points.push(randomPoint());
    }
  }
  initPoints();

  function getColors() {
    const isDark = document.body.classList.contains('dark');
    return {
      point: isDark ? '#60a5fa' : '#3b82f6',
      line: isDark ? 'rgba(129,140,248,0.18)' : 'rgba(99,102,241,0.18)'
    };
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const colors = getColors();
    // Lignes
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.strokeStyle = colors.line;
          ctx.lineWidth = 1.1 - dist / MAX_DIST;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
    // Points
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = colors.point;
      ctx.shadowColor = colors.point;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    // Mouvement
    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
    requestAnimationFrame(animate);
  }
  animate();

  // Recolorier si dark mode change
  const observer = new MutationObserver(animate);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

// Fonctionnalités UX
const progressBar = document.getElementById('progress-bar');
const backToTopBtn = document.getElementById('back-to-top');
const notification = document.getElementById('notification');

// Barre de progression au scroll
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPercent + '%';
  
  // Bouton retour en haut
  if (scrollTop > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

// Bouton retour en haut
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  showNotification('Retour en haut de page', 'success');
});

// Fonction pour afficher des notifications
function showNotification(message, type = 'default') {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Notifications pour les interactions
document.addEventListener('DOMContentLoaded', () => {
  // Notification lors du changement de thème
  const originalToggle = toggle.addEventListener;
  toggle.addEventListener('click', () => {
    setTimeout(() => {
      const isDark = document.body.classList.contains('dark');
      showNotification(
        isDark ? 'Mode sombre activé' : 'Mode clair activé', 
        'success'
      );
    }, 100);
  });
  
  // Notification lors du téléchargement CV
  const cvBtn = document.querySelector('.cv-btn');
  if (cvBtn) {
    cvBtn.addEventListener('click', () => {
      showNotification('Téléchargement du CV en cours...', 'success');
    });
  }
}); 