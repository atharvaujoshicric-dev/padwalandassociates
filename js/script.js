/* ==========================================================================
   Padwal & Associates — Site scripts
   ========================================================================== */

document.getElementById('year').textContent = new Date().getFullYear();

if (window.lucide) lucide.createIcons();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Header scroll state ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

/* ---------- 3D tilt cards ---------- */
document.querySelectorAll('[data-tilt]').forEach(card => {
  const inner = card.querySelector('.tilt-inner');
  const strength = 10;

  const handleMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const rotateY = (px - 0.5) * strength;
    const rotateX = (0.5 - py) * strength;
    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    inner.style.setProperty('--mx', `${px * 100}%`);
    inner.style.setProperty('--my', `${py * 100}%`);
  };

  card.addEventListener('mousemove', handleMove);
  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
});

/* ---------- Plate card subtle tilt (About section) ---------- */
const plate = document.getElementById('plateCard');
if (plate && !reduceMotion) {
  const wrap = plate.parentElement;
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    plate.style.transform = `rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 8}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    plate.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* ---------- Contact form -> mailto ---------- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const area = form.area.value;
    const message = form.message.value.trim();

    const subject = `Consultation Request: ${area} — ${name}`;
    const body =
`Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Practice Area: ${area}

Message:
${message}`;

    const mailto = `mailto:advshantanupadwal@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}

/* ==========================================================================
   Hero 3D scene — wireframe shield + orbiting data particles (Three.js)
   ========================================================================== */
(function initHeroScene() {
  const container = document.getElementById('heroScene');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0.2, 9);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  group.position.set(2.6, 0, 0);
  scene.add(group);

  /* --- Shield silhouette (extruded) --- */
  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(0, 1.65);
  shieldShape.quadraticCurveTo(1.15, 1.25, 1.15, 0.55);
  shieldShape.lineTo(1.15, -0.15);
  shieldShape.quadraticCurveTo(1.1, -1.05, 0, -1.7);
  shieldShape.quadraticCurveTo(-1.1, -1.05, -1.15, -0.15);
  shieldShape.lineTo(-1.15, 0.55);
  shieldShape.quadraticCurveTo(-1.15, 1.25, 0, 1.65);

  const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 24 };
  const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
  shieldGeo.center();

  const shieldMat = new THREE.MeshBasicMaterial({ color: 0xC6A15B, wireframe: true, transparent: true, opacity: 0.55 });
  const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
  group.add(shieldMesh);

  const shieldFillMat = new THREE.MeshBasicMaterial({ color: 0x16213C, transparent: true, opacity: 0.35 });
  const shieldFill = new THREE.Mesh(shieldGeo.clone(), shieldFillMat);
  shieldFill.scale.setScalar(0.985);
  group.add(shieldFill);

  /* --- Lock glyph inside shield (cyan) --- */
  const lockGroup = new THREE.Group();
  const lockBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.5, 0.08),
    new THREE.MeshBasicMaterial({ color: 0x3FD0C9, wireframe: true })
  );
  lockBody.position.y = -0.18;
  lockGroup.add(lockBody);

  const shackle = new THREE.Mesh(
    new THREE.TorusGeometry(0.26, 0.045, 8, 24, Math.PI),
    new THREE.MeshBasicMaterial({ color: 0x3FD0C9 })
  );
  shackle.position.y = 0.18;
  shackle.rotation.z = Math.PI;
  lockGroup.add(shackle);
  lockGroup.position.z = 0.15;
  group.add(lockGroup);

  /* --- Orbiting halo ring (gold) --- */
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.1, 0.012, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0xC6A15B, transparent: true, opacity: 0.5 })
  );
  ring.rotation.x = Math.PI / 2.4;
  group.add(ring);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.55, 0.008, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0x3FD0C9, transparent: true, opacity: 0.35 })
  );
  ring2.rotation.x = Math.PI / 1.9;
  ring2.rotation.y = 0.4;
  group.add(ring2);

  /* --- Data particle field --- */
  const particleCount = 220;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 3.4 + Math.random() * 3.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
    positions[i * 3 + 2] = radius * Math.cos(phi) * 0.6 - 2;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0x8FEDE7, size: 0.028, transparent: true, opacity: 0.75 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* --- Mouse parallax --- */
  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5);
    targetY = (e.clientY / window.innerHeight - 0.5);
  });

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!reduceMotion) {
      group.rotation.y = t * 0.28 + targetX * 0.6;
      group.rotation.x = Math.sin(t * 0.4) * 0.08 - targetY * 0.3;
      group.position.y = Math.sin(t * 0.6) * 0.12;
      ring.rotation.z = t * 0.15;
      ring2.rotation.z = -t * 0.1;
      particles.rotation.y = t * 0.02;
    }

    renderer.render(scene, camera);
  }
  animate();
})();
