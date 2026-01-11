const revealElements = document.querySelectorAll(".reveal");

const elementStates = new WeakMap();

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const el = entry.target;
      const currentState = elementStates.get(el) || { active: false };

      const shouldActivate = entry.intersectionRatio > 0.15;
      const shouldDeactivate = entry.intersectionRatio < 0.05;

      if (shouldActivate && !currentState.active) {
        el.classList.add("active");
        elementStates.set(el, { active: true });

        el.querySelectorAll(".bar div").forEach(bar => {
          bar.style.width = bar.dataset.value;
        });
      } else if (shouldDeactivate && currentState.active) {
        el.classList.remove("active");
        elementStates.set(el, { active: false });

        el.querySelectorAll(".bar div").forEach(bar => {
          bar.style.width = "0";
        });
      }
    });
  },
  {
    threshold: [0, 0.05, 0.15, 0.3, 0.5, 0.7, 1]
  }
);

revealElements.forEach(el => revealObserver.observe(el));

const canvas = document.getElementById("bg-geo");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Shape {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.size = 15 + Math.random() * 30;
    this.sides = 3 + Math.floor(Math.random() * 4);

    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;

    this.angle = Math.random() * Math.PI;
    this.rotation = (Math.random() - 0.5) * 0.0006;

    this.alpha = 0.15 + Math.random() * 0.25;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.rotation;

    const margin = 120;
    if (this.x < -margin) this.x = canvas.width + margin;
    if (this.x > canvas.width + margin) this.x = -margin;
    if (this.y < -margin) this.y = canvas.height + margin;
    if (this.y > canvas.height + margin) this.y = -margin;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.beginPath();
    for (let i = 0; i <= this.sides; i++) {
      const a = (i / this.sides) * Math.PI * 2;
      ctx.lineTo(
        Math.cos(a) * this.size,
        Math.sin(a) * this.size
      );
    }

    ctx.strokeStyle = `rgba(0,255,140,${this.alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }
}

const shapes = Array.from({ length: 40 }, () => new Shape());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(shape => {
    shape.update();
    shape.draw();
  });
  requestAnimationFrame(animate);
}

animate();

const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
  scrollHint.addEventListener('click', () => {
    const next = document.querySelector('#skills');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  });
}

document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  });
});

// Copy email from mail-popup
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-mail');
  if (!btn) return;
  e.stopPropagation();
  const wrapper = btn.closest('.mail-wrapper');
  if (!wrapper) return;
  const emailEl = wrapper.querySelector('.mail-address');
  if (!emailEl) return;
  const email = emailEl.textContent.trim();
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(email).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 1400);
  }).catch(() => {
    const range = document.createRange();
    range.selectNodeContents(emailEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
});
