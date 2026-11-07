/**
 * S. P. PATEL PUBLIC SCHOOL — FORMS VALIDATION JAVASCRIPT
 * Validates Admission Enquiry and Contact forms with clean visual feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Admission Enquiry Form Validation
  const admissionForm = document.getElementById('admissionEnquiryForm');
  if (admissionForm) {
    setupFormValidation(admissionForm, {
      studentName: { required: true, minLength: 2, label: 'Student Name' },
      parentName: { required: true, minLength: 2, label: 'Parent / Guardian Name' },
      gradeApplying: { required: true, label: 'Grade Applying For' },
      contactPhone: { required: true, type: 'phone', label: 'Mobile Number' },
      email: { required: true, type: 'email', label: 'Email Address' },
      query: { required: false, minLength: 5, label: 'Enquiry Message' }
    }, 'Thank you! Your admission enquiry has been verified and registered in this session. The school admissions office will contact you soon.');
  }

  // 2. Contact Form Validation
  const contactForm = document.getElementById('schoolContactForm');
  if (contactForm) {
    setupFormValidation(contactForm, {
      fullName: { required: true, minLength: 2, label: 'Full Name' },
      contactEmail: { required: true, type: 'email', label: 'Email Address' },
      contactPhone: { required: true, type: 'phone', label: 'Contact Number' },
      subject: { required: true, minLength: 3, label: 'Subject' },
      message: { required: true, minLength: 10, label: 'Message' }
    }, 'Thank you! Your message has been validated successfully. The school administrative desk will reach out during official working hours.');
  }

  function setupFormValidation(form, schema, successMsg) {
    const feedbackAlert = form.querySelector('.form-feedback-alert');

    // Attach blur listeners for real-time validation
    Object.keys(schema).forEach((fieldName) => {
      const field = form.elements[fieldName];
      if (!field) return;

      field.addEventListener('blur', () => {
        validateField(field, schema[fieldName]);
      });

      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          validateField(field, schema[fieldName]);
        }
      });
    });

    // Form Submit Handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      Object.keys(schema).forEach((fieldName) => {
        const field = form.elements[fieldName];
        if (!field) return;
        const fieldValid = validateField(field, schema[fieldName]);
        if (!fieldValid) isValid = false;
      });

      if (isValid) {
        if (feedbackAlert) {
          feedbackAlert.className = 'form-feedback-alert success show';
          feedbackAlert.innerHTML = `
            <strong>Success!</strong> ${successMsg}
            <div style="font-size:0.8rem; margin-top:0.35rem; color:#166534;">(Note: Phase 1 Frontend Preview — Client-side validated).</div>
          `;
          feedbackAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
        // Remove valid/invalid classes
        form.querySelectorAll('.form-control').forEach((ctrl) => {
          ctrl.classList.remove('is-invalid');
        });
      } else {
        if (feedbackAlert) {
          feedbackAlert.className = 'form-feedback-alert error show';
          feedbackAlert.innerHTML = '<strong>Please correct the highlighted fields</strong> before submitting.';
          feedbackAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  function validateField(field, rule) {
    const value = field.value.trim();
    let errorMsg = '';
    const errorEl = field.parentElement?.querySelector('.error-message');

    if (rule.required && !value) {
      errorMsg = `${rule.label || 'This field'} is required.`;
    } else if (value && rule.minLength && value.length < rule.minLength) {
      errorMsg = `${rule.label || 'This field'} must be at least ${rule.minLength} characters.`;
    } else if (value && rule.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = 'Please enter a valid email address.';
      }
    } else if (value && rule.type === 'phone') {
      // 10-digit Indian mobile number check (e.g. 9876543210 or +919876543210)
      const cleanPhone = value.replace(/[\s-]/g, '').replace(/^\+91/, '');
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(cleanPhone)) {
        errorMsg = 'Please enter a valid 10-digit Indian mobile number.';
      }
    }

    if (errorMsg) {
      field.classList.add('is-invalid');
      if (errorEl) {
        errorEl.textContent = errorMsg;
        errorEl.style.display = 'block';
      }
      return false;
    } else {
      field.classList.remove('is-invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
      return true;
    }
  }
});
