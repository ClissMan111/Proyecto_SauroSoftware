// ==================== FORM VALIDATION ====================

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation
function validatePhone(phone) {
    const re = /^[\d\s\+\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

// Real-time validation
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Validation on blur
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Clear error on focus
            input.addEventListener('focus', function() {
                clearFieldError(this);
            });
        });
    });
});

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (isRequired && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !validateEmail(value)) {
        showFieldError(field, 'Por favor ingresa un email válido');
        return false;
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !validatePhone(value)) {
        showFieldError(field, 'Por favor ingresa un teléfono válido');
        return false;
    }
    
    // Min length validation
    if (field.hasAttribute('minlength')) {
        const minLength = parseInt(field.getAttribute('minlength'));
        if (value.length < minLength) {
            showFieldError(field, `Mínimo ${minLength} caracteres requeridos`);
            return false;
        }
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 0.3rem;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    field.parentElement.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '';
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ==================== FORM SUBMISSION ====================

// Generic form submission handler
function handleFormSubmission(formId, successMessage, onSuccess) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showNotification('Por favor corrige los errores en el formulario', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Here you would normally send data to your backend
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            console.log('Form submitted:', data);
            
            // Show success message
            showNotification(successMessage || '¡Formulario enviado exitosamente!', 'success');
            
            // Reset form
            form.reset();
            
            // Call success callback if provided
            if (onSuccess) {
                onSuccess(data);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Hubo un error al enviar el formulario. Por favor intenta nuevamente.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// ==================== NOTIFICATION SYSTEM ====================

function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#0ea5e9',
        warning: '#f59e0b'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ==================== AUTO-RESIZE TEXTAREA ====================

document.addEventListener('DOMContentLoaded', () => {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
});

// ==================== CHARACTER COUNTER ====================

function addCharacterCounter(textareaId, maxLength) {
    const textarea = document.getElementById(textareaId);
    if (!textarea) return;
    
    textarea.setAttribute('maxlength', maxLength);
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        color: var(--text-secondary);
        font-size: 0.85rem;
        margin-top: 0.3rem;
    `;
    
    const updateCounter = () => {
        const remaining = maxLength - textarea.value.length;
        counter.textContent = `${remaining} caracteres restantes`;
        
        if (remaining < 50) {
            counter.style.color = '#f59e0b';
        } else if (remaining < 20) {
            counter.style.color = '#ef4444';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
    };
    
    textarea.addEventListener('input', updateCounter);
    textarea.parentElement.appendChild(counter);
    updateCounter();
}

// ==================== FORM ANALYTICS ====================

function trackFormInteraction(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const startTime = Date.now();
    let fieldInteractions = {};
    
    form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('focus', function() {
            if (!fieldInteractions[this.name]) {
                fieldInteractions[this.name] = {
                    focused: Date.now(),
                    changes: 0
                };
            }
        });
        
        field.addEventListener('change', function() {
            if (fieldInteractions[this.name]) {
                fieldInteractions[this.name].changes++;
            }
        });
    });
    
    form.addEventListener('submit', function() {
        const timeSpent = Date.now() - startTime;
        console.log('Form Analytics:', {
            formId,
            timeSpent: `${(timeSpent / 1000).toFixed(2)}s`,
            fieldInteractions
        });
        
        // Here you would send analytics to your backend
    });
}

// ==================== EXPORT FUNCTIONS ====================

window.formUtils = {
    validateEmail,
    validatePhone,
    validateField,
    showFieldError,
    clearFieldError,
    handleFormSubmission,
    showNotification,
    addCharacterCounter,
    trackFormInteraction
};

// ==================== INITIALIZE ====================

console.log('Forms.js loaded successfully ✓');