// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    applyTheme(theme) {
        // Batch DOM updates
        requestAnimationFrame(() => {
            document.documentElement.setAttribute('data-theme', theme);
            this.updateToggleSwitch(theme);
        });
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    updateToggleSwitch(theme) {
        const toggle = document.getElementById('theme-toggle');
        const themeIcon = document.querySelector('.theme-icon');
        
        // Batch DOM updates
        if (toggle) {
            toggle.checked = theme === 'dark';
        }
        
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeButton = document.getElementById('theme-button');

        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                this.toggleTheme();
            });
        }

        if (themeButton) {
            themeButton.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
}

// Enhanced Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                smoothScrollTo(targetElement);
            }
        });
    });
}

function smoothScrollTo(targetElement) {
    // More reliable position calculation without forced reflow
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 100;
    
    // Use native smooth scroll if available
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // Fallback for older browsers
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        // Easing function for smooth animation
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
}

// Debounce utility for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Formatters for numbers
const formatters = {
    currency: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }),
    
    number: new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }),
    
    percent: new Intl.NumberFormat('en-IN', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    })
};

// Input validation utilities
const validators = {
    isPositiveNumber: (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num > 0;
    },
    
    isNonNegativeNumber: (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0;
    },
    
    isValidPercentage: (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0 && num <= 100;
    }
};

// Animation utilities
const animations = {
    fadeIn: (element) => {
        requestAnimationFrame(() => {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            requestAnimationFrame(() => {
                element.style.transition = 'opacity 0.3s ease';
                element.style.opacity = '1';
            });
        });
    },
    
    slideDown: (element) => {
        requestAnimationFrame(() => {
            element.style.display = 'block';
            element.classList.add('show');
        });
    }
};

// Mobile menu toggle and main initialization
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const themeManager = new ThemeManager();
    
    // Mobile menu functionality
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            // Batch DOM updates
            requestAnimationFrame(() => {
                const isActive = !nav.classList.contains('active');
                nav.classList.toggle('active');
                this.textContent = isActive ? '✕' : '☰';
                
                // Prevent body scroll when menu is open
                document.body.style.overflow = isActive ? 'hidden' : '';
            });
        });
    }

    // Close mobile menu when clicking on links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav && nav.classList.contains('active')) {
                requestAnimationFrame(() => {
                    nav.classList.remove('active');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.textContent = '☰';
                    }
                    document.body.style.overflow = '';
                });
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            e.target !== mobileMenuBtn) {
            requestAnimationFrame(() => {
                nav.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.textContent = '☰';
                }
                document.body.style.overflow = '';
            });
        }
    });

    // Initialize smooth scrolling
    initSmoothScroll();

    // Add active class to current section in viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('in-view');
                });
            }
        });
    }, observerOptions);

    // Observe calculator sections and other elements
    document.querySelectorAll('.calculator, .tool-card, .tool-description').forEach(section => {
        observer.observe(section);
    });

    // Add loading animation to tools grid
    const toolsGrid = document.querySelector('.tools-grid');
    if (toolsGrid) {
        const toolCards = toolsGrid.querySelectorAll('.tool-card');
        toolCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Debounced resize handler
    window.addEventListener('resize', debounce(() => {
        // Handle resize events efficiently
        if (nav && nav.classList.contains('active')) {
            requestAnimationFrame(() => {
                nav.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.textContent = '☰';
                }
                document.body.style.overflow = '';
            });
        }
    }, 250));

    // Add input auto-formatting
    initInputFormatting();

    // Ensure all calculator buttons are properly connected
    initCalculatorEventListeners();
});

// Initialize calculator event listeners
function initCalculatorEventListeners() {
    // SIP Calculator
    const sipButton = document.querySelector('button[onclick="calculateSIP()"]');
    if (sipButton) {
        sipButton.addEventListener('click', calculateSIP);
    }

    // EMI Calculator
    const emiButton = document.querySelector('button[onclick="calculateEMI()"]');
    if (emiButton) {
        emiButton.addEventListener('click', calculateEMI);
    }

    // Other calculator buttons...
}

// Input formatting and validation
function initInputFormatting() {
    // Format currency inputs on blur
    document.querySelectorAll('input[data-type="currency"]').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && validators.isPositiveNumber(this.value)) {
                this.value = formatters.number.format(parseFloat(this.value));
            }
        });
        
        input.addEventListener('focus', function() {
            this.value = this.value.replace(/[^\d.]/g, '');
        });
    });

    // Format percentage inputs
    document.querySelectorAll('input[data-type="percentage"]').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && validators.isValidPercentage(this.value)) {
                this.value = parseFloat(this.value).toFixed(1);
            }
        });
    });
}

