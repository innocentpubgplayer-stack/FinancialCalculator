// Theme Management
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Initialize theme
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        applyTheme(currentTheme);
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (themeToggle) {
            themeToggle.checked = theme === 'dark';
        }
        updateThemeIcon(theme);
    }

    function updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }

    // Mobile menu functionality
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = !nav.classList.contains('active');
            nav.classList.toggle('active');
            this.textContent = isActive ? '✕' : '☰';
            document.body.classList.toggle('menu-open', isActive);
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
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav && nav.classList.contains('active')) {
            const isClickInsideNav = nav.contains(e.target);
            const isClickOnMenuBtn = mobileMenuBtn && mobileMenuBtn.contains(e.target);
            
            if (!isClickInsideNav && !isClickOnMenuBtn) {
                nav.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.textContent = '☰';
                }
                document.body.classList.remove('menu-open');
            }
        }
    });

    // Theme toggle events
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 968) {
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.textContent = '☰';
                }
                document.body.classList.remove('menu-open');
            }
        }
    });

    // Initialize everything
    initTheme();
});

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

// Calculator Functions
function calculateEMI() {
    const principal = parseFloat(document.getElementById('loan-amount').value);
    const annualRate = parseFloat(document.getElementById('interest-rate').value);
    const months = parseInt(document.getElementById('loan-tenure').value);
    
    if (!principal || !annualRate || !months || principal <= 0 || annualRate <= 0 || months <= 0) {
        alert('Please enter valid positive numbers for all fields');
        return;
    }
    
    const monthlyRate = annualRate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    
    document.getElementById('monthly-emi').textContent = formatters.currency.format(emi);
    document.getElementById('total-interest').textContent = formatters.currency.format(totalInterest);
    document.getElementById('total-payment').textContent = formatters.currency.format(totalPayment);
    document.getElementById('emi-result').style.display = 'block';
}

function checkLoanEligibility() {
    const income = parseFloat(document.getElementById('monthly-income').value);
    const expenses = parseFloat(document.getElementById('monthly-expenses').value);
    const existingEMIs = parseFloat(document.getElementById('existing-emis').value) || 0;
    
    if (!income || !expenses || income <= 0 || expenses < 0) {
        alert('Please enter valid numbers for income and expenses');
        return;
    }
    
    if (expenses >= income) {
        alert('Expenses cannot be greater than or equal to income');
        return;
    }
    
    const disposableIncome = income - expenses - existingEMIs;
    let eligibleAmount = 0;
    let eligibilityStatus = 'Not Eligible';
    
    if (disposableIncome > 0) {
        const maxEMI = disposableIncome * 0.5;
        const interestRate = 10;
        const monthlyRate = interestRate / 12 / 100;
        const tenure = 60;
        eligibleAmount = maxEMI * (Math.pow(1 + monthlyRate, tenure) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, tenure));
        
        if (eligibleAmount > 0) {
            eligibilityStatus = 'Eligible';
            if (eligibleAmount > 5000000) {
                eligibleAmount = 5000000;
            }
        }
    }
    
    document.getElementById('eligible-amount').textContent = formatters.currency.format(eligibleAmount);
    document.getElementById('eligibility-status').textContent = eligibilityStatus;
    document.getElementById('eligibility-status').className = eligibilityStatus === 'Eligible' ? 'status-eligible' : 'status-not-eligible';
    document.getElementById('eligibility-result').style.display = 'block';
}

function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById('sip-amount').value);
    const annualReturn = parseFloat(document.getElementById('sip-return').value);
    const years = parseInt(document.getElementById('sip-years').value);
    
    if (!monthlyInvestment || !annualReturn || !years || monthlyInvestment <= 0 || annualReturn < 0 || years <= 0) {
        alert('Please enter valid numbers for all fields');
        return;
    }
    
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = monthlyInvestment * months;
    const totalReturns = futureValue - totalInvestment;
    const returnPercentage = totalInvestment > 0 ? (totalReturns / totalInvestment) * 100 : 0;
    
    document.getElementById('sip-future-value').textContent = formatters.currency.format(futureValue);
    document.getElementById('sip-total-investment').textContent = formatters.currency.format(totalInvestment);
    document.getElementById('sip-total-returns').textContent = formatters.currency.format(totalReturns);
    document.getElementById('sip-return-percentage').textContent = formatters.percent.format(returnPercentage / 100);
    document.getElementById('sip-result').style.display = 'block';
}

function calculateGST() {
    const amount = parseFloat(document.getElementById('gst-amount').value);
    const gstRate = parseFloat(document.getElementById('gst-rate').value);
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    const gstAmount = (amount * gstRate) / 100;
    const totalAmount = amount + gstAmount;
    
    document.getElementById('gst-tax-amount').textContent = formatters.currency.format(gstAmount);
    document.getElementById('gst-total-amount').textContent = formatters.currency.format(totalAmount);
    document.getElementById('gst-result').style.display = 'block';
}

