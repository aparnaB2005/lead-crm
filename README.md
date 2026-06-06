# LeadFlow CRM 🚀

A full-stack Lead Management CRM for small businesses built with **React.js**, **Node.js + Express**, and **MongoDB**.

---

## ✨ Features

### Core
- ➕ **Add new leads** with all required fields
- 📋 **Dashboard** with lead statistics and charts
- ✏️ **Edit lead** details via modal or dedicated page
- 🗑️ **Delete leads** with confirmation dialog
- 🔄 **Update lead status** inline from the table
- 🔍 **Search** by name, email, or company (real-time)

### Bonus
- 📊 **Statistics dashboard** — total leads, conversion rate, pipeline value
- 📈 **Charts** — monthly trend (bar), status distribution (pie), pipeline breakdown
- 📄 **Pagination** — configurable page size (5/10/20/50)
- ↕️ **Sorting** — by name, status, value, date created
- 🎛️ **Filtering** — by status
- 📱 **Fully responsive** — works on mobile, tablet, desktop
- 🌙 **Dark theme** UI with polished design

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React.js + Vite, React Router, Recharts, React Hot Toast |
| Backend   | Node.js + Express.js                |
| Database  | MongoDB + Mongoose ODM              |
| Styling   | CSS Modules + CSS Variables         |

---

## 📁 Project Structure

```
crm/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Lead.js           # Mongoose schema
│   │   ├── controllers/
│   │   │   └── leadController.js # Business logic
│   │   ├── routes/
│   │   │   └── leads.js          # API routes
│   │   ├── server.js             # Express app
│   │   └── seed.js               # Sample data seeder
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── leads.js          # Axios API layer
    │   ├── components/
    │   │   ├── Sidebar.jsx       # Navigation sidebar
    │   │   ├── LeadsTable.jsx    # Data table with search/sort/filter
    │   │   ├── LeadModal.jsx     # Add/edit lead modal
    │   │   └── StatsCard.jsx     # Dashboard stat cards
    │   ├── hooks/
    │   │   └── useLeads.js       # Custom data hooks
    │   ├── pages/
    │   │   ├── Dashboard.jsx     # Stats overview page
    │   │   ├── LeadsPage.jsx     # All leads table page
    │   │   └── AddLeadPage.jsx   # Dedicated add lead page
    │   ├── utils/
    │   │   └── helpers.js        # Utility functions
    │   └── index.css             # Global design tokens
    ├── .env.example
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone https://github.com/your-username/lead-crm.git
cd lead-crm
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env and set MONGO_URI

# Start the server
npm run dev        # Development (with nodemon)
npm start          # Production

# (Optional) Seed sample data
npm run seed
```

The API will run on **http://localhost:5000**

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit VITE_API_URL if your backend is on a different port

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will run on **http://localhost:5173**

---

## 🔌 API Reference

### Base URL: `http://localhost:5000/api`

| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| GET    | `/leads`           | Get all leads (paginated)       |
| POST   | `/leads`           | Create a new lead               |
| GET    | `/leads/:id`       | Get a single lead               |
| PUT    | `/leads/:id`       | Update a lead                   |
| DELETE | `/leads/:id`       | Delete a lead                   |
| GET    | `/leads/search`    | Search leads (`?q=query`)       |
| GET    | `/leads/stats`     | Get aggregated statistics       |
| GET    | `/health`          | Health check                    |

### Query Parameters for `GET /leads`

| Param      | Type    | Default     | Description                              |
|------------|---------|-------------|------------------------------------------|
| page       | number  | 1           | Page number                              |
| limit      | number  | 10          | Results per page (max 100)              |
| search     | string  | —           | Search name/email/company               |
| status     | string  | —           | Filter by status                         |
| sortBy     | string  | createdAt   | name / email / status / value / createdAt |
| sortOrder  | string  | desc        | asc / desc                              |

### Lead Schema

```json
{
  "name": "string (required)",
  "email": "string (required, unique format)",
  "phone": "string",
  "company": "string",
  "status": "New | Contacted | Qualified | Converted | Lost",
  "notes": "string",
  "source": "Website | Referral | Social Media | Cold Call | Email | Other",
  "value": "number (deal value)",
  "createdAt": "date (auto)",
  "updatedAt": "date (auto)"
}
```

---

## 🌐 Deployment

### Backend (Railway / Render / Fly.io)
1. Set `MONGO_URI` environment variable to your MongoDB Atlas connection string
2. Set `NODE_ENV=production`
3. Set `CLIENT_URL` to your frontend URL (for CORS)
4. Deploy the `/backend` folder

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed backend URL
2. Build command: `npm run build`
3. Output directory: `dist`

---

## 🎨 Design Decisions

- **Dark theme** with deep navy/slate palette for professional look
- **Syne font** (display) + **Inter** (body) + **JetBrains Mono** (data) typography stack
- **CSS Modules** for component-scoped styles
- **Custom hooks** (`useLeads`, `useStats`) to separate data logic from UI
- **Optimistic UI updates** — status changes reflect instantly
- **Debounce** not needed as server-side search is fast; React state drives re-fetches

---

## 📝 License

MIT
