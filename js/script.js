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
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleSwitch(theme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
    }

    updateToggleSwitch(theme) {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.checked = theme === 'dark';
        }
        
        // Update theme icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }

    setupEventListeners() {
        // Theme toggle switch
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                this.toggleTheme();
            });
        }

        // Theme toggle button (alternative)
        const themeButton = document.getElementById('theme-button');
        if (themeButton) {
            themeButton.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const themeManager = new ThemeManager();
    
    // Mobile menu functionality
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Close mobile menu when clicking on links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.textContent = '☰';
                }
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            e.target !== mobileMenuBtn) {
            nav.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.textContent = '☰';
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to current section in viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe calculator sections
    document.querySelectorAll('.calculator').forEach(section => {
        observer.observe(section);
    });
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
    
    document.getElementById('monthly-emi').textContent = '₹' + emi.toFixed(2);
    document.getElementById('total-interest').textContent = '₹' + totalInterest.toFixed(2);
    document.getElementById('total-payment').textContent = '₹' + totalPayment.toFixed(2);
    document.getElementById('emi-result').style.display = 'block';
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
    
    document.getElementById('eligible-amount').textContent = '₹' + Math.round(eligibleAmount);
    document.getElementById('eligibility-status').textContent = eligibilityStatus;
    document.getElementById('recommended-tenure').textContent = recommendedTenure;
    document.getElementById('eligibility-result').style.display = 'block';
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
    
    document.getElementById('sip-future-value').textContent = '₹' + Math.round(futureValue);
    document.getElementById('sip-total-investment').textContent = '₹' + totalInvestment;
    document.getElementById('sip-total-returns').textContent = '₹' + Math.round(totalReturns);
    document.getElementById('sip-result').style.display = 'block';
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
    
    document.getElementById('gst-tax-amount').textContent = '₹' + gstAmount.toFixed(2);
    document.getElementById('gst-total-amount').textContent = '₹' + totalAmount.toFixed(2);
    document.getElementById('gst-result').style.display = 'block';
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
    
    document.getElementById('maturity-amount').textContent = '₹' + Math.round(maturityAmount).toLocaleString();
    document.getElementById('total-interest-fd').textContent = '₹' + Math.round(totalInterest).toLocaleString();
    document.getElementById('total-investment').textContent = '₹' + Math.round(totalInvestment).toLocaleString();
    document.getElementById('fd-result').style.display = 'block';
}

// Income Tax Calculator Function
function calculateTax() {
    const income = parseFloat(document.getElementById('annual-income').value);
    const ageGroup = document.getElementById('age-group').value;
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;
    
    if (isNaN(income)) {
        alert('Please enter valid annual income');
        return;
    }
    
    // Calculate taxable income
    const taxableIncome = Math.max(0, income - deductions);
    
    // Set basic exemption limit based on age
    let exemptionLimit = 250000; // Below 60
    if (ageGroup === '60-80') exemptionLimit = 300000;
    if (ageGroup === 'above-80') exemptionLimit = 500000;
    
    const incomeAfterExemption = Math.max(0, taxableIncome - exemptionLimit);
    
    // Calculate tax as per slabs
    let tax = 0;
    
    if (incomeAfterExemption > 0) {
        // 0-2.5L already exempted, calculate from 2.5L onwards
        const slab1 = Math.min(incomeAfterExemption, 250000);
        const slab2 = Math.min(Math.max(incomeAfterExemption - 250000, 0), 250000);
        const slab3 = Math.max(incomeAfterExemption - 500000, 0);
        
        tax = (slab1 * 0) + (slab2 * 0.05) + (slab3 * 0.20);
        
        // For income above 10L, additional 30% on excess
        if (incomeAfterExemption > 1000000) {
            const slab4 = incomeAfterExemption - 1000000;
            tax += slab4 * 0.30;
        }
    }
    
    // Apply rebate under Section 87A if applicable
    if (taxableIncome <= 500000) {
        tax = Math.max(0, tax - 12500);
    }
    
    const cess = tax * 0.04; // Health and education cess
    const totalTax = tax + cess;
    
    document.getElementById('taxable-income').textContent = '₹' + Math.round(taxableIncome).toLocaleString();
    document.getElementById('income-tax').textContent = '₹' + Math.round(tax).toLocaleString();
    document.getElementById('cess-amount').textContent = '₹' + Math.round(cess).toLocaleString();
    document.getElementById('total-tax').textContent = '₹' + Math.round(totalTax).toLocaleString();
    document.getElementById('tax-result').style.display = 'block';
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
    
    document.getElementById('amount-needed').textContent = '₹' + Math.round(needed).toLocaleString();
    document.getElementById('progress-percent').textContent = progressPercent.toFixed(1) + '%';
    document.getElementById('time-to-goal').textContent = months < 600 ? `${Math.ceil(months)} months (${years} years)` : 'More than 50 years';
    document.getElementById('future-value').textContent = '₹' + Math.round(futureValue).toLocaleString();
    document.getElementById('savings-result').style.display = 'block';
}

// Contact Form Handler
function handleContactForm(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}
