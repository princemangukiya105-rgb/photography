/**
 * Moments Production — Main UI Controller
 * Navigation, interactions, WhatsApp & Email concierge, and initialization
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initFaqAccordion();
  initContactForm();
});

// Sticky Glass Header
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.background = 'rgba(7, 7, 9, 0.96)';
      header.style.borderColor = 'rgba(197, 160, 89, 0.25)';
    } else {
      header.style.background = 'rgba(11, 11, 14, 0.88)';
      header.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    }
  });
}

// Mobile Drawer Toggle
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close when clicking nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// Contact Form Handler with WhatsApp and Email Dispatch
function initContactForm() {
  const form = document.getElementById('studio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const phone = document.getElementById('contact-phone')?.value.trim();
    const disciplineEl = document.getElementById('contact-discipline');
    const discipline = disciplineEl ? disciplineEl.options[disciplineEl.selectedIndex].text : 'General Inquiry';
    const date = document.getElementById('contact-date')?.value.trim() || 'Flexible / Upcoming';
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !phone || !message) {
      alert('Please fill in all required contact details.');
      return;
    }

    const inquiry = {
      id: 'INQ-' + Date.now(),
      name,
      email,
      phone,
      discipline,
      date,
      message,
      submittedAt: new Date().toISOString()
    };

    // Store in localStorage for audit
    const stored = JSON.parse(localStorage.getItem('moments_production_inquiries') || '[]');
    stored.unshift(inquiry);
    localStorage.setItem('moments_production_inquiries', JSON.stringify(stored));

    // Construct direct WhatsApp message
    const waText = encodeURIComponent(
      `*New Atelier Inquiry — Moments Production*\n\n` +
      `*Client:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Discipline:* ${discipline}\n` +
      `*Target Date:* ${date}\n\n` +
      `*Requirements:*\n${message}`
    );
    const waUrl = `https://wa.me/919876543210?text=${waText}`;

    // Construct direct Email mailto
    const mailSubject = encodeURIComponent(`Commission Inquiry: ${discipline} — ${name}`);
    const mailBody = encodeURIComponent(
      `Dear Moments Production Atelier,\n\n` +
      `My commission inquiry details are as follows:\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Discipline: ${discipline}\n` +
      `Target Date: ${date}\n\n` +
      `Message & Requirements:\n${message}\n\n` +
      `Looking forward to hearing from your studio team.`
    );
    const mailUrl = `mailto:contact@momentsproduction.com?subject=${mailSubject}&body=${mailBody}`;

    // Show inline action confirmation
    const feedbackDiv = document.getElementById('contact-form-feedback');
    if (feedbackDiv) {
      feedbackDiv.innerHTML = `
        <div style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.4); padding: 1.5rem; border-radius: 4px; color: #a7f3d0; margin-bottom: 1.5rem;">
          <strong style="color:#fff; font-size:1.1rem; display:block; margin-bottom:0.5rem;">Inquiry Drafted Successfully!</strong>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1.2rem; line-height:1.6;">
            Thank you, <strong>${name}</strong>. Choose your preferred channel below to send your details directly to our studio team for immediate review:
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="font-size:0.75rem; padding:0.65rem 1.25rem;">
              Send via WhatsApp Now &rarr;
            </a>
            <a href="${mailUrl}" class="btn btn-email" style="font-size:0.75rem; padding:0.65rem 1.25rem;">
              Send via Email App &rarr;
            </a>
            <a href="tel:+919876543210" class="btn btn-outline" style="font-size:0.75rem; padding:0.65rem 1.25rem;">
              Call Direct: +91 98765 43210
            </a>
          </div>
        </div>
      `;
      form.reset();
    } else {
      // Direct redirect to WhatsApp if feedback div is absent
      window.open(waUrl, '_blank');
    }
  });
}
