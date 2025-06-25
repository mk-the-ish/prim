# Prim School Management System

Prim is a comprehensive school management system built with React, Supabase, and Flask. It provides tools for managing students, billing, academic terms, cash transactions, and reporting, with a modern dashboard and role-based access.

---

## Features

- **Student Management:** Add, view, and update student records, grades, and balances.
- **Billing & Invoicing:** Bulk invoicing, new term billing, and academic year upgrades.
- **Bank Transactions:** Manage and view CBZ and ZB bank transactions (USD/ZWG).
- **Petty Cash:** Track petty cash in/out, view balances, and add transactions.
- **Dashboard:** Visualize key statistics, cash flow, and student data with charts.
- **Role-Based Access:** Admin, bursar, and viewer roles with secure authentication.
- **Dark/Light Mode:** Toggle theme for better accessibility.
- **Supabase Edge Functions:** Secure backend logic for term billing and academic year upgrades.
- **Responsive UI:** Works well on desktop and mobile devices.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)
- [Supabase](https://supabase.com/) account and project
- (Optional) [Python 3](https://www.python.org/) for backend scripts

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/prim.git
    cd prim
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Configure Supabase:**
    - Copy your Supabase project URL and anon key into `src/db/SupaBaseConfig.js`.

4. **Start the development server:**
    ```sh
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

- **Login:** Use your admin, bursar, or viewer credentials.
- **Dashboard:** View statistics, charts, and quick actions.
- **Billing:** Use the floating action button to bill a new term or upgrade the academic year (admin only).
- **Transactions:** Navigate to bank and petty cash sections for detailed records.
- **Theme:** Toggle light/dark mode from the topbar.

---

## Supabase Edge Functions

- **bill-new-term:** Handles new term billing for all students.
- **new-academic-year:** Upgrades all students to the next academic year.

Deploy these functions using the [Supabase CLI](https://supabase.com/docs/guides/functions).

---

## Scripts

- `npm start` – Run the app in development mode.
- `npm test` – Launch the test runner.
- `npm run build` – Build the app for production.

---

## Folder Structure

```plaintext
prim/
├── public/                  # Static files
│   ├── index.html
│   └── favicon.ico
│
├── src/                     # Source files
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── db/                 # Database configuration and hooks
│   ├── functions/           # Supabase Edge Functions
│   ├── App.js               # Main app component
│   └── index.js            # Entry point
│
├── .env                     # Environment variables
├── .gitignore               # Ignored files and folders
├── package.json             # Project metadata and dependencies
└── README.md               # Project documentation
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [React](https://reactjs.org/)
- [Supabase](https://supabase.com/)
- [Flask](https://flask.palletsprojects.com/)
