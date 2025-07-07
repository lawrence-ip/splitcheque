class SplitCheque {
    constructor() {
        this.expenses = [];
        this.people = [];
        this.editingExpenseId = null;
        this.initializeEventListeners();
        this.initializeFloatingNav();
    }

    initializeEventListeners() {
        const personForm = document.getElementById('person-form');
        const expenseForm = document.getElementById('expense-form');
        const editForm = document.getElementById('edit-expense-form');
        const calculateBtn = document.getElementById('calculate-btn');
        const clearBtn = document.getElementById('clear-btn');
        const paidByInput = document.getElementById('paid-by');
        const editPaidByInput = document.getElementById('edit-paid-by');
        const expenseDescriptionInput = document.getElementById('expense-description');
        const editExpenseDescriptionInput = document.getElementById('edit-expense-description');
        const selectAllCheckbox = document.getElementById('select-all-participants');
        const selectAllEditCheckbox = document.getElementById('select-all-edit-participants');

        personForm.addEventListener('submit', (e) => this.handleAddPerson(e));
        expenseForm.addEventListener('submit', (e) => this.handleAddExpense(e));
        editForm.addEventListener('submit', (e) => this.handleEditExpense(e));
        calculateBtn.addEventListener('click', () => this.calculateSettlement());
        clearBtn.addEventListener('click', () => this.clearAll());
        
        // Select All functionality
        selectAllCheckbox.addEventListener('change', (e) => this.handleSelectAll(e, 'participants'));
        selectAllEditCheckbox.addEventListener('change', (e) => this.handleSelectAll(e, 'edit-participants'));
        
        // Autocomplete for paid-by inputs
        paidByInput.addEventListener('input', (e) => this.handlePaidByInput(e, 'paid-by-suggestions'));
        paidByInput.addEventListener('keydown', (e) => this.handlePaidByKeydown(e, 'paid-by-suggestions'));
        paidByInput.addEventListener('blur', (e) => {
            // Delay hiding to allow clicks on suggestions
            setTimeout(() => this.hidePaidBySuggestions('paid-by-suggestions'), 150);
        });
        
        editPaidByInput.addEventListener('input', (e) => this.handlePaidByInput(e, 'edit-paid-by-suggestions'));
        editPaidByInput.addEventListener('keydown', (e) => this.handlePaidByKeydown(e, 'edit-paid-by-suggestions'));
        editPaidByInput.addEventListener('blur', (e) => {
            // Delay hiding to allow clicks on suggestions
            setTimeout(() => this.hidePaidBySuggestions('edit-paid-by-suggestions'), 150);
        });
        
        // Autocomplete for expense descriptions
        expenseDescriptionInput.addEventListener('input', (e) => this.handleDescriptionInput(e, 'description-suggestions'));
        expenseDescriptionInput.addEventListener('keydown', (e) => this.handleDescriptionKeydown(e, 'description-suggestions'));
        expenseDescriptionInput.addEventListener('blur', (e) => {
            // Delay hiding to allow clicks on suggestions
            setTimeout(() => this.hideDescriptionSuggestions('description-suggestions'), 150);
        });
        
        editExpenseDescriptionInput.addEventListener('input', (e) => this.handleDescriptionInput(e, 'edit-description-suggestions'));
        editExpenseDescriptionInput.addEventListener('keydown', (e) => this.handleDescriptionKeydown(e, 'edit-description-suggestions'));
        editExpenseDescriptionInput.addEventListener('blur', (e) => {
            // Delay hiding to allow clicks on suggestions
            setTimeout(() => this.hideDescriptionSuggestions('edit-description-suggestions'), 150);
        });
        
        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.form-group')) {
                this.hidePaidBySuggestions('paid-by-suggestions');
                this.hidePaidBySuggestions('edit-paid-by-suggestions');
                this.hideDescriptionSuggestions('description-suggestions');
                this.hideDescriptionSuggestions('edit-description-suggestions');
            }
        });
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

    handlePaidByInput(e, suggestionContainerId = 'paid-by-suggestions') {
        const input = e.target.value.trim();
        const inputLower = input.toLowerCase();
        
        if (input.length === 0) {
            this.hidePaidBySuggestions(suggestionContainerId);
            return;
        }
        
        const suggestions = this.people.filter(person => 
            person.toLowerCase().includes(inputLower)
        );
        
        this.showPaidBySuggestions(suggestions, suggestionContainerId);
    }

    handlePaidByKeydown(e, suggestionContainerId = 'paid-by-suggestions') {
        const suggestionsContainer = document.getElementById(suggestionContainerId);
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateSuggestions(suggestions, 'down');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateSuggestions(suggestions, 'up');
        } else if (e.key === 'Enter') {
            const activeSuggestion = suggestionsContainer.querySelector('.suggestion-item.active');
            if (activeSuggestion) {
                e.preventDefault();
                this.selectPaidBySuggestion(activeSuggestion.textContent, suggestionContainerId);
            }
        } else if (e.key === 'Escape') {
            this.hidePaidBySuggestions(suggestionContainerId);
        }
    }

    navigateSuggestions(suggestions, direction) {
        const activeIndex = Array.from(suggestions).findIndex(item => item.classList.contains('active'));
        
        suggestions.forEach(item => item.classList.remove('active'));
        
        let newIndex;
        if (direction === 'down') {
            newIndex = activeIndex < suggestions.length - 1 ? activeIndex + 1 : 0;
        } else {
            newIndex = activeIndex > 0 ? activeIndex - 1 : suggestions.length - 1;
        }
        
        if (suggestions[newIndex]) {
            suggestions[newIndex].classList.add('active');
        }
    }

    showPaidBySuggestions(suggestions, suggestionContainerId = 'paid-by-suggestions') {
        const container = document.getElementById(suggestionContainerId);
        
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = suggestions.map(person => `
            <div class="suggestion-item" 
                 onmousedown="app.selectPaidBySuggestion('${person}', '${suggestionContainerId}')"
                 onclick="event.preventDefault()">${person}</div>
        `).join('');
        
        container.style.display = 'block';
    }

    selectPaidBySuggestion(person, suggestionContainerId = 'paid-by-suggestions') {
        const inputId = suggestionContainerId === 'edit-paid-by-suggestions' ? 'edit-paid-by' : 'paid-by';
        document.getElementById(inputId).value = person;
        this.hidePaidBySuggestions(suggestionContainerId);
    }

    hidePaidBySuggestions(suggestionContainerId = 'paid-by-suggestions') {
        document.getElementById(suggestionContainerId).style.display = 'none';
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
        // Update participants checkboxes
        this.updateParticipantCheckboxes();
        
        // Update add expense button state
        document.getElementById('add-expense-btn').disabled = this.people.length === 0;
    }

    updateParticipantCheckboxes() {
        const container = document.getElementById('participants-checkboxes');
        const selectAllCheckbox = document.getElementById('select-all-participants');
        
        if (this.people.length === 0) {
            container.innerHTML = '<p class="no-people-message">Add people above first</p>';
            return;
        }
        
        // Default to all checked
        const checkboxes = this.people.map(person => `
            <div class="checkbox-item">
                <input type="checkbox" id="participant-${person}" name="participants" value="${person}" checked>
                <label for="participant-${person}">${person}</label>
            </div>
        `).join('');
        
        container.innerHTML = checkboxes;
        
        // Set select all checkbox to checked
        selectAllCheckbox.checked = true;
        
        // Add event listeners to individual checkboxes to update select all state
        const individualCheckboxes = document.querySelectorAll('input[name="participants"]');
        individualCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSelectAllState('participants'));
        });
    }

    updateEditParticipantCheckboxes() {
        const editContainer = document.getElementById('edit-participants-checkboxes');
        const selectAllEditCheckbox = document.getElementById('select-all-edit-participants');
        
        if (this.people.length === 0) {
            editContainer.innerHTML = '<p class="no-people-message">Add people above first</p>';
            return;
        }
        
        // Default to all checked
        const editCheckboxes = this.people.map(person => `
            <div class="checkbox-item">
                <input type="checkbox" id="edit-participant-${person}" name="edit-participants" value="${person}" checked>
                <label for="edit-participant-${person}">${person}</label>
            </div>
        `).join('');
        
        editContainer.innerHTML = editCheckboxes;
        
        // Set select all checkbox to checked
        selectAllEditCheckbox.checked = true;
        
        // Add event listeners to individual checkboxes to update select all state
        const individualCheckboxes = document.querySelectorAll('input[name="edit-participants"]');
        individualCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSelectAllState('edit-participants'));
        });
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
        
        if (!paidBy || !this.people.includes(paidBy)) {
            alert('Please select a valid person who paid');
            return;
        }
        
        if (participants.length === 0) {
            alert('Please select at least one participant');
            return;
        }
        
        // Always include the payer in participants
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
        
        if (!paidBy || !this.people.includes(paidBy)) {
            alert('Please select a valid person who paid');
            return;
        }
        
        if (participants.length === 0) {
            alert('Please select at least one participant');
            return;
        }
        
        // Always include the payer in participants
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
        
        // Set up the edit participant checkboxes
        this.updateEditParticipantCheckboxes();
        
        // Set the participants based on the expense
        const participantsSet = new Set(expense.participants);
        document.querySelectorAll('input[name="edit-participants"]').forEach(checkbox => {
            checkbox.checked = participantsSet.has(checkbox.value);
        });
        
        // Update the select all checkbox state
        this.updateSelectAllState('edit-participants');
        
        // Show modal
        document.getElementById('edit-modal').style.display = 'flex';
    }

    clearPersonForm() {
        document.getElementById('person-name').value = '';
    }

    clearExpenseForm() {
        document.getElementById('expense-form').reset();
        document.getElementById('paid-by').value = '';
        
        // Update checkboxes (all selected by default)
        this.updateParticipantCheckboxes();
        
        // Hide autocomplete suggestions
        this.hidePaidBySuggestions('paid-by-suggestions');
        this.hideDescriptionSuggestions('description-suggestions');
    }

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
        
        // Clear the edit form
        document.getElementById('edit-expense-form').reset();
        document.getElementById('edit-paid-by').value = '';
        
        // Hide autocomplete suggestions
        this.hidePaidBySuggestions('edit-paid-by-suggestions');
        this.hideDescriptionSuggestions('edit-description-suggestions');
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

    // Client-side calculation (moved from server)
    calculateSettlement() {
        if (this.expenses.length === 0) {
            alert('Please add at least one expense');
            return;
        }

        try {
            const result = this.calculateOptimalSettlement(this.expenses);
            this.displayResults(result);
        } catch (error) {
            console.error('Error calculating settlement:', error);
            alert('Error calculating settlement. Please try again.');
        }
    }

    calculateOptimalSettlement(expenses) {
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
        
        const transactions = this.minimizeTransactions(balances);
        
        return {
            summary: people,
            transactions: transactions,
            totalExpenses: totalExpenses,
            perPersonShare: Math.round(perPersonShare * 100) / 100
        };
    }

    minimizeTransactions(balances) {
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
                
                // Round to nearest dollar for cleaner settlements
                const roundedAmount = Math.round(bestAmount);
                
                transactions.push({
                    from: from,
                    to: to,
                    amount: roundedAmount
                });
                
                // Update balances using the rounded amount
                if (amounts[i].balance > 0) {
                    amounts[i].balance -= roundedAmount;
                    amounts[bestMatch].balance += roundedAmount;
                } else {
                    amounts[i].balance += roundedAmount;
                    amounts[bestMatch].balance -= roundedAmount;
                }
            } else {
                i++;
            }
        }
        
        return transactions;
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
        
        // Update floating nav to show results section as active
        setTimeout(() => {
            this.updateActiveNavItem();
        }, 500);
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
                <p class="transaction-amount">$${transaction.amount.toFixed(0)}</p>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="optimization-note">
                <p>✨ <strong>Optimized for minimal transactions!</strong> Instead of everyone paying everyone else, 
                these ${transactions.length} transaction${transactions.length > 1 ? 's' : ''} will settle all debts.</p>
                <p><em>💡 Amounts are rounded to the nearest dollar for convenience.</em></p>
            </div>
            ${transactionItems}
        `;
    }

    hideResults() {
        document.getElementById('results-section').style.display = 'none';
    }

    initializeFloatingNav() {
        const floatingNav = document.getElementById('floating-nav');
        const scrollTopBtn = document.getElementById('scroll-top');
        const navItems = document.querySelectorAll('.nav-item');
        
        // Show/hide floating nav and scroll button based on scroll position
        let ticking = false;
        
        const updateNavVisibility = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Show nav after scrolling 100px
            if (scrollY > 100) {
                floatingNav.classList.add('visible');
                scrollTopBtn.classList.add('visible');
            } else {
                floatingNav.classList.remove('visible');
                scrollTopBtn.classList.remove('visible');
            }
            
            // Update active nav item based on scroll position
            this.updateActiveNavItem();
            
            ticking = false;
        };
        
        const requestNavUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavVisibility);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestNavUpdate);
        
        // Handle nav item clicks
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 20;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Handle scroll to top button
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Initial call to set correct visibility
        updateNavVisibility();
        
        // For mobile, show nav immediately if content is long enough
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                floatingNav.classList.add('visible');
            }, 1000);
        }
    }
    
    updateActiveNavItem() {
        const sections = ['top', 'people', 'expenses', 'results'];
        const navItems = document.querySelectorAll('.nav-item');
        const scrollY = window.scrollY;
        
        let activeSection = 'top';
        
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                
                if (scrollY >= elementTop - 100) {
                    activeSection = sectionId;
                }
            }
        });
        
        // Update active nav item
        navItems.forEach(item => {
            const section = item.getAttribute('data-section');
            if (section === activeSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    handleSelectAll(e, participantType) {
        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll(`input[name="${participantType}"]`);
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    }

    updateSelectAllState(participantType) {
        const checkboxes = document.querySelectorAll(`input[name="${participantType}"]`);
        const selectAllCheckbox = document.getElementById(
            participantType === 'participants' ? 'select-all-participants' : 'select-all-edit-participants'
        );
        
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        const someChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        
        if (allChecked) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else if (someChecked) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        }
    }

    // Common expense categories for autocomplete
    getExpenseCategories() {
        return [
            'Food & Dining',
            'Restaurant',
            'Fast Food',
            'Coffee & Tea',
            'Groceries',
            'Transportation',
            'Gas',
            'Taxi/Uber',
            'Public Transport',
            'Parking',
            'Entertainment',
            'Movies',
            'Concert',
            'Sports Event',
            'Shopping',
            'Clothing',
            'Electronics',
            'Books',
            'Travel',
            'Hotel',
            'Flight',
            'Accommodation',
            'Utilities',
            'Internet',
            'Phone Bill',
            'Healthcare',
            'Pharmacy',
            'Doctor Visit',
            'Miscellaneous',
            'Gift',
            'Subscription',
            'Insurance'
        ];
    }

    handleDescriptionInput(e, suggestionContainerId = 'description-suggestions') {
        const input = e.target.value.trim();
        const inputLower = input.toLowerCase();
        
        if (input.length < 2) {
            this.hideDescriptionSuggestions(suggestionContainerId);
            return;
        }
        
        const categories = this.getExpenseCategories();
        const suggestions = categories.filter(category => 
            category.toLowerCase().includes(inputLower)
        );
        
        this.showDescriptionSuggestions(suggestions, suggestionContainerId);
    }

    handleDescriptionKeydown(e, suggestionContainerId = 'description-suggestions') {
        const suggestionsContainer = document.getElementById(suggestionContainerId);
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateSuggestions(suggestions, 'down');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateSuggestions(suggestions, 'up');
        } else if (e.key === 'Enter') {
            const activeSuggestion = suggestionsContainer.querySelector('.suggestion-item.active');
            if (activeSuggestion) {
                e.preventDefault();
                this.selectDescriptionSuggestion(activeSuggestion.textContent, suggestionContainerId);
            }
        } else if (e.key === 'Escape') {
            this.hideDescriptionSuggestions(suggestionContainerId);
        }
    }

    showDescriptionSuggestions(suggestions, suggestionContainerId = 'description-suggestions') {
        const container = document.getElementById(suggestionContainerId);
        
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = suggestions.map(category => `
            <div class="suggestion-item" 
                 onmousedown="app.selectDescriptionSuggestion('${category}', '${suggestionContainerId}')"
                 onclick="event.preventDefault()">${category}</div>
        `).join('');
        
        container.style.display = 'block';
    }

    selectDescriptionSuggestion(category, suggestionContainerId = 'description-suggestions') {
        const inputId = suggestionContainerId === 'edit-description-suggestions' ? 'edit-expense-description' : 'expense-description';
        document.getElementById(inputId).value = category;
        this.hideDescriptionSuggestions(suggestionContainerId);
    }

    hideDescriptionSuggestions(suggestionContainerId = 'description-suggestions') {
        document.getElementById(suggestionContainerId).style.display = 'none';
    }

    // Ad management methods
    initializeAds() {
        // This method can be called to initialize ads
        // For now, just remove the placeholder if real ads are loaded
        const placeholder = document.querySelector('.ad-placeholder');
        if (placeholder && window.adsbygoogle) {
            // Example for Google AdSense
            // placeholder.parentNode.innerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="XXXXXXXX" data-ad-format="auto"></ins>';
            // (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }

    loadAdMobAd() {
        // For AdMob integration (if using a hybrid approach)
        // This would typically be called from a mobile app context
        const adContainer = document.getElementById('ad-container');
        if (adContainer && window.admob) {
            // AdMob integration code would go here
            console.log('AdMob integration ready');
        }
    }

    hideAds() {
        // Method to hide ads if needed
        const adBanner = document.getElementById('ad-banner');
        if (adBanner) {
            adBanner.style.display = 'none';
        }
    }

    showAds() {
        // Method to show ads
        const adBanner = document.getElementById('ad-banner');
        if (adBanner) {
            adBanner.style.display = 'flex';
        }
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
