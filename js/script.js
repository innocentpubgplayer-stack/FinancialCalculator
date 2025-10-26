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
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
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
            });
        }
    });

    // Initialize smooth scrolling
    initSmoothScroll();

    // Add active class to current section in viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
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

    // Observe calculator sections
    document.querySelectorAll('.calculator').forEach(section => {
        observer.observe(section);
    });

    // Debounced resize handler (if needed in future)
    window.addEventListener('resize', debounce(() => {
        // Handle resize events efficiently
        if (nav && nav.classList.contains('active')) {
            requestAnimationFrame(() => {
                nav.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.textContent = '☰';
                }
            });
        }
    }, 250));
});

// Calculator Functions

// EMI Calculator Function
function calculateEMI() {
    const principal = parseFloat(document.getElementById('loan-amount').value);
    const annualRate = parseFloat(document.getElementById('interest-rate').value);
    const months = parseInt(document.getElementById('loan-tenure').value);
    
    if (isNaN(principal) || isNaN(annualRate) || isNaN(months)) {
        alert('Please enter valid numbers for all fields');
        return;
    }
    
    const monthlyRate = annualRate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        document.getElementById('monthly-emi').textContent = '₹' + emi.toFixed(2);
        document.getElementById('total-interest').textContent = '₹' + totalInterest.toFixed(2);
        document.getElementById('total-payment').textContent = '₹' + totalPayment.toFixed(2);
        document.getElementById('emi-result').style.display = 'block';
    });
}

// Loan Eligibility Checker Function
function checkLoanEligibility() {
    const income = parseFloat(document.getElementById('monthly-income').value);
    const expenses = parseFloat(document.getElementById('monthly-expenses').value);
    const existingEMIs = parseFloat(document.getElementById('existing-emis').value) || 0;
    const loanType = document.getElementById('loan-type').value;
    
    if (isNaN(income) || isNaN(expenses)) {
        alert('Please enter valid numbers for income and expenses');
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
        }
    }
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        document.getElementById('eligible-amount').textContent = '₹' + Math.round(eligibleAmount);
        document.getElementById('eligibility-status').textContent = eligibilityStatus;
        document.getElementById('recommended-tenure').textContent = recommendedTenure;
        document.getElementById('eligibility-result').style.display = 'block';
    });
}

// SIP Calculator Function
function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById('sip-amount').value);
    const annualReturn = parseFloat(document.getElementById('sip-return').value);
    const years = parseInt(document.getElementById('sip-years').value);
    
    if (isNaN(monthlyInvestment) || isNaN(annualReturn) || isNaN(years)) {
        alert('Please enter valid numbers for all fields');
        return;
    }
    
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;
    const futureValue = monthlyInvestment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
    const totalInvestment = monthlyInvestment * months;
    const totalReturns = futureValue - totalInvestment;
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        document.getElementById('sip-future-value').textContent = '₹' + Math.round(futureValue);
        document.getElementById('sip-total-investment').textContent = '₹' + totalInvestment;
        document.getElementById('sip-total-returns').textContent = '₹' + Math.round(totalReturns);
        document.getElementById('sip-result').style.display = 'block';
    });
}

// GST Calculator Function
function calculateGST() {
    const amount = parseFloat(document.getElementById('gst-amount').value);
    const gstRate = parseFloat(document.getElementById('gst-rate').value);
    
    if (isNaN(amount) || isNaN(gstRate)) {
        alert('Please enter valid numbers for all fields');
        return;
    }
    
    const gstAmount = (amount * gstRate) / 100;
    const totalAmount = amount + gstAmount;
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        document.getElementById('gst-tax-amount').textContent = '₹' + gstAmount.toFixed(2);
        document.getElementById('gst-total-amount').textContent = '₹' + totalAmount.toFixed(2);
        document.getElementById('gst-result').style.display = 'block';
    });
}

// FD/RD Calculator Function
function calculateFD() {
    const depositType = document.getElementById('deposit-type').value;
    const principal = parseFloat(document.getElementById('principal-amount').value);
    const annualRate = parseFloat(document.getElementById('interest-rate-fd').value);
    const years = parseFloat(document.getElementById('tenure-fd').value);
    
    if (isNaN(principal) || isNaN(annualRate) || isNaN(years)) {
        alert('Please enter valid numbers for all fields');
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
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        document.getElementById('maturity-amount').textContent = '₹' + Math.round(maturityAmount).toLocaleString();
        document.getElementById('total-interest-fd').textContent = '₹' + Math.round(totalInterest).toLocaleString();
        document.getElementById('total-investment').textContent = '₹' + Math.round(totalInvestment).toLocaleString();
        document.getElementById('fd-result').style.display = 'block';
    });
}

// Income Tax Calculator Function (New Regime FY 2025–26)
function calculateTax() {
    const income = parseFloat(document.getElementById('annual-income').value);
    const ageGroup = document.getElementById('age-group').value;
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;

    if (isNaN(income)) {
        alert('Please enter a valid annual income');
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

    // Batch DOM updates
    requestAnimationFrame(() => {
        document.getElementById('taxable-income').textContent = '₹' + Math.round(taxableIncome).toLocaleString();
        document.getElementById('income-tax').textContent = '₹' + Math.round(tax).toLocaleString();
        document.getElementById('cess-amount').textContent = '₹' + Math.round(cess).toLocaleString();
        document.getElementById('total-tax').textContent = '₹' + Math.round(totalTax).toLocaleString();
        document.getElementById('tax-result').style.display = 'block';
    });
}

// Savings Goal Tracker Function
function calculateSavings() {
    const goal = parseFloat(document.getElementById('savings-goal').value);
    const current = parseFloat(document.getElementById('current-savings').value) || 0;
    const monthly = parseFloat(document.getElementById('monthly-saving').value);
    const annualReturn = parseFloat(document.getElementById('expected-return').value) || 6;
    
    if (isNaN(goal) || isNaN(monthly)) {
        alert('Please enter valid savings goal and monthly saving amount');
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
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        document.getElementById('amount-needed').textContent = '₹' + Math.round(needed).toLocaleString();
        document.getElementById('progress-percent').textContent = progressPercent.toFixed(1) + '%';
        document.getElementById('time-to-goal').textContent = months < 600 ? `${Math.ceil(months)} months (${years} years)` : 'More than 50 years';
        document.getElementById('future-value').textContent = '₹' + Math.round(futureValue).toLocaleString();
        document.getElementById('savings-result').style.display = 'block';
    });
}

// Contact Form Handler
function handleContactForm(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}
