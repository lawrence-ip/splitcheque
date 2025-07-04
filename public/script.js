class SplitCheque {
    constructor() {
        this.expenses = [];
        this.people = [];
        this.editingExpenseId = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const personForm = document.getElementById('person-form');
        const expenseForm = document.getElementById('expense-form');
        const editForm = document.getElementById('edit-expense-form');
        const calculateBtn = document.getElementById('calculate-btn');
        const clearBtn = document.getElementById('clear-btn');

        personForm.addEventListener('submit', (e) => this.handleAddPerson(e));
        expenseForm.addEventListener('submit', (e) => this.handleAddExpense(e));
        editForm.addEventListener('submit', (e) => this.handleEditExpense(e));
        calculateBtn.addEventListener('click', () => this.calculateSettlement());
        clearBtn.addEventListener('click', () => this.clearAll());
    }

    handleAddPerson(e) {
        e.preventDefault();
        
        const name = document.getElementById('person-name').value.trim();
        
        if (name === '') {
            alert('Please enter a name');
            return;
        }
        
        if (this.people.includes(name)) {
            alert('This person has already been added');
            return;
        }
        
        this.people.push(name);
        this.renderPeople();
        this.updateSelectors();
        this.clearPersonForm();
    }

    removePerson(name) {
        if (confirm(`Remove ${name} from the list? This will also remove them from all expenses.`)) {
            this.people = this.people.filter(person => person !== name);
            
            // Remove from expenses
            this.expenses = this.expenses.filter(expense => {
                expense.participants = expense.participants.filter(p => p !== name);
                return expense.participants.length > 0 && expense.paidBy !== name;
            });
            
            this.renderPeople();
            this.renderExpenses();
            this.updateSelectors();
            this.hideResults();
        }
    }

    renderPeople() {
        const container = document.getElementById('people-container');
        
        if (this.people.length === 0) {
            container.innerHTML = '<p class="no-people">No people added yet. Add people first!</p>';
            return;
        }
        
        container.innerHTML = this.people.map(person => `
            <div class="person-tag">
                ${person}
                <span class="remove-person" onclick="app.removePerson('${person}')">&times;</span>
            </div>
        `).join('');
    }

    updateSelectors() {
        // Update paid-by selector
        const paidBySelect = document.getElementById('paid-by');
        const editPaidBySelect = document.getElementById('edit-paid-by');
        
        const options = this.people.map(person => 
            `<option value="${person}">${person}</option>`
        ).join('');
        
        paidBySelect.innerHTML = `<option value="">Select who paid</option>${options}`;
        editPaidBySelect.innerHTML = `<option value="">Select who paid</option>${options}`;
        
        // Update participants checkboxes
        this.updateParticipantCheckboxes();
        
        // Update add expense button state
        document.getElementById('add-expense-btn').disabled = this.people.length === 0;
    }

    updateParticipantCheckboxes() {
        const container = document.getElementById('participants-checkboxes');
        const editContainer = document.getElementById('edit-participants-checkboxes');
        
        if (this.people.length === 0) {
            container.innerHTML = '<p class="no-people-message">Add people above first</p>';
            editContainer.innerHTML = '<p class="no-people-message">Add people above first</p>';
            return;
        }
        
        const checkboxes = this.people.map(person => `
            <div class="checkbox-item">
                <input type="checkbox" id="participant-${person}" name="participants" value="${person}">
                <label for="participant-${person}">${person}</label>
            </div>
        `).join('');
        
        const editCheckboxes = this.people.map(person => `
            <div class="checkbox-item">
                <input type="checkbox" id="edit-participant-${person}" name="edit-participants" value="${person}">
                <label for="edit-participant-${person}">${person}</label>
            </div>
        `).join('');
        
        container.innerHTML = checkboxes;
        editContainer.innerHTML = editCheckboxes;
    }

    getSelectedParticipants() {
        const checkboxes = document.querySelectorAll('input[name="participants"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    getSelectedEditParticipants() {
        const checkboxes = document.querySelectorAll('input[name="edit-participants"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    handleAddExpense(e) {
        e.preventDefault();
        
        const description = document.getElementById('expense-description').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const paidBy = document.getElementById('paid-by').value;
        const participants = this.getSelectedParticipants();
        
        if (participants.length === 0) {
            alert('Please select at least one participant');
            return;
        }
        
        if (!participants.includes(paidBy)) {
            participants.push(paidBy);
        }
        
        const expense = {
            id: Date.now(),
            description,
            amount,
            paidBy,
            participants
        };
        
        this.expenses.push(expense);
        this.renderExpenses();
        this.clearExpenseForm();
        this.updateCalculateButton();
    }

    handleEditExpense(e) {
        e.preventDefault();
        
        const description = document.getElementById('edit-expense-description').value;
        const amount = parseFloat(document.getElementById('edit-expense-amount').value);
        const paidBy = document.getElementById('edit-paid-by').value;
        const participants = this.getSelectedEditParticipants();
        
        if (participants.length === 0) {
            alert('Please select at least one participant');
            return;
        }
        
        if (!participants.includes(paidBy)) {
            participants.push(paidBy);
        }
        
        // Find and update the expense
        const expenseIndex = this.expenses.findIndex(exp => exp.id === this.editingExpenseId);
        if (expenseIndex !== -1) {
            this.expenses[expenseIndex] = {
                id: this.editingExpenseId,
                description,
                amount,
                paidBy,
                participants
            };
            
            this.renderExpenses();
            this.closeEditModal();
            this.hideResults();
        }
    }

    editExpense(id) {
        const expense = this.expenses.find(exp => exp.id === id);
        if (!expense) return;
        
        this.editingExpenseId = id;
        
        // Fill the edit form
        document.getElementById('edit-expense-description').value = expense.description;
        document.getElementById('edit-expense-amount').value = expense.amount;
        document.getElementById('edit-paid-by').value = expense.paidBy;
        
        // Check the appropriate participants
        document.querySelectorAll('input[name="edit-participants"]').forEach(checkbox => {
            checkbox.checked = expense.participants.includes(checkbox.value);
        });
        
        // Show modal
        document.getElementById('edit-modal').style.display = 'flex';
    }

    clearPersonForm() {
        document.getElementById('person-name').value = '';
    }

    clearExpenseForm() {
        document.getElementById('expense-form').reset();
        // Uncheck all participant checkboxes
        document.querySelectorAll('input[name="participants"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    // ...existing code...
    renderExpenses() {
        const container = document.getElementById('expenses-container');
        
        if (this.expenses.length === 0) {
            container.innerHTML = '<p class="no-expenses">No expenses added yet. Add your first expense above!</p>';
            return;
        }
        
        container.innerHTML = this.expenses.map(expense => `
            <div class="expense-item">
                <h4>${expense.description}</h4>
                <p class="amount">$${expense.amount.toFixed(2)}</p>
                <p>Paid by: ${expense.paidBy}</p>
                <p>Participants: ${expense.participants.join(', ')}</p>
                <div class="expense-buttons">
                    <button class="edit-btn" onclick="app.editExpense(${expense.id})">Edit</button>
                    <button class="delete-btn" onclick="app.deleteExpense(${expense.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    closeEditModal() {
        document.getElementById('edit-modal').style.display = 'none';
        this.editingExpenseId = null;
    }

    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(expense => expense.id !== id);
            this.renderExpenses();
            this.updateCalculateButton();
            this.hideResults();
        }
    }

    updateCalculateButton() {
        const calculateBtn = document.getElementById('calculate-btn');
        calculateBtn.disabled = this.expenses.length === 0;
    }

    clearAll() {
        if (this.expenses.length === 0 && this.people.length === 0) return;
        
        if (confirm('Are you sure you want to clear all people and expenses?')) {
            this.expenses = [];
            this.people = [];
            this.renderPeople();
            this.renderExpenses();
            this.updateSelectors();
            this.updateCalculateButton();
            this.hideResults();
        }
    }

    async calculateSettlement() {
        if (this.expenses.length === 0) {
            alert('Please add at least one expense');
            return;
        }

        try {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expenses: this.expenses })
            });

            if (!response.ok) {
                throw new Error('Failed to calculate settlement');
            }

            const result = await response.json();
            this.displayResults(result);
        } catch (error) {
            console.error('Error calculating settlement:', error);
            alert('Error calculating settlement. Please try again.');
        }
    }

    displayResults(result) {
        const resultsSection = document.getElementById('results-section');
        resultsSection.style.display = 'block';

        // Update summary cards
        document.getElementById('total-expenses').textContent = `$${result.totalExpenses.toFixed(2)}`;
        document.getElementById('per-person-share').textContent = `$${result.perPersonShare.toFixed(2)}`;
        document.getElementById('num-transactions').textContent = result.transactions.length;

        // Display balances
        this.displayBalances(result.summary);

        // Display transactions
        this.displayTransactions(result.transactions);

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    displayBalances(summary) {
        const container = document.getElementById('balances-container');
        
        const balanceItems = Object.entries(summary).map(([name, data]) => {
            const balance = data.balance;
            let balanceClass = 'neutral';
            let balanceText = 'Settled';
            
            if (balance > 0.01) {
                balanceClass = 'positive';
                balanceText = `+$${balance.toFixed(2)} (owed)`;
            } else if (balance < -0.01) {
                balanceClass = 'negative';
                balanceText = `-$${Math.abs(balance).toFixed(2)} (owes)`;
            }
            
            return `
                <div class="balance-item ${balanceClass}">
                    <span class="balance-name">${name}</span>
                    <span class="balance-amount ${balanceClass}">${balanceText}</span>
                </div>
            `;
        }).join('');
        
        container.innerHTML = balanceItems;
    }

    displayTransactions(transactions) {
        const container = document.getElementById('transactions-container');
        
        if (transactions.length === 0) {
            container.innerHTML = '<p class="no-transactions">🎉 Everyone is settled! No transactions needed.</p>';
            return;
        }
        
        const transactionItems = transactions.map((transaction, index) => `
            <div class="transaction-item">
                <p><strong>${transaction.from}</strong> pays <strong>${transaction.to}</strong></p>
                <p class="transaction-amount">$${transaction.amount.toFixed(2)}</p>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="optimization-note">
                <p>✨ <strong>Optimized for minimal transactions!</strong> Instead of everyone paying everyone else, 
                these ${transactions.length} transaction${transactions.length > 1 ? 's' : ''} will settle all debts.</p>
            </div>
            ${transactionItems}
        `;
    }

    hideResults() {
        document.getElementById('results-section').style.display = 'none';
    }
}

// Initialize the app
const app = new SplitCheque();

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('edit-modal');
    if (e.target === modal) {
        app.closeEditModal();
    }
});

// Close modal with Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        app.closeEditModal();
    }
});