// Calculator Functions with enhanced validation and formatting

// EMI Calculator Function
function calculateEMI() {
    const principal = parseFloat(document.getElementById('loan-amount').value);
    const annualRate = parseFloat(document.getElementById('interest-rate').value);
    const months = parseInt(document.getElementById('loan-tenure').value);
    
    // Enhanced validation
    if (!validators.isPositiveNumber(principal) || 
        !validators.isPositiveNumber(annualRate) || 
        !validators.isPositiveNumber(months)) {
        showError('Please enter valid positive numbers for all fields');
        return;
    }
    
    if (months > 360) {
        showError('Loan tenure cannot exceed 30 years (360 months)');
        return;
    }
    
    const monthlyRate = annualRate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    
    // Batch DOM updates with animation
    requestAnimationFrame(() => {
        document.getElementById('monthly-emi').textContent = formatters.currency.format(emi);
        document.getElementById('total-interest').textContent = formatters.currency.format(totalInterest);
        document.getElementById('total-payment').textContent = formatters.currency.format(totalPayment);
        animations.slideDown(document.getElementById('emi-result'));
    });
}

// Loan Eligibility Checker Function
function checkLoanEligibility() {
    const income = parseFloat(document.getElementById('monthly-income').value);
    const expenses = parseFloat(document.getElementById('monthly-expenses').value);
    const existingEMIs = parseFloat(document.getElementById('existing-emis').value) || 0;
    const loanType = document.getElementById('loan-type').value;
    
    if (!validators.isPositiveNumber(income) || !validators.isNonNegativeNumber(expenses)) {
        showError('Please enter valid numbers for income and expenses');
        return;
    }
    
    if (expenses >= income) {
        showError('Expenses cannot be greater than or equal to income');
        return;
    }
    
    // Simple eligibility calculation
    const disposableIncome = income - expenses - existingEMIs;
    let eligibleAmount = 0;
    let eligibilityStatus = 'Not Eligible';
    let recommendedTenure = '0 years';
    
    if (disposableIncome > 0) {
        // Assume maximum EMI is 50% of disposable income
        const maxEMI = disposableIncome * 0.5;
        
        // Calculate eligible loan amount based on loan type and assumed interest rate
        let interestRate;
        switch(loanType) {
            case 'home': interestRate = 8.5; break;
            case 'personal': interestRate = 12; break;
            case 'car': interestRate = 9.5; break;
            case 'education': interestRate = 10; break;
            default: interestRate = 10;
        }
        
        const monthlyRate = interestRate / 12 / 100;
        // Assuming 5 years (60 months) tenure for calculation
        const tenure = 60;
        eligibleAmount = maxEMI * (Math.pow(1 + monthlyRate, tenure) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, tenure));
        
        if (eligibleAmount > 0) {
            eligibilityStatus = 'Eligible';
            recommendedTenure = '5 years';
            
            // Cap eligible amount at reasonable limit
            if (eligibleAmount > 5000000) {
                eligibleAmount = 5000000;
            }
        }
    }
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        document.getElementById('eligible-amount').textContent = formatters.currency.format(eligibleAmount);
        document.getElementById('eligibility-status').textContent = eligibilityStatus;
        document.getElementById('eligibility-status').className = eligibilityStatus === 'Eligible' ? 'status-eligible' : 'status-not-eligible';
        document.getElementById('recommended-tenure').textContent = recommendedTenure;
        animations.slideDown(document.getElementById('eligibility-result'));
    });
}

// CORRECTED SIP Calculator Function
function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById('sip-amount').value);
    const annualReturn = parseFloat(document.getElementById('sip-return').value);
    const years = parseInt(document.getElementById('sip-years').value);
    
    console.log('SIP Inputs:', { monthlyInvestment, annualReturn, years }); // Debug log
    
    // Enhanced validation
    if (!validators.isPositiveNumber(monthlyInvestment) || 
        !validators.isNonNegativeNumber(annualReturn) || 
        !validators.isPositiveNumber(years)) {
        showError('Please enter valid numbers for all fields');
        return;
    }
    
    if (years > 50) {
        showError('Investment period cannot exceed 50 years');
        return;
    }
    
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;
    
    // Correct SIP formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = monthlyInvestment * months;
    const totalReturns = futureValue - totalInvestment;
    const returnPercentage = totalInvestment > 0 ? (totalReturns / totalInvestment) * 100 : 0;
    
    console.log('SIP Results:', { futureValue, totalInvestment, totalReturns, returnPercentage }); // Debug log
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        const futureValueElement = document.getElementById('sip-future-value');
        const totalInvestmentElement = document.getElementById('sip-total-investment');
        const totalReturnsElement = document.getElementById('sip-total-returns');
        const returnPercentageElement = document.getElementById('sip-return-percentage');
        const resultElement = document.getElementById('sip-result');
        
        if (futureValueElement) futureValueElement.textContent = formatters.currency.format(futureValue);
        if (totalInvestmentElement) totalInvestmentElement.textContent = formatters.currency.format(totalInvestment);
        if (totalReturnsElement) totalReturnsElement.textContent = formatters.currency.format(totalReturns);
        if (returnPercentageElement) returnPercentageElement.textContent = formatters.percent.format(returnPercentage / 100);
        if (resultElement) animations.slideDown(resultElement);
    });
}

