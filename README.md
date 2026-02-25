# Nexify — Full-Stack MERN E-Commerce Platform

A complete MERN (MongoDB, Express, React, Node.js) stack application for buying and selling phones with user authentication, product management, shopping cart, and checkout system.

## Features

✅ **User Authentication** — Secure registration and login with JWT tokens  
✅ **Product Listing** — Browse available phones, view details, and seller info  
✅ **Sell Products** — Upload phones with images, price, and description  
✅ **Shopping Cart** — Add products to cart, update quantities, view total  
✅ **Checkout** — Seamless purchase flow with order confirmation  
✅ **Comments & Reviews** — Leave remarks on products  
✅ **Input Validation** — Server-side validation with express-validator  
✅ **Protected Routes** — Dashboard only accessible to authenticated users  
✅ **Responsive Design** — Mobile-friendly UI with Bootstrap  
✅ **API Tests** — Vitest + Supertest for endpoint testing  

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (or set MONGO_URI for Atlas)
- npm or yarn

### Installation & Setup

1. **Clone and install dependencies:**
```bash
cd c:\Users\DELL\OneDrive\Desktop\Nexify

# Install client dependencies
npm install

# Install server dependencies
npm --prefix server install
```

2. **Create `.env` file in `server/` folder:**
```bash
# Copy .env.example or create new .env
Copy-Item server\.env.example server\.env

# Edit server/.env with your settings:
# MONGO_URI=mongodb://127.0.0.1:27017/nexify
# PORT=5000
# JWT_SECRET=your_secret_key_here
```

3. **Ensure MongoDB is running:**
```bash
# Start MongoDB (local)
&"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath C:\data\db

# Or use Docker:
docker run --name nexify-mongo -p 27017:27017 -d mongo:6.0

# Or use MongoDB Atlas (update MONGO_URI in .env with your connection string)
```

4. **Start the development servers:**
```bash
npm run dev
```

Both client (Vite on http://localhost:5173) and server (Express on port 5000) will start concurrently. The client proxies `/api` calls to the server automatically during development.

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user  
- `POST /api/auth/login` — Login user  

### Products
- `GET /api/products` — List all products  
- `POST /api/products` — Create product (auth, multipart/form-data)  
- `POST /api/products/:id/buy` — Purchase product (auth)  
- `POST /api/products/:id/comment` — Add comment (auth)  

### Cart
- `GET /api/cart` — Get user's cart (auth)  
- `POST /api/cart/add` — Add to cart (auth)  
- `POST /api/cart/remove` — Remove from cart (auth)  
- `POST /api/cart/update` — Update quantity (auth)  
- `POST /api/cart/checkout` — Complete purchase (auth)  

## Development

### Run Tests
```bash
npm --prefix server test

# Watch mode:
npm --prefix server test -- --watch
```

### Scripts
```bash
npm run client        # Run Vite dev server only
npm run server        # Run Express server only (nodemon)
npm run dev           # Run both concurrently
npm run build         # Build React app for production
npm run lint          # Run ESLint
```

### Project Structure
```
.
├── src/                          # React frontend
│   ├── pages/                    # LoginPage, RegisterPage, Dashboard
│   ├── components/               # Navbar, ProtectedRoute, etc.
│   ├── App.jsx                   # Main app with routing
│   └── index.css                 # Global styles
├── server/                       # Express backend
│   ├── models/                   # User, Product, Cart schemas
│   ├── routes/                   # auth, products, cart endpoints
│   ├── middleware/               # auth.js (JWT verification)
│   ├── index.js                  # Express app
│   ├── tests.test.js             # Vitest suite
│   └── uploads/                  # Uploaded product images
├── package.json                  # Client dependencies & scripts
└── server/package.json           # Server dependencies & scripts
```

## Key Technologies

**Frontend:**
- React 19 with React Router for navigation
- React-Bootstrap for UI components
- Vite as build tool
- CSS Grid & Flexbox for layouts

**Backend:**
- Express.js for REST API
- Mongoose for MongoDB ODM
- bcryptjs for password hashing
- jsonwebtoken for auth
- multer for file uploads
- express-validator for input validation

**Testing & Dev:**
- Vitest for unit/integration tests
- Supertest for HTTP testing
- Nodemon for auto-reload
- ESLint for code quality

## User Flow

1. **Register** at `/register` with email, name, and password
2. **Login** at `/login` with credentials
3. **View Products** on dashboard (buy directly or add to cart)
4. **Sell Products** upload with title, price, description, and image
5. **Add to Cart** and checkout for multiple purchases
6. **Leave Comments** on products for feedback
7. **Logout** when done (clears token and redirects to login)

## Environment Variables

Create `server/.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/nexify
PORT=5000
JWT_SECRET=change_me_to_a_strong_secret
```

For MongoDB Atlas, use the connection string from your cluster:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nexify?retryWrites=true&w=majority
```

## Troubleshooting

**MongoDB connection refused?**
- Ensure mongod is running: `mongod --dbpath C:\data\db`
- Or use Docker: `docker run --name nexify-mongo -p 27017:27017 -d mongo:6.0`
- Or update MONGO_URI to your Atlas cluster

**Port 5000 already in use?**
- Kill the process: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)
- Or change PORT in `server/.env` and restart

**Images not uploading?**
- Ensure `server/uploads/` folder exists
- Check file permissions
- Images are served at `/uploads/<filename>`

**CORS errors?**
- CORS is enabled for all origins in dev mode
- Update in `server/index.js` for production: `cors({ origin: 'https://yourdomain.com' })`

## Next Steps (Production)

- [ ] Add payment integration (Stripe, PayPal)
- [ ] Deploy frontend to Vercel or Netlify
- [ ] Deploy server to Heroku, Railway, or Render
- [ ] Set up MongoDB Atlas prod database
- [ ] Add email notifications (SendGrid, Mailgun)
- [ ] Implement image optimization (AWS S3 or Cloudinary)
- [ ] Add admin dashboard for moderation
- [ ] Set up CI/CD pipeline (GitHub Actions)

## License

MIT

---

**Happy selling! 🚀**
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
