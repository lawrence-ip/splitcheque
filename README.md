# 💰 SplitCheque

A smart bill-splitting app that calculates the optimal way to settle debts when everyone pays different amounts. **Now optimized for static hosting on Netlify!**

## Features

- **Add People First**: Manage participants with an intuitive interface
- **Smart Expense Tracking**: Select who paid and who participated with dropdowns and checkboxes
- **Edit & Delete**: Full CRUD operations for expenses
- **Optimal Debt Settlement**: Minimizes the number of transactions needed using advanced algorithms
- **Beautiful UI**: Modern, responsive design that works on all devices
- **Real-time Calculations**: Instant results as you add expenses
- **Individual Balances**: Clear visualization of who owes money and who is owed money

## 🚀 Quick Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/splitcheque)

### Option 1: Drag & Drop
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag this entire project folder
3. Your app will be live instantly!

### Option 2: Git Integration
1. Push this repository to GitHub
2. Connect to Netlify
3. Deploy automatically with `netlify.toml` configuration

## Local Development

Since this is now a static app, you can use any simple HTTP server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (if you have it)
npx serve

# PHP (if you have it)
php -S localhost:8000
```

Then open `http://localhost:8000`

## How It Works

### 1. **Add People**
- Add all participants who will be involved in expenses
- Each person appears as a colorful tag
- Remove people by clicking the × on their tag

### 2. **Track Expenses**
- Select who paid from a dropdown
- Choose participants with checkboxes
- Edit or delete any expense later

### 3. **Calculate Settlement**
The app uses an advanced algorithm to minimize transactions:
- Calculate net balances for each person
- Find optimal pairings to reduce total payments
- Show exactly who should pay whom and how much

## Algorithm Example

**Scenario:**
- Alice paid $120 for dinner (3 people)
- Bob paid $45 for groceries (3 people)  
- Charlie paid $36 for movie tickets (3 people)

**Traditional approach:** Everyone pays everyone = 6 potential transactions
**SplitCheque result:** Just 2 optimized transactions!
- Charlie pays Alice $31
- Bob pays Alice $22

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript
- **No Backend**: All calculations run in the browser
- **Responsive**: Works on desktop, tablet, and mobile
- **Fast**: Instant loading with no server dependencies
- **Secure**: Hosted on Netlify's global CDN with HTTPS

## File Structure

```
splitcheque/
├── index.html       # Main application
├── styles.css       # All styling
├── script.js        # Client-side logic and calculations
├── netlify.toml     # Netlify deployment configuration
└── README.md        # This file
```

## Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## Credits

© 2025 Lawrence IP - Built with passion for fair splitting

## License

MIT License - Feel free to use and modify!
