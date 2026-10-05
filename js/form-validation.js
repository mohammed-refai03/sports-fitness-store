/* ==========================================================================
   STACKLY GLOBAL FORM VALIDATION SYSTEM
   - Prevents native browser HTML5 tooltips ("Please fill out this field.") globally.
   - Inline error messages directly underneath input fields for all forms.
   - Highlights invalid inputs with red borders.
   - Name fields: Alphabets & spaces only. Allows typing, shows inline error.
   - Phone fields: Numbers only. Allows typing, shows inline error.
   - Email, Password & Terms Checkbox validations with clean inline error messages.
   ========================================================================== */

(function() {
    // 1. Block native HTML5 browser validation speech bubbles ("Please fill out this field.") globally
    document.addEventListener('invalid', function(e) {
        e.preventDefault();
    }, true);

    function disableNativeFormValidation() {
        document.querySelectorAll('form').forEach(form => {
            form.setAttribute('novalidate', 'true');
        });
    }

    function getOrCreateInlineError(input) {
        let parent = input.closest('.input-group') || input.closest('.input-wrapper') || input.closest('.promo-input-wrapper') || input.closest('.check-row') || input.closest('.checkbox-item') || input.closest('.appt-form-group') || input.closest('.form-group') || input.parentElement;
        let errorEl = parent.querySelector('.inline-field-error, .field-error');
        
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'inline-field-error';
            errorEl.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 6px; display: none; font-weight: 500; font-family: "Poppins", sans-serif; line-height: 1.4;';
            
            const targetSibling = input.closest('.input-wrapper') || input.closest('.promo-input-wrapper') || input;
            if (targetSibling && targetSibling.nextSibling) {
                parent.insertBefore(errorEl, targetSibling.nextSibling);
            } else {
                parent.appendChild(errorEl);
            }
        } else {
            errorEl.style.color = '#ef4444';
            errorEl.style.fontSize = '12px';
            errorEl.style.marginTop = '6px';
            errorEl.style.fontWeight = '500';
            errorEl.style.fontFamily = '"Poppins", sans-serif';
        }
        return errorEl;
    }

    function showInlineError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');
        input.style.borderColor = '#ef4444';
        const wrapper = input.closest('.promo-input-wrapper, .input-wrapper');
        if (wrapper) wrapper.classList.add('has-error');
        const errEl = getOrCreateInlineError(input);
        errEl.textContent = message;
        errEl.style.display = 'block';
        errEl.classList.add('show');
    }

    function clearInlineError(input) {
        input.classList.remove('error');
        input.style.borderColor = '';
        const wrapper = input.closest('.promo-input-wrapper, .input-wrapper');
        if (wrapper) wrapper.classList.remove('has-error');
        const errEl = getOrCreateInlineError(input);
        errEl.textContent = '';
        errEl.style.display = 'none';
        errEl.classList.remove('show');
    }

    function validateSingleInput(input) {
        if (!input || input.type === 'hidden' || input.type === 'submit' || input.type === 'button') {
            return true;
        }

        const value = input.value || '';
        const type = (input.type || '').toLowerCase();
        const idName = ((input.id || '') + ' ' + (input.name || '') + ' ' + (input.placeholder || '')).toLowerCase();

        // Checkbox Validation (e.g. Terms & Conditions)
        if (type === 'checkbox') {
            if ((input.hasAttribute('required') || idName.includes('terms')) && !input.checked) {
                showInlineError(input, 'You must accept the Terms and Conditions to proceed.');
                return false;
            }
            clearInlineError(input);
            return true;
        }

        const isNameField = idName.includes('username') || idName.includes('fullname') || (idName.includes('name') && !idName.includes('email'));
        const isPhoneField = type === 'tel' || idName.includes('phone') || idName.includes('tel') || idName.includes('mobile');
        const isEmailField = type === 'email' || idName.includes('email');
        const isConfirmPass = idName.includes('confirm') || idName.includes('match');
        const isPasswordField = type === 'password' || idName.includes('password') || idName.includes('pass');

        // 1. Name Input Field Validation (Alphabets & spaces only)
        if (isNameField) {
            if (!value.trim()) {
                if (input.hasAttribute('required') || idName.includes('name')) {
                    showInlineError(input, 'Name is required.');
                    return false;
                }
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                showInlineError(input, 'Name must contain only alphabets and spaces.');
                return false;
            }
            clearInlineError(input);
            return true;
        }

        // 2. Phone Input Field Validation (Numbers only)
        if (isPhoneField) {
            if (!value.trim()) {
                if (input.hasAttribute('required') || idName.includes('phone')) {
                    showInlineError(input, 'Phone number is required.');
                    return false;
                }
            } else if (/[a-zA-Z]/.test(value) || !/^[0-9\+\-\s\(\)]+$/.test(value)) {
                showInlineError(input, 'Phone number should only contain numbers.');
                return false;
            }
            clearInlineError(input);
            return true;
        }

        // 3. Email Input Field Validation
        if (isEmailField) {
            if (!value.trim()) {
                if (input.hasAttribute('required') || idName.includes('email')) {
                    showInlineError(input, 'Email address is required.');
                    return false;
                }
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showInlineError(input, 'Please enter a valid email address.');
                return false;
            }
            clearInlineError(input);
            return true;
        }

        // 4. Password & Confirm Password Input Field Validation
        if (isPasswordField) {
            if (!value) {
                if (isConfirmPass) {
                    showInlineError(input, 'Confirm password is required.');
                    return false;
                } else if (input.hasAttribute('required') || idName.includes('pass')) {
                    showInlineError(input, 'Password is required.');
                    return false;
                }
            } else if (isConfirmPass) {
                const mainPass = document.querySelector('input[type="password"]:not([id*="Confirm"]):not([name*="confirm"])');
                if (mainPass && value !== mainPass.value) {
                    showInlineError(input, 'Confirm password must match the password.');
                    return false;
                }
            } else if (value.length < 6) {
                showInlineError(input, 'Password must be at least 6 characters.');
                return false;
            }
            clearInlineError(input);
            return true;
        }

        // 5. Generic Required Field Validation
        if (input.hasAttribute('required') && !value.trim()) {
            showInlineError(input, 'This field is required.');
            return false;
        }

        clearInlineError(input);
        return true;
    }

    function initFormValidation() {
        disableNativeFormValidation();

        // Ensure top summary banners like "Please fix the validation errors below." are hidden
        document.querySelectorAll('.alert-banner, #alertBanner, .form-error-banner').forEach(b => {
            if (b.innerText.toLowerCase().includes('validation') || b.innerText.toLowerCase().includes('fix')) {
                b.style.display = 'none';
            }
        });

        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.setAttribute('novalidate', 'true');

            // Attach input/change/blur listeners that ONLY run validation AFTER the submit button has been clicked
            const formInputs = form.querySelectorAll('input, select, textarea');
            formInputs.forEach(input => {
                const handleRealtimeValidation = function() {
                    if (form.dataset.hasAttemptedSubmit === 'true') {
                        validateSingleInput(this);
                    }
                };
                input.addEventListener('input', handleRealtimeValidation);
                input.addEventListener('change', handleRealtimeValidation);
                input.addEventListener('blur', handleRealtimeValidation);
            });

            form.addEventListener('submit', function(e) {
                form.dataset.hasAttemptedSubmit = 'true';
                let isFormValid = true;
                formInputs.forEach(inp => {
                    if (!validateSingleInput(inp)) {
                        isFormValid = false;
                    }
                });

                if (!isFormValid) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                } else {
                    if (form.id === 'promo-newsletter-form') {
                        e.preventDefault();
                        window.location.href = '404.html';
                    }
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormValidation);
    } else {
        initFormValidation();
    }
})();
