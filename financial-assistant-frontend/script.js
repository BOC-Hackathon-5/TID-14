const chatOutput = document.getElementById('chat-output'); 
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const portfolioDisplay = document.getElementById('portfolio-display');
const riskAlertsDisplay = document.getElementById('risk-alerts');

// Mock Data (contextData)
const mockData = { 
    userId: 'example-user-id',
    userProfile: {
        name: 'John Doe',
        accountType: 'Personal Checking',
        address: '123 Main St, Nicosia, Cyprus',
        email: 'johndoe@example.com',
        phone: '+357 99 999999'
    },
    account: {
        balance: 3500.75,  // EUR
        currency: 'EUR',
        accountNumber: 'CY1234567890123456789012',
        IBAN: 'CY000111222333444555666777',
        loans: [
            { loanId: 'LN12345', amount: 50000, rate: 3.5, status: 'active', startDate: '2020-01-15', endDate: '2030-01-15', monthlyPayment: 500 },
            { loanId: 'LN67890', amount: 15000, rate: 5.0, status: 'completed', startDate: '2015-03-01', endDate: '2020-03-01', monthlyPayment: 300 }
        ],
        transactions: [
            { id: 1, date: '2024-10-05', description: 'Grocery Store Purchase', amount: -80.50, type: 'debit', category: 'Groceries' },
            { id: 2, date: '2024-10-02', description: 'Salary Deposit', amount: 2500, type: 'credit', category: 'Salary' },
            { id: 3, date: '2024-09-30', description: 'Utility Bill - Electricity', amount: -120.75, type: 'debit', category: 'Bills' },
            { id: 4, date: '2024-09-25', description: 'Transfer to Savings Account', amount: -500, type: 'debit', category: 'Savings' }
        ]
    },
    investments: {
        portfolioValue: 20000,
        stocks: [
            { symbol: 'AAPL', shares: 10, valuePerShare: 150, totalValue: 1500 },
            { symbol: 'TSLA', shares: 5, valuePerShare: 700, totalValue: 3500 },
            { symbol: 'MSFT', shares: 8, valuePerShare: 250, totalValue: 2000 }
        ],
        mutualFunds: [
            { fundName: 'Global Growth Fund', value: 10000 },
            { fundName: 'Sustainable Energy Fund', value: 5000 }
        ]
    }
};

// Event listener for send button
sendBtn.addEventListener('click', sendMessage);

function sendMessage() {
    const message = userInput.value;
    console.log("sendMessage() function triggered");  // Debugging log

    if (!message) {
        console.log("No message entered.");  // Debugging log
        return;
    }

    console.log("Message entered:", message);  // Debugging log

    appendMessage('User', message);
    userInput.value = '';

    fetch('http://localhost:5000/generate', {  // Point to the correct backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            prompt: message, 
            contextData: mockData  // Send the mockData (contextData) with the message
        }),
    })
    .then(response => {
        if (!response.ok) {  // Check if response is ok
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Backend response received:", data);  // Debugging log
        appendMessage('Chatbot', data.reply || "Sorry, I didn't understand that.");  // Handle missing replies
    })
    .catch(error => {
        console.error('Error:', error);
        appendMessage('Chatbot', "An error occurred while processing your request."); // Display error message in chat
    });
}

// Function to append messages to the chat window
function appendMessage(sender, message) {
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');
    if (sender === 'User') {
        newMessage.classList.add('user-message');
    } else {
        newMessage.classList.add('chatbot-message');
    }
    newMessage.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatOutput.appendChild(newMessage);
    chatOutput.scrollTop = chatOutput.scrollHeight; // Auto-scroll to the bottom
}

// Reset Button
document.getElementById('clear-btn').addEventListener('click', () => {
    chatOutput.innerHTML = '';
});

/* Fetch portfolio recommendations and risk alerts from the backend
function fetchPortfoliosAndRisks() {
    // Fetch portfolios
    fetch('http://localhost:5000/portfolio')  // Updated to point to the correct endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            portfolioDisplay.innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Error fetching portfolios:', error);
            portfolioDisplay.innerHTML = "Error fetching portfolios.";  // Display error message
        });

    // Fetch risk alerts
    fetch('http://localhost:5000/risk-alert')  // Updated to point to the correct endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            riskAlertsDisplay.innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Error fetching risk alerts:', error);
            riskAlertsDisplay.innerHTML = "Error fetching risk alerts.";  // Display error message
        });
}

// Fetch portfolios and risks on page load
window.onload = fetchPortfoliosAndRisks; */ 
