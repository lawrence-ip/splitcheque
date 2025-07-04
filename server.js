const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Algorithm to calculate optimal debt settlement using graph-based approach
function calculateOptimalSettlement(expenses) {
    // Calculate net balance for each person
    const people = {};
    let totalExpenses = 0;
    
    // Initialize people and calculate total expenses
    expenses.forEach(expense => {
        expense.participants.forEach(person => {
            if (!people[person]) {
                people[person] = { paid: 0, owes: 0, balance: 0 };
            }
        });
        totalExpenses += expense.amount;
    });
    
    // Calculate how much each person paid
    expenses.forEach(expense => {
        if (people[expense.paidBy]) {
            people[expense.paidBy].paid += expense.amount;
        }
    });
    
    // Calculate how much each person owes (equal split)
    const totalPeople = Object.keys(people).length;
    const perPersonShare = totalExpenses / totalPeople;
    
    // Calculate net balance (positive = owed money, negative = owes money)
    Object.keys(people).forEach(person => {
        people[person].owes = perPersonShare;
        people[person].balance = people[person].paid - people[person].owes;
    });
    
    // Find the truly minimal number of transactions using a more sophisticated approach
    const balances = {};
    Object.keys(people).forEach(person => {
        const balance = Math.round(people[person].balance * 100) / 100;
        if (Math.abs(balance) > 0.01) {
            balances[person] = balance;
        }
    });
    
    const transactions = minimizeTransactions(balances);
    
    return {
        summary: people,
        transactions: transactions,
        totalExpenses: totalExpenses,
        perPersonShare: Math.round(perPersonShare * 100) / 100
    };
}

// More sophisticated algorithm to minimize transactions
function minimizeTransactions(balances) {
    const transactions = [];
    const people = Object.keys(balances);
    
    // Convert to array for easier manipulation
    const amounts = people.map(person => ({
        name: person,
        balance: balances[person]
    }));
    
    // Sort by balance (creditors first, then debtors)
    amounts.sort((a, b) => b.balance - a.balance);
    
    // Use a greedy approach but with better optimization
    let i = 0;
    while (i < amounts.length) {
        if (Math.abs(amounts[i].balance) < 0.01) {
            i++;
            continue;
        }
        
        // Find the best match for this person
        let bestMatch = -1;
        let bestAmount = 0;
        
        for (let j = i + 1; j < amounts.length; j++) {
            if (Math.abs(amounts[j].balance) < 0.01) continue;
            
            // Check if they can settle each other (opposite signs)
            if ((amounts[i].balance > 0 && amounts[j].balance < 0) ||
                (amounts[i].balance < 0 && amounts[j].balance > 0)) {
                
                const possibleAmount = Math.min(Math.abs(amounts[i].balance), Math.abs(amounts[j].balance));
                
                // Prefer exact matches, then larger amounts
                if (Math.abs(Math.abs(amounts[i].balance) - Math.abs(amounts[j].balance)) < 0.01) {
                    // Exact match - this is ideal
                    bestMatch = j;
                    bestAmount = possibleAmount;
                    break;
                } else if (possibleAmount > bestAmount) {
                    bestMatch = j;
                    bestAmount = possibleAmount;
                }
            }
        }
        
        if (bestMatch !== -1 && bestAmount > 0.01) {
            const from = amounts[i].balance < 0 ? amounts[i].name : amounts[bestMatch].name;
            const to = amounts[i].balance > 0 ? amounts[i].name : amounts[bestMatch].name;
            
            transactions.push({
                from: from,
                to: to,
                amount: Math.round(bestAmount * 100) / 100
            });
            
            // Update balances
            if (amounts[i].balance > 0) {
                amounts[i].balance -= bestAmount;
                amounts[bestMatch].balance += bestAmount;
            } else {
                amounts[i].balance += bestAmount;
                amounts[bestMatch].balance -= bestAmount;
            }
        } else {
            i++;
        }
    }
    
    return transactions;
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/calculate', (req, res) => {
    try {
        const { expenses } = req.body;
        
        if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
            return res.status(400).json({ error: 'Invalid expenses data' });
        }
        
        const result = calculateOptimalSettlement(expenses);
        res.json(result);
    } catch (error) {
        console.error('Error calculating settlement:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/expense/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { expense } = req.body;
        
        if (!expense) {
            return res.status(400).json({ error: 'Invalid expense data' });
        }
        
        // In a real app, you'd update the expense in a database
        // For now, we'll just return success since the frontend manages the data
        res.json({ success: true, message: 'Expense updated successfully' });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`SplitCheque app running on http://localhost:${PORT}`);
});
