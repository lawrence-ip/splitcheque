# SplitCheque - Netlify Compatible Version

## 🚀 Netlify Deployment

This version of SplitCheque is fully compatible with Netlify static hosting.

### Quick Deploy to Netlify:

1. **Fork/Clone this repository**
2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Build settings are already configured in `netlify.toml`

3. **Deploy:**
   - Netlify will automatically build and deploy
   - Your app will be live at `https://your-site-name.netlify.app`

### What Changed for Netlify Compatibility:

#### ✅ **Removed Server Dependencies:**
- No more Express.js server
- No more Node.js backend
- All calculation logic moved to client-side JavaScript

#### ✅ **Static Files Only:**
- Pure HTML, CSS, and JavaScript
- No server-side API calls
- Everything runs in the browser

#### ✅ **Netlify Configuration:**
- `netlify.toml` file for build settings
- Security headers configured
- Redirect rules for SPA behavior

### 📁 **File Structure:**
```
netlify-static/
├── index.html       # Main HTML file
├── styles.css       # All CSS styles
├── script.js        # Client-side JavaScript with calculations
└── netlify.toml     # Netlify configuration
```

### 🔧 **Features Maintained:**
- ✅ Person management
- ✅ Expense tracking
- ✅ Edit/delete functionality
- ✅ Optimal debt settlement algorithm
- ✅ Responsive design
- ✅ Beautiful UI
- ✅ Footer with donation link

### 🌐 **Deploy Options:**

#### Option 1: Netlify (Recommended)
- Drag and drop the `netlify-static` folder to [Netlify Drop](https://app.netlify.com/drop)
- Or connect your Git repository

#### Option 2: Other Static Hosts
- Vercel
- GitHub Pages
- Surge.sh
- Firebase Hosting

### 🔄 **Differences from Full-Stack Version:**

| Feature | Full-Stack | Static |
|---------|------------|---------|
| **Backend** | Express.js | None |
| **API Calls** | Yes | No |
| **Calculations** | Server-side | Client-side |
| **Hosting** | Node.js required | Static hosting |
| **Performance** | Server dependency | Instant loading |

### 💡 **Why This Version is Better for Netlify:**

1. **Faster Loading:** No server startup time
2. **Lower Cost:** No server costs
3. **Better Scaling:** CDN-distributed static files
4. **Simpler Deployment:** No backend configuration needed
5. **Offline Capable:** Works without internet after first load

The app maintains all its functionality while being perfectly suited for static hosting platforms like Netlify!
