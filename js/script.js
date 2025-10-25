// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
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
                
                // Close mobile menu if open
                if (nav) {
                    nav.classList.remove('active');
                }
            }
        });
    });
});

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
    
    // Simple eligibility calculation (in real scenario, this would be more complex)
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

// Contact Form Handler
function handleContactForm(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}