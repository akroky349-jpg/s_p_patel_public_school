/**
 * S. P. PATEL PUBLIC SCHOOL — NAVIGATION JAVASCRIPT
 * Handles Sticky Header, Dropdown menus, Keyboard Accessibility & Mobile Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navWrapper = document.querySelector('.nav-menu-wrapper');
  const navItemsWithDropdown = document.querySelectorAll('.nav-item.has-dropdown');

  // Create overlay if not present
  let overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
  }

  // 1. Sticky Header on Scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Drawer Open/Close
  const toggleMenu = (forceClose = false) => {
    const shouldOpen = forceClose ? false : !navWrapper?.classList.contains('open');
    if (shouldOpen) {
      navWrapper?.classList.add('open');
      toggleBtn?.classList.add('open');
      overlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
      toggleBtn?.setAttribute('aria-expanded', 'true');
    } else {
      navWrapper?.classList.remove('open');
      toggleBtn?.classList.remove('open');
      overlay?.classList.remove('active');
      document.body.style.overflow = '';
      toggleBtn?.setAttribute('aria-expanded', 'false');
    }
  };

  toggleBtn?.addEventListener('click', () => toggleMenu());
  overlay?.addEventListener('click', () => toggleMenu(true));

  // 3. Mobile Dropdown Toggle (Accordion style)
  navItemsWithDropdown.forEach((item) => {
    const link = item.querySelector('.nav-link');
    link?.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const isExpanded = item.classList.contains('mobile-expanded');
        // Close siblings
        navItemsWithDropdown.forEach((other) => {
          if (other !== item) other.classList.remove('mobile-expanded');
        });
        if (isExpanded) {
          item.classList.remove('mobile-expanded');
          link.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('mobile-expanded');
          link.setAttribute('aria-expanded', 'true');
        }
      }
    });
  });

  // 4. Keyboard Navigation for Dropdowns on Desktop
  navItemsWithDropdown.forEach((item) => {
    const trigger = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');

    trigger?.addEventListener('keydown', (e) => {
      if (window.innerWidth > 992) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          dropdown?.querySelector('a')?.focus();
        }
      }
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        trigger?.focus();
      }
    });
  });

  // 5. Active Link Highlight
  const currentPath = window.location.pathname.toLowerCase();
  const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-link');

  allNavLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Check exact or relative match
    const cleanHref = href.split('#')[0].replace(/^\.\.\//, '').replace(/^\.\//, '').toLowerCase();
    if (cleanHref && (currentPath.endsWith(cleanHref) || (cleanHref === 'index.html' && (currentPath === '/' || currentPath.endsWith('/'))))) {
      link.classList.add('active-page');
      // If inside dropdown, also highlight parent nav-item
      const parentDropdown = link.closest('.nav-item.has-dropdown');
      if (parentDropdown) {
        parentDropdown.classList.add('active');
      }
    }
  });

  // 6. Close mobile menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && navWrapper?.classList.contains('open')) {
      toggleMenu(true);
    }
  });
});
