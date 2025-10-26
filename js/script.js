// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.checked = currentTheme === 'dark';
    
    // Update theme icon based on current theme
    updateThemeIcon(currentTheme);
    
    // Theme toggle event
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    // Function to update theme icon
    function updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const body = document.body;
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
            nav.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
});

// EMI Calculator
function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loan-amount').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value);
    const loanTenure = parseFloat(document.getElementById('loan-tenure').value);
    
    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTenure)) {
        alert('Please enter valid numbers for all fields');
        return;
    }
    
    const monthlyInterestRate = interestRate / 12 / 100;
    const emi = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenure) / 
                (Math.pow(1 + monthlyInterestRate, loanTenure) - 1);
    const totalPayment = emi * loanTenure;
    const totalInterest = totalPayment - loanAmount;
    
    document.getElementById('monthly-emi').textContent = '₹' + emi.toFixed(2);
    document.getElementById('total-interest').textContent = '₹' + totalInterest.toFixed(2);
    document.getElementById('total-payment').textContent = '₹' + totalPayment.toFixed(2);
    
    document.getElementById('emi-result').classList.add('show');
}

// Loan Eligibility Checker
function checkLoanEligibility() {
    const monthlyIncome = parseFloat(document.getElementById('monthly-income').value);
    const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value);
    const existingEMIs = parseFloat(document.getElementById('existing-emis').value) || 0;
    const loanType = document.getElementById('loan-type').value;
    
    if (isNaN(monthlyIncome) || isNaN(monthlyExpenses)) {
        alert('Please enter valid numbers for income and expenses');
        return;
    }
    
    const disposableIncome = monthlyIncome - monthlyExpenses - existingEMIs;
    let eligibleAmount = 0;
    let eligibilityStatus = 'Not Eligible';
    let recommendedTenure = '0 years';
    
    if (disposableIncome > 0) {
        const maxEMI = disposableIncome * 0.5; // 50% of disposable income
        let interestRate;
        
        switch(loanType) {
            case 'home':
                interestRate = 8.5;
                recommendedTenure = '20 years';
                break;
            case 'personal':
                interestRate = 12;
                recommendedTenure = '5 years';
                break;
            case 'car':
                interestRate = 9;
                recommendedTenure = '7 years';
                break;
            case 'education':
                interestRate = 10;
                recommendedTenure = '10 years';
                break;
            default:
                interestRate = 10;
        }
        
        const monthlyRate = interestRate / 12 / 100;
        const tenureMonths = parseInt(recommendedTenure) * 12;
        
        eligibleAmount = maxEMI * (Math.pow(1 + monthlyRate, tenureMonths) - 1) / 
                        (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));
        
        if (eligibleAmount > 0) {
            eligibilityStatus = 'Eligible';
        }
    }
    
    document.getElementById('eligible-amount').textContent = '₹' + eligibleAmount.toFixed(2);
    document.getElementById('eligibility-status').textContent = eligibilityStatus;
    document.getElementById('recommended-tenure').textContent = recommendedTenure;
    
    document.getElementById('eligibility-result').classList.add('show');
}

// SIP Calculator
function calculateSIP() {
    const sipAmount = parseFloat(document.getElementById('sip-amount').value);
    const expectedReturn = parseFloat(document.getElementById('sip-return').value);
    const years = parseFloat(document.getElementById('sip-years').value);
    
    if (isNaN(sipAmount) || isNaN(expectedReturn) || isNaN(years)) {
        alert('Please enter valid numbers for all fields');
        return;
    }
    
    const monthlyRate = expectedReturn / 12 / 100;
    const months = years * 12;
    const futureValue = sipAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
    const totalInvestment = sipAmount * months;
    const totalReturns = futureValue - totalInvestment;
    const returnPercentage = (totalReturns / totalInvestment) * 100;
    
    document.getElementById('sip-future-value').textContent = '₹' + futureValue.toFixed(2);
    document.getElementById('sip-total-investment').textContent = '₹' + totalInvestment.toFixed(2);
    document.getElementById('sip-total-returns').textContent = '₹' + totalReturns.toFixed(2);
    document.getElementById('sip-return-percentage').textContent = returnPercentage.toFixed(2) + '%';
    
    document.getElementById('sip-result').classList.add('show');
}

// GST Calculator
function calculateGST() {
    const amount = parseFloat(document.getElementById('gst-amount').value);
    const gstRate = parseFloat(document.getElementById('gst-rate').value);
    
    if (isNaN(amount)) {
        alert('Please enter a valid amount');
        return;
    }
    
    const gstAmount = (amount * gstRate) / 100;
    const totalAmount = amount + gstAmount;
    
    document.getElementById('gst-tax-amount').textContent = '₹' + gstAmount.toFixed(2);
    document.getElementById('gst-total-amount').textContent = '₹' + totalAmount.toFixed(2);
    
    document.getElementById('gst-result').classList.add('show');
}

