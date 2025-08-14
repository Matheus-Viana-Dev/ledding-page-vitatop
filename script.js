// VitaTop Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 77, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }

        // Hide/Show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Programa Form Validation and Submission
    const programForm = document.getElementById('programForm');
    
    if (programForm) {
        console.log('Formulário do programa encontrado:', programForm);
        
        programForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Submit do formulário do programa acionado');
            
            // Get form inputs
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const phoneInput = this.querySelector('input[name="phone"]');
            const professionInput = this.querySelector('select[name="profession"]');
            
            // Check if all inputs were found
            if (!nameInput || !emailInput || !phoneInput || !professionInput) {
                console.error('Erro: Não foi possível encontrar todos os campos do formulário');
                showErrorMessage('Erro interno. Recarregue a página e tente novamente.');
                return;
            }
            
            const inputs = this.querySelectorAll('input[required], select[required]');
            let isValid = true;

            // Reset previous error states
            inputs.forEach(input => {
                input.style.borderColor = 'rgba(0, 77, 0, 0.1)';
            });

            // Validate each required field
            inputs.forEach(input => {
                if (!input.value || !input.value.trim()) {
                    input.style.borderColor = '#dc3545';
                    isValid = false;
                }
            });

            // Email validation
            if (emailInput.value && emailInput.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    emailInput.style.borderColor = '#dc3545';
                    isValid = false;
                }
            } else {
                emailInput.style.borderColor = '#dc3545';
                isValid = false;
            }

            // Name validation
            if (!nameInput.value || !nameInput.value.trim() || nameInput.value.trim().length < 2) {
                nameInput.style.borderColor = '#dc3545';
                isValid = false;
            }

            // Phone validation
            if (phoneInput.value && phoneInput.value.trim()) {
                const phoneRegex = /^[\d\s\(\)\-\+]{10,}$/;
                if (!phoneRegex.test(phoneInput.value.replace(/\s/g, ''))) {
                    phoneInput.style.borderColor = '#dc3545';
                    isValid = false;
                }
            } else {
                phoneInput.style.borderColor = '#dc3545';
                isValid = false;
            }

            // Profession validation
            if (!professionInput.value || professionInput.value === '') {
                professionInput.style.borderColor = '#dc3545';
                isValid = false;
            }

            if (isValid) {
                // Prepare form data
                const requestData = {
                    nomeCompleto: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    telefone: phoneInput.value.trim(),
                    profissao: professionInput.value,
                    tipo: 'programa_vitatop'
                };

                console.log('Enviando dados do programa:', requestData);

                // Submit form
                submitProgramForm(requestData, this);
            } else {
                showErrorMessage('Por favor, preencha todos os campos corretamente.');
            }
        });
    } else {
        console.error('Formulário do programa não encontrado! ID: programForm');
    }

    // Programa Form Submission Function
    async function submitProgramForm(data, formElement) {
        const submitBtn = formElement.querySelector('.btn-primary');
        if (!submitBtn) {
            console.error('Botão de submit não encontrado');
            return;
        }
        
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        try {
            console.log('Enviando requisição para API...');
            
            // Simulate API call for program form
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success - show modal
            showSuccessModal();
            
            // Clear form
            formElement.reset();
            
            // Track successful submission
            trackEvent('submit', 'Form', 'Programa VitaTop Success');

        } catch (error) {
            console.error('Erro na requisição:', error);
            showErrorMessage('Erro inesperado. Tente novamente em alguns instantes.');
            trackEvent('error', 'Form', 'Programa VitaTop Error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Phone Number Formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d+)/, '($1) $2');
            }
            
            e.target.value = value;
        });
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });

    // Progress Bar on Scroll
    createProgressBar();

    function createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-green), var(--accent-green));
            z-index: 10000;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Floating Action Button
    createFloatingButton();

    function createFloatingButton() {
        const floatingBtn = document.createElement('div');
        floatingBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
        floatingBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #25D366;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.8rem;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
            z-index: 1000;
            transition: all 0.3s ease;
            opacity: 0;
            transform: scale(0);
        `;

        floatingBtn.addEventListener('click', () => {
            window.open('https://wa.me/5543999049868?text=Olá! Gostaria de saber mais sobre o Programa VitaTop e como se libertar dos plantões!', '_blank');
        });

        floatingBtn.addEventListener('mouseenter', () => {
            floatingBtn.style.transform = 'scale(1.1)';
        });

        floatingBtn.addEventListener('mouseleave', () => {
            floatingBtn.style.transform = 'scale(1)';
        });

        document.body.appendChild(floatingBtn);

        // Show floating button after scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                floatingBtn.style.opacity = '1';
                floatingBtn.style.transform = 'scale(1)';
            } else {
                floatingBtn.style.opacity = '0';
                floatingBtn.style.transform = 'scale(0)';
            }
        });
    }

    // Success/Error Messages
    function showSuccessMessage() {
        showMessage('Cadastro realizado com sucesso! Entraremos em contato em breve.', 'success');
    }

    function showErrorMessage(message) {
        showMessage(message, 'error');
    }

    function showMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
            ${type === 'success' 
                ? 'background: linear-gradient(135deg, #28a745, #20c997);' 
                : 'background: linear-gradient(135deg, #dc3545, #fd7e14);'
            }
        `;

        document.body.appendChild(messageDiv);

        // Animate in
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);

        // Animate out
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 4000);
    }

    // Analytics Tracking (Placeholder)
    function trackEvent(action, category, label) {
        // This would integrate with your analytics service
        console.log('Analytics Event:', { action, category, label });
        
        // Example: Google Analytics 4
        // gtag('event', action, {
        //     event_category: category,
        //     event_label: label
        // });
    }

    // Track important interactions
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('click', 'CTA', btn.textContent.trim());
        });
    });

    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            trackEvent('click', 'Product', `Product ${index + 1}`);
        });
    });

    // Initialize everything
    console.log('🌱 VitaTop Landing Page Loaded Successfully!');
    
    // Show welcome message after page load
    setTimeout(() => {
        if (sessionStorage.getItem('vitatop_visited') !== 'true') {
            showMessage('🌱 Bem-vindo ao VitaTop! Descubra como se libertar dos plantões com o Programa de Afiliados.', 'success');
            sessionStorage.setItem('vitatop_visited', 'true');
        }
    }, 2000);
});

// Inicialização dos Swipers
document.addEventListener('DOMContentLoaded', function() {
    // Swiper de Problemas
    const problemsSwiper = new Swiper('.problems-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: false,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.problems-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.problems-next',
            prevEl: '.problems-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 'auto',
                spaceBetween: 25,
            },
            1024: {
                slidesPerView: 'auto',
                spaceBetween: 30,
            }
        }
    });

    // Swiper de Produtos
    const productsSwiper = new Swiper('.products-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: false,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.products-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.products-next',
            prevEl: '.products-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 'auto',
                spaceBetween: 25,
            },
            1024: {
                slidesPerView: 'auto',
                spaceBetween: 30,
            }
        }
    });
});

// Função para rolar suavemente para uma seção específica
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Função para mostrar o modal de sucesso
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Função para animar elementos quando entram na viewport
function animateOnScroll() {
    const elements = document.querySelectorAll('.problem-card, .result-card, .solution-feature');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

// Função para validar e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