// GST Calculator Function
function calculateGST() {
    const amount = parseFloat(document.getElementById('gst-amount').value);
    const gstRate = parseFloat(document.getElementById('gst-rate').value);
    
    if (!validators.isPositiveNumber(amount) || !validators.isNonNegativeNumber(gstRate)) {
        showError('Please enter valid numbers for all fields');
        return;
    }
    
    const gstAmount = (amount * gstRate) / 100;
    const totalAmount = amount + gstAmount;
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        document.getElementById('gst-tax-amount').textContent = formatters.currency.format(gstAmount);
        document.getElementById('gst-total-amount').textContent = formatters.currency.format(totalAmount);
        animations.slideDown(document.getElementById('gst-result'));
    });
}

// FD/RD Calculator Function
function calculateFD() {
    const depositType = document.getElementById('deposit-type').value;
    const principal = parseFloat(document.getElementById('principal-amount').value);
    const annualRate = parseFloat(document.getElementById('interest-rate-fd').value);
    const years = parseFloat(document.getElementById('tenure-fd').value);
    
    if (!validators.isPositiveNumber(principal) || 
        !validators.isPositiveNumber(annualRate) || 
        !validators.isPositiveNumber(years)) {
        showError('Please enter valid numbers for all fields');
        return;
    }
    
    if (years > 30) {
        showError('Tenure cannot exceed 30 years');
        return;
    }
    
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    let maturityAmount = 0;
    let totalInvestment = 0;
    
    if (depositType === 'fd') {
        // FD calculation (compound interest quarterly)
        const quarterlyRate = annualRate / 100 / 4;
        const quarters = years * 4;
        maturityAmount = principal * Math.pow(1 + quarterlyRate, quarters);
        totalInvestment = principal;
    } else {
        // RD calculation
        totalInvestment = principal * months;
        maturityAmount = principal * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    }
    
    const totalInterest = maturityAmount - totalInvestment;
    const effectiveRate = (Math.pow(maturityAmount / totalInvestment, 1/years) - 1) * 100;
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        document.getElementById('maturity-amount').textContent = formatters.currency.format(maturityAmount);
        document.getElementById('total-interest-fd').textContent = formatters.currency.format(totalInterest);
        document.getElementById('total-investment').textContent = formatters.currency.format(totalInvestment);
        document.getElementById('effective-rate').textContent = formatters.percent.format(effectiveRate / 100);
        animations.slideDown(document.getElementById('fd-result'));
    });
}

// Income Tax Calculator Function (New Regime FY 2025–26)
function calculateTax() {
    const income = parseFloat(document.getElementById('annual-income').value);
    const ageGroup = document.getElementById('age-group').value;
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;

    if (!validators.isNonNegativeNumber(income)) {
        showError('Please enter a valid annual income');
        return;
    }

    // Under the New Regime, deductions are mostly not applicable
    const taxableIncome = Math.max(0, income);

    let tax = 0;

    // New Regime Slabs (FY 2025–26)
    if (taxableIncome <= 300000) {
        tax = 0;
    } else if (taxableIncome <= 600000) {
        tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 900000) {
        tax = (300000 * 0.05) + (taxableIncome - 600000) * 0.10;
    } else if (taxableIncome <= 1200000) {
        tax = (300000 * 0.05) + (300000 * 0.10) + (taxableIncome - 900000) * 0.15;
    } else if (taxableIncome <= 1500000) {
        tax = (300000 * 0.05) + (300000 * 0.10) + (300000 * 0.15) + (taxableIncome - 1200000) * 0.20;
    } else {
        tax = (300000 * 0.05) + (300000 * 0.10) + (300000 * 0.15) + (300000 * 0.20) + (taxableIncome - 1500000) * 0.30;
    }

    // Rebate under Section 87A — full rebate if income ≤ ₹7,00,000
    if (taxableIncome <= 700000) {
        tax = 0;
    }

    // Health & Education Cess (4%)
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const effectiveTaxRate = (totalTax / taxableIncome) * 100;

    // Display Results
    requestAnimationFrame(() => {
        document.getElementById('taxable-income').textContent = formatters.currency.format(taxableIncome);
        document.getElementById('income-tax').textContent = formatters.currency.format(tax);
        document.getElementById('cess-amount').textContent = formatters.currency.format(cess);
        document.getElementById('total-tax').textContent = formatters.currency.format(totalTax);
        document.getElementById('effective-tax-rate').textContent = formatters.percent.format(effectiveTaxRate / 100);
        animations.slideDown(document.getElementById('tax-result'));
    });
}

