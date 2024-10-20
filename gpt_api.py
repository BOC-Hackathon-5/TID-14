from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import logging
import markdown
app = Flask(__name__)
CORS(app)

logger = logging.getLogger(__name__)

mockData = '''{ 
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
}'''

# Set your OpenAI API key

client = OpenAI(api_key = '')
@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        user_message = data.get('prompt', '')
        context_data = mockData
        
        print(f"User message: {user_message}")
        print(f"Context data: {context_data}")

        
        # Prepare the full prompt with user's data
        full_prompt = f"You are a financial chatbot. Respond naturally to the user query: '{user_message}'. Here is the user's data: {context_data}."

        # Call OpenAI API using the latest ChatCompletion
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Change to 'gpt-4' or 'gpt-3.5-turbo' depending on your access
            messages=[
                {"role": "system", "content": "You are a helpful assistant specialized in financial queries. Use plain text. When asked for info on something try using bullet points seperated by lines to display it"},
                {"role": "user", "content": full_prompt}
            ],
            max_tokens=300,  # Adjust as needed
            temperature=0.7
        )

        # Extract the assistant's reply from the response
        reply = response.choices[0].message.content

        return jsonify({"reply": markdown.markdown(reply)})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while processing the request."}), 500

if __name__ == '__main__':
    app.run(port=5000)
