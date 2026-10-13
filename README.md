# ✈️ BrewHaus Practicum — Luxury Travel Agency Website

Welcome to the central repository for the **BrewHaus Practicum** web development project. This repository tracks the weekly evolution of a modern, responsive **Luxury Travel Agency landing page**, built progressively from foundational web standards to a modern frontend React architecture.

---

## 👥 Group & Project Information

* **Program:** BrewHaus Practicum
* **Group / Team:** Group C-5 / Team 10
* **Student Name:** Mohamed
* **Project Domain:** Luxury Travel Agency

---

## 🚀 Project Overview

This project is built iteratively across the practicum modules:

* **Week 1:** HTML5 Semantic Layout & Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Mobile-First Design).
* **Week 2:** React (scaffolded with Vite), Tailwind CSS componentization, dynamic array dataset mapping, stateful filtering using `useState`, and controlled dynamic components.
* **Week 3+:** Backend Integration & API Services *(Upcoming)*.

---

## 🛠️ Tech Stack & Architecture

* **Framework & Build Tool:** [Vite](https://vitejs.dev/) + [React](https://react.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Version Control:** Git & GitHub

---

## 📂 Project Structure

```text
├── public/               # Static assets & images
├── src/
│   ├── assets/           # Media & visual resources
│   ├── components/       # Modular React Components
│   │   ├── Header.jsx    # Navigation & Brand Header
│   │   ├── Hero.jsx      # High-impact Hero section & CTAs
│   │   ├── TourGrid.jsx  # Filterable grid layout container
│   │   ├── TourCard.jsx  # Reusable item card component
│   │   └── Footer.jsx    # Links, copyright, and contact details
│   ├── data/
│   │   └── tours.js      # Array of tour objects (dataset)
│   ├── App.jsx           # Root Application component & core state
│   ├── main.jsx          # Vite React entry point
│   └── index.css         # Tailwind directive setup
├── index.html            # Single Page Application entry
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── README.md             # Project documentation
```

---

## 💻 Local Setup & Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ourhouchmohamed97/brewhaus-practicum.git
   cd brewhaus-practicum
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local server URL provided in your terminal (typically `http://localhost:5173`).

---

## 🎯 Key Features (Week 2 Implementation)

* 🎨 **Tailwind CSS Utility Design:** Completely rebuilt layout using modern mobile-first Tailwind utilities with zero legacy external CSS dependencies.
* 🧩 **Modular Component Architecture:** Clean separation of UI into dedicated functional React components.
* 📊 **Dynamic Data Rendering:** Destinations and tour packages mapped directly from structured JavaScript objects (`src/data/tours.js`).
* 🔍 **Stateful Grid Filtering:** Interactive category filtering built using React's `useState` hook.
* 🎛️ **Controlled Component:** Reusable stateful component (e.g., booking seat stepper / rating toggle) integrated into individual item cards.
* 📱 **Responsive Design:** Seamless layout adaptivity across mobile, tablet, and desktop viewports with zero horizontal scrolling.

---

## 📄 License

This repository is developed for educational purposes as part of the **BrewHaus Practicum** course.