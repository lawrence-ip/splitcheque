# 💰 SplitCheque

A smart bill-splitting app that calculates the optimal way to settle debts when everyone pays different amounts.

## Features

- **Add Multiple Expenses**: Track who paid for what and who participated
- **Smart Debt Settlement**: Automatically calculates the minimum number of transactions needed to settle all debts
- **Beautiful UI**: Modern, responsive design that works on all devices
- **Real-time Calculations**: Instant results as you add expenses
- **Individual Balances**: See who owes money and who is owed money

## How It Works

1. **Add Expenses**: Enter each expense with:
   - Description (e.g., "Dinner at Restaurant")
   - Amount paid
   - Who paid for it
   - Who participated (comma-separated names)

2. **Calculate Settlement**: The app uses an optimized algorithm to:
   - Calculate each person's net balance
   - Determine the minimum number of transactions needed
   - Show exactly who should pay whom and how much

3. **Settle Debts**: Follow the suggested transactions to settle all debts with the fewest transfers

## Installation & Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

## Development

For development with auto-reload:
```bash
npm run dev
```

## Algorithm

The app uses a greedy algorithm to minimize the number of transactions:

1. Calculate net balances for each person
2. Separate people into creditors (owed money) and debtors (owe money)
3. Match the largest debts with the largest credits
4. Continue until all balances are settled

This approach ensures the minimum number of transactions needed to settle all debts.

## Example

**Scenario:**
- Alice paid $120 for dinner (3 people)
- Bob paid $45 for groceries (3 people)  
- Charlie paid $36 for movie tickets (3 people)

**Result:**
- Total expenses: $201
- Per person: $67
- Alice is owed: $53
- Bob owes: $22
- Charlie owes: $31

**Optimal settlement:**
1. Charlie pays Alice $31
2. Bob pays Alice $22

Instead of multiple transactions, everyone is settled with just 2 payments!

## License

MIT