function calculateFD() {
    const depositType = document.getElementById('deposit-type').value;
    const principal = parseFloat(document.getElementById('principal-amount').value);
    const annualRate = parseFloat(document.getElementById('interest-rate-fd').value);
    const years = parseFloat(document.getElementById('tenure-fd').value);
    
    if (!principal || !annualRate || !years || principal <= 0 || annualRate <= 0 || years <= 0) {
        alert('Please enter valid numbers for all fields');
        return;
    }
    
    let maturityAmount = 0;
    let totalInvestment = 0;
    
    if (depositType === 'fd') {
        const quarterlyRate = annualRate / 100 / 4;
        const quarters = years * 4;
        maturityAmount = principal * Math.pow(1 + quarterlyRate, quarters);
        totalInvestment = principal;
    } else {
        const monthlyRate = annualRate / 100 / 12;
        const months = years * 12;
        totalInvestment = principal * months;
        maturityAmount = principal * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }
    
    const totalInterest = maturityAmount - totalInvestment;
    const effectiveRate = (Math.pow(maturityAmount / totalInvestment, 1/years) - 1) * 100;
    
    document.getElementById('maturity-amount').textContent = formatters.currency.format(maturityAmount);
    document.getElementById('total-interest-fd').textContent = formatters.currency.format(totalInterest);
    document.getElementById('total-investment-fd').textContent = formatters.currency.format(totalInvestment);
    document.getElementById('effective-rate').textContent = formatters.percent.format(effectiveRate / 100);
    document.getElementById('fd-result').style.display = 'block';
}

function calculateTax() {
    const income = parseFloat(document.getElementById('annual-income').value);
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;

    if (!income || income < 0) {
        alert('Please enter a valid annual income');
        return;
    }

    const taxableIncome = Math.max(0, income - deductions);
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

    // Rebate under Section 87A
    if (taxableIncome <= 700000) {
        tax = 0;
    }

    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const effectiveTaxRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;

    document.getElementById('taxable-income').textContent = formatters.currency.format(taxableIncome);
    document.getElementById('income-tax').textContent = formatters.currency.format(tax);
    document.getElementById('cess-amount').textContent = formatters.currency.format(cess);
    document.getElementById('total-tax').textContent = formatters.currency.format(totalTax);
    document.getElementById('effective-tax-rate').textContent = formatters.percent.format(effectiveTaxRate / 100);
    document.getElementById('tax-result').style.display = 'block';
}

function calculateSavings() {
    const goal = parseFloat(document.getElementById('savings-goal').value);
    const current = parseFloat(document.getElementById('current-savings').value) || 0;
    const monthly = parseFloat(document.getElementById('monthly-saving').value);
    const annualReturn = parseFloat(document.getElementById('expected-return').value) || 6;
    
    if (!goal || goal <= 0) {
        alert('Please enter a valid savings goal');
        return;
    }
    
    if (current > goal) {
        alert('Current savings already exceed your goal!');
        return;
    }
    
    const needed = Math.max(0, goal - current);
    const progressPercent = current > 0 ? Math.min(100, (current / goal) * 100) : 0;
    
    const monthlyRate = annualReturn / 100 / 12;
    let months = 0;
    let futureValue = current;
    
    if (monthly > 0) {
        while (futureValue < goal && months < 600) {
            months++;
            futureValue = futureValue * (1 + monthlyRate) + monthly;
        }
    } else {
        if (current > 0 && annualReturn > 0) {
            months = Math.log(goal / current) / Math.log(1 + monthlyRate);
        } else {
            months = needed > 0 ? Infinity : 0;
        }
    }
    
    const years = Math.ceil(months / 12);
    
    document.getElementById('amount-needed').textContent = formatters.currency.format(needed);
    document.getElementById('progress-percent').textContent = formatters.number.format(progressPercent) + '%';
    document.getElementById('time-to-goal').textContent = months < 600 ? 
        `${Math.ceil(months)} months (${years} years)` : 'More than 50 years';
    document.getElementById('future-value').textContent = formatters.currency.format(futureValue);
    document.getElementById('savings-result').style.display = 'block';
}

// Add CSS for status classes
const style = document.createElement('style');
style.textContent = `
    .status-eligible {
        color: #10b981;
        font-weight: bold;
    }
    
    .status-not-eligible {
        color: #ef4444;
        font-weight: bold;
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.calculateEMI = calculateEMI;
window.checkLoanEligibility = checkLoanEligibility;
window.calculateSIP = calculateSIP;
window.calculateGST = calculateGST;
window.calculateFD = calculateFD;
window.calculateTax = calculateTax;
window.calculateSavings = calculateSavings;
