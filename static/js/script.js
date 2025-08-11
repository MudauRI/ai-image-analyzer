document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // File upload interaction
    const fileUpload = document.getElementById('file-upload');
    const uploadLabel = document.querySelector('.upload-label');
    
    if (fileUpload && uploadLabel) {
        fileUpload.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                uploadLabel.innerHTML = `
                    <svg viewBox="0 0 24 24">
                        <path d="M19 13a1 1 0 0 0-1 1v.38l-1.48-1.48a2.79 2.79 0 0 0-3.93 0l-.7.7-2.48-2.48a2.85 2.85 0 0 0-3.93 0L4 12.6V7a1 1 0 0 1 1-1h7a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5a1 1 0 0 0-1-1zM5 20a1 1 0 0 1-1-1v-3.57l2.9-2.9a.79.79 0 0 1 1.09 0l3.17 3.17 4.29 4.3zm13-1a.89.89 0 0 1-.18.53L13.31 15l.7-.7a.77.77 0 0 1 1.1 0L18 17.22zm4.71-14.71l-14-14a1 1 0 0 0-1.42 0l-14 14a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0L5 7.41V19a1 1 0 0 0 1 1h11a1 1 0 0 0 0-2H7a1 1 0 0 1-1-1V5.41l12.29 12.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/>
                    </svg>
                    <span>${this.files[0].name}</span>
                    <p class="file-types">Supports: JPG, PNG, WEBP (Max 8MB)</p>
                `;
            }
        });
    }
});

// Contact form handling with Formspree
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            try {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                // Send form data to Formspree
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    alert('Thank you for your message! I will get back to you soon.');
                    this.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('There was a problem sending your message. Please try again later or contact me directly at 083 955 7604.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
    
    // Mobile menu toggle (keep existing code)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const spinner = submitBtn.querySelector('.spinner');
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    document.getElementById('contact-success').style.display = 'block';
                    window.location.hash = 'contact-success';
                    this.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('There was a problem sending your message. Please try again or contact me directly at 083 955 7604.');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }
    
    // Check for success hash on page load
    if (window.location.hash === '#contact-success') {
        document.getElementById('contact-success').style.display = 'block';
    }
    
    // Mobile menu toggle (keep existing if you have one)
});