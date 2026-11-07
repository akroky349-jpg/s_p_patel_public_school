/**
 * S. P. PATEL PUBLIC SCHOOL — MAIN JAVASCRIPT
 * Notice Search & Filter, Notice Modal, Tab Switchers, Accordions & Back-to-Top
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. FAQ & Details Accordions
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasActive = item?.classList.contains('active');

      // Close siblings in same group
      const parentGroup = item?.closest('.accordion-group');
      if (parentGroup) {
        parentGroup.querySelectorAll('.accordion-item').forEach((sibling) => {
          sibling.classList.remove('active');
        });
      }

      if (!wasActive) {
        item?.classList.add('active');
      }
    });
  });

  // 3. Tab Navigation (Results & Academics)
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      const tabsNav = btn.closest('.tabs-nav');
      const tabsParent = tabsNav?.parentElement;

      if (!targetId || !tabsParent) return;

      // Update button active state
      tabsNav.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panes
      tabsParent.querySelectorAll('.tab-pane').forEach((pane) => {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // 4. Notices Live Search & Category Filtering
  const noticeSearchInput = document.getElementById('noticeSearchInput');
  const noticeFilterPills = document.querySelectorAll('.notice-filter-pill');
  const noticeItems = document.querySelectorAll('.notice-item');

  let activeCategory = 'all';
  let searchTerm = '';

  const filterNotices = () => {
    let visibleCount = 0;
    noticeItems.forEach((item) => {
      const category = item.getAttribute('data-category') || 'all';
      const text = item.textContent?.toLowerCase() || '';

      const matchesCat = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = searchTerm === '' || text.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        item.style.display = 'flex';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    const noResultsEl = document.getElementById('noticeNoResults');
    if (noResultsEl) {
      noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  noticeSearchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    filterNotices();
  });

  noticeFilterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      noticeFilterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category') || 'all';
      filterNotices();
    });
  });

  // 5. Notice Detail Modal & PDF View
  const noticeModal = document.getElementById('noticeModal');
  const noticeModalTitle = document.getElementById('noticeModalTitle');
  const noticeModalDate = document.getElementById('noticeModalDate');
  const noticeModalBody = document.getElementById('noticeModalBody');
  const noticeModalClose = document.getElementById('noticeModalClose');
  const noticePrintBtn = document.getElementById('noticePrintBtn');

  document.querySelectorAll('.view-notice-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.notice-item');
      if (!parent || !noticeModal) return;

      const title = parent.querySelector('.notice-title')?.textContent || 'School Official Notice';
      const date = parent.querySelector('.notice-meta-date')?.textContent || 'Current Academic Session';
      const category = parent.querySelector('.badge')?.textContent || 'Notice';
      const summary = parent.getAttribute('data-summary') || 'Official notice released by the Administrative Secretariat of S. P. Patel Public School. All parents, staff, and students are requested to kindly take note of the schedule and regulations.';

      if (noticeModalTitle) noticeModalTitle.textContent = title;
      if (noticeModalDate) noticeModalDate.textContent = `${category} • ${date}`;
      if (noticeModalBody) {
        noticeModalBody.innerHTML = `
          <div style="border-bottom:1px solid #E2E8F0; padding-bottom:1rem; margin-bottom:1.25rem;">
            <p style="font-size:0.9rem; color:#64748B;">Official Circular Reference: SPPS/ADMIN/2026-27/${Math.floor(100 + Math.random() * 900)}</p>
          </div>
          <p style="font-size:1.02rem; line-height:1.75; color:#1E293B;">${summary}</p>
          <div style="margin-top:1.5rem; padding:1rem; background-color:#F8FAFC; border-left:3px solid #D4AF65; border-radius:4px;">
            <p style="font-size:0.88rem; margin:0; color:#334155;"><strong>Instructions:</strong> Please retain a copy of this circular for future reference. For queries, kindly contact the school administrative office between 08:30 AM and 02:30 PM.</p>
          </div>
        `;
      }

      noticeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  noticeModalClose?.addEventListener('click', () => {
    noticeModal?.classList.remove('active');
    document.body.style.overflow = '';
  });

  noticeModal?.addEventListener('click', (e) => {
    if (e.target === noticeModal) {
      noticeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  noticePrintBtn?.addEventListener('click', () => {
    window.print();
  });

  // 6. Dynamic Year in Footer
  const yearEls = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach((el) => {
    el.textContent = currentYear;
  });
});
