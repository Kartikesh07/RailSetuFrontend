# Railway AI Decision Support - Frontend Dashboard

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Tailwind CSS](https://img.shields.io/badge/tailwind%20css-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-badge-id/deploy-status)](https://app.netlify.com/sites/your-netlify-site-name/deploys)

This repository contains the React-based frontend for the Railway AI Decision Support System. It provides a comprehensive, real-time dashboard for monitoring train traffic and visualizing the AI's operational recommendations.

### [Live Demo Link](https://railsetu.netlify.app/)



### Key Features

-   **Real-time Metrics**: Displays key performance indicators (KPIs) like active trains, average delay, and bottleneck utilization.
-   **Interactive Track Map**: A dynamic, responsive view of the entire railway section.
    -   **Desktop**: A horizontal map showing live train positions, stations, and conflict zones.
    -   **Mobile**: An optimized vertical list view, sorting trains and stations by their position for clear readability.
-   **Detailed Data Table**: An interactive table of all trains with features for searching, filtering (by status or critical AI decisions), and sorting.
-   **Transparent AI**: Clearly presents the AI's recommended action, confidence score, and human-readable reasoning in a hover-over tooltip.
-   **Intelligent Loading Indicator**: Manages user expectations by showing a special message during the backend server's "cold start" spin-up time.
-   **Fully Responsive Design**: The UI is optimized for a seamless experience on both desktop and mobile devices.

### Technology Stack

-   **Framework**: React
-   **Styling**: Tailwind CSS
-   **Icons**: React Icons
-   **Deployment**: Netlify

---

### Getting Started (Local Setup)

Follow these instructions to get the frontend running on your local machine.

**Prerequisites:**
-   Node.js (v16 or higher) and npm
-   A running instance of the [backend API](https://github.com/Kartikesh07/RailSetuBackend)

**1. Clone the repository:**
```bash
git clone https://github.com/Kartikesh07/RailSetuFrontend.git
cd railway-ai-dashboard
```

**2. Install dependencies:**
```bash
npm install
```

**3. Configure Environment Variables:**
Create a `.env` file in the root of the project. This file tells the frontend where to find the backend API.
```bash
touch .env
```
Add the following line to your new `.env` file. For local development, this will point to your locally running backend.
```
VITE_REACT_APP_API_URL=http://localhost:5000
```

**4. Start the development server:**
```bash
npm start
```
The application will open in your browser at `http://localhost:3000`.

### Deployment

This frontend is deployed on **Netlify**, which is optimized for hosting high-performance static sites.

-   **Build Command**: `npm run build`
-   **Publish Directory**: `build`

**Crucial Step:** For the deployed frontend to work, you must set the `VITE_REACT_APP_API_URL` environment variable in the Netlify UI (**Site configuration > Build & deploy > Environment**). The value should be the full URL of your deployed Render backend, for example: `https://railway-ai-backend.onrender.com`.