// FD/RD Calculator
function calculateFD() {
    const depositType = document.getElementById('deposit-type').value;
    const principalAmount = parseFloat(document.getElementById('principal-amount').value);
    const interestRate = parseFloat(document.getElementById('interest-rate-fd').value);
    const tenureYears = parseFloat(document.getElementById('tenure-fd').value);
    
    if (isNaN(principalAmount) || isNaN(interestRate) || isNaN(tenureYears)) {
        alert('Please enter valid numbers for all fields');
        return;
    }
    
    let maturityAmount, totalInterest, totalInvestment;
    
    if (depositType === 'fd') {
        // Fixed Deposit calculation
        totalInvestment = principalAmount;
        const interest = principalAmount * Math.pow(1 + interestRate/100, tenureYears) - principalAmount;
        maturityAmount = principalAmount + interest;
        totalInterest = interest;
    } else {
        // Recurring Deposit calculation
        const months = tenureYears * 12;
        const monthlyRate = interestRate / 12 / 100;
        totalInvestment = principalAmount * months;
        maturityAmount = principalAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
        totalInterest = maturityAmount - totalInvestment;
    }
    
    const effectiveRate = (Math.pow(maturityAmount / totalInvestment, 1/tenureYears) - 1) * 100;
    
    document.getElementById('maturity-amount').textContent = '₹' + maturityAmount.toFixed(2);
    document.getElementById('total-interest-fd').textContent = '₹' + totalInterest.toFixed(2);
    document.getElementById('total-investment-fd').textContent = '₹' + totalInvestment.toFixed(2);
    document.getElementById('effective-rate').textContent = effectiveRate.toFixed(2) + '%';
    
    document.getElementById('fd-result').classList.add('show');
}

// Income Tax Calculator
function calculateTax() {
    const annualIncome = parseFloat(document.getElementById('annual-income').value);
    const ageGroup = document.getElementById('age-group').value;
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;
    
    if (isNaN(annualIncome)) {
        alert('Please enter a valid annual income');
        return;
    }
    
    const taxableIncome = Math.max(0, annualIncome - deductions);
    let tax = 0;
    
    // Indian tax slabs for FY 2024-25
    if (taxableIncome <= 300000) {
        tax = 0;
    } else if (taxableIncome <= 600000) {
        tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 900000) {
        tax = 15000 + (taxableIncome - 600000) * 0.10;
    } else if (taxableIncome <= 1200000) {
        tax = 45000 + (taxableIncome - 900000) * 0.15;
    } else if (taxableIncome <= 1500000) {
        tax = 90000 + (taxableIncome - 1200000) * 0.20;
    } else {
        tax = 150000 + (taxableIncome - 1500000) * 0.30;
    }
    
    // Senior citizen rebate
    if (ageGroup === '60-80' && taxableIncome <= 500000) {
        tax = 0;
    } else if (ageGroup === 'above-80' && taxableIncome <= 500000) {
        tax = 0;
    }
    
    const cess = tax * 0.04; // Health and Education Cess
    const totalTax = tax + cess;
    const effectiveTaxRate = (totalTax / annualIncome) * 100;
    
    document.getElementById('taxable-income').textContent = '₹' + taxableIncome.toFixed(2);
    document.getElementById('income-tax').textContent = '₹' + tax.toFixed(2);
    document.getElementById('cess-amount').textContent = '₹' + cess.toFixed(2);
    document.getElementById('total-tax').textContent = '₹' + totalTax.toFixed(2);
    document.getElementById('effective-tax-rate').textContent = effectiveTaxRate.toFixed(2) + '%';
    
    document.getElementById('tax-result').classList.add('show');
}

// Savings Goal Tracker
function calculateSavings() {
    const savingsGoal = parseFloat(document.getElementById('savings-goal').value);
    const currentSavings = parseFloat(document.getElementById('current-savings').value) || 0;
    const monthlySaving = parseFloat(document.getElementById('monthly-saving').value);
    const expectedReturn = parseFloat(document.getElementById('expected-return').value) || 6;
    
    if (isNaN(savingsGoal) || isNaN(monthlySaving)) {
        alert('Please enter valid numbers for savings goal and monthly saving');
        return;
    }
    
    const amountNeeded = Math.max(0, savingsGoal - currentSavings);
    const progressPercent = (currentSavings / savingsGoal) * 100;
    
    // Calculate time to reach goal with compound interest
    const monthlyRate = expectedReturn / 12 / 100;
    let futureValue = currentSavings;
    let months = 0;
    
    while (futureValue < savingsGoal && months < 600) { // Max 50 years
        futureValue = futureValue * (1 + monthlyRate) + monthlySaving;
        months++;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    let timeToGoal = '';
    
    if (years > 0) {
        timeToGoal = years + ' year' + (years > 1 ? 's' : '');
        if (remainingMonths > 0) {
            timeToGoal += ' ' + remainingMonths + ' month' + (remainingMonths > 1 ? 's' : '');
        }
    } else {
        timeToGoal = months + ' month' + (months > 1 ? 's' : '');
    }
    
    if (months >= 600) {
        timeToGoal = 'More than 50 years';
    }
    
    document.getElementById('amount-needed').textContent = '₹' + amountNeeded.toFixed(2);
    document.getElementById('progress-percent').textContent = progressPercent.toFixed(2) + '%';
    document.getElementById('time-to-goal').textContent = timeToGoal;
    document.getElementById('future-value').textContent = '₹' + futureValue.toFixed(2);
    
    document.getElementById('savings-result').classList.add('show');
}