// Savings Goal Tracker Function
function calculateSavings() {
    const goal = parseFloat(document.getElementById('savings-goal').value);
    const current = parseFloat(document.getElementById('current-savings').value) || 0;
    const monthly = parseFloat(document.getElementById('monthly-saving').value);
    const annualReturn = parseFloat(document.getElementById('expected-return').value) || 6;
    
    if (!validators.isPositiveNumber(goal) || !validators.isNonNegativeNumber(monthly)) {
        alert('Please enter valid savings goal and monthly saving amount');
        return;
    }
    
    if (current > goal) {
        showError('Current savings already exceed your goal!');
        return;
    }
    
    const needed = Math.max(0, goal - current);
    const progressPercent = current > 0 ? Math.min(100, (current / goal) * 100) : 0;
    
    // Calculate time to reach goal with compound interest
    const monthlyRate = annualReturn / 100 / 12;
    let months = 0;
    let futureValue = current;
    
    if (monthly > 0) {
        // Using formula for future value of series with compound interest
        while (futureValue < goal && months < 600) { // Max 50 years
            months++;
            futureValue = futureValue * (1 + monthlyRate) + monthly;
        }
    } else {
        // Without monthly contributions
        if (current > 0 && annualReturn > 0) {
            months = Math.log(goal / current) / Math.log(1 + monthlyRate);
        } else {
            months = needed > 0 ? Infinity : 0;
        }
    }
    
    const years = Math.ceil(months / 12);
    
    // Update progress bar if exists
    const progressBar = document.getElementById('savings-progress-bar');
    if (progressBar) {
        progressBar.style.width = progressPercent + '%';
    }
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        document.getElementById('amount-needed').textContent = formatters.currency.format(needed);
        document.getElementById('progress-percent').textContent = formatters.number.format(progressPercent) + '%';
        document.getElementById('time-to-goal').textContent = months < 600 ? 
            `${Math.ceil(months)} months (${years} years)` : 'More than 50 years';
        document.getElementById('future-value').textContent = formatters.currency.format(futureValue);
        animations.slideDown(document.getElementById('savings-result'));
    });
}

// Error handling utility
function showError(message) {
    // Create or show error message
    let errorDiv = document.getElementById('calculator-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'calculator-error';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            errorDiv.style.display = 'none';
            errorDiv.style.opacity = '1';
        }, 300);
    }, 5000);
}

// Contact Form Handler with validation
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !message) {
        showError('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Show success message
    showSuccess('Thank you for your message! We will get back to you soon.');
    form.reset();
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Success message
function showSuccess(message) {
    let successDiv = document.getElementById('calculator-success');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.id = 'calculator-success';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(successDiv);
    }
    
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            successDiv.style.display = 'none';
            successDiv.style.opacity = '1';
        }, 300);
    }, 5000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .status-eligible {
        color: #10b981;
        font-weight: bold;
    }
    
    .status-not-eligible {
        color: #ef4444;
        font-weight: bold;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background-color: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
        margin: 10px 0;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--secondary), var(--accent));
        transition: width 0.3s ease;
    }
    
    .calculator-loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .calculator-result {
        display: none;
    }
    
    .calculator-result.show {
        display: block;
    }
`;
document.head.appendChild(style);

// Test function for SIP calculator
function testSIPCalculation() {
    // Test with known values: ₹10,000 monthly, 12% annual return, 10 years
    const monthlyInvestment = 10000;
    const annualReturn = 12;
    const years = 10;
    
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    
    console.log('SIP Test Calculation:');
    console.log('Monthly Investment:', monthlyInvestment);
    console.log('Annual Return:', annualReturn + '%');
    console.log('Years:', years);
    console.log('Future Value:', formatters.currency.format(futureValue));
    console.log('Expected (approx): ₹23,00,000');
}

// Export functions for global access
window.calculateEMI = calculateEMI;
window.checkLoanEligibility = checkLoanEligibility;
window.calculateSIP = calculateSIP;
window.calculateGST = calculateGST;
window.calculateFD = calculateFD;
window.calculateTax = calculateTax;
window.calculateSavings = calculateSavings;
window.handleContactForm = handleContactForm;
window.testSIPCalculation = testSIPCalculation;
