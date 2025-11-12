
# 
![Merinfo Data Viewer Screenshot](https://i.imgur.com/example.png) 
*Note: Replace with an actual screenshot of the application.*

---

## About The Project

This project is an interactive data visualization tool designed to make complex company information easily accessible. Users can select from a pre-loaded list of datasets (hosted on GitHub) to instantly browse, search, and apply advanced filters. The interface is clean, responsive, and includes both a detailed card view and a compact list view for tailored data exploration.

Built with performance and user experience in mind, this tool empowers users to quickly analyze and find insights within large sets of company records without any backend setup.

### Key Features

*   **Pre-loaded Datasets**: Select from a curated list of datasets from the `alshfu/merinfo_scraper` GitHub repository.
*   **Powerful Search**: Instantly find companies by name, organization number, or city.
*   **Advanced Filtering**:
    *   Filter by financial metrics (Revenue, Profit, Assets) using min/max ranges.
    *   Filter by the presence of company or board member phone numbers.
    *   Multi-select filtering for SNI industry codes and custom categories.
*   **Flexible Sorting**: Sort data by company name, registration date, or any financial metric in ascending or descending order.
*   **Dual View Modes**: Switch between a detailed `Card View` for in-depth analysis and a compact, expandable `List View` for a high-level overview.
*   **Multi-Language Support**: Fully localized in Swedish (SV) and Russian (RU).
*   **Theming**: Switch between Light, Dark, and System theme options for comfortable viewing.
*   **Responsive Design**: A seamless experience across desktop, tablet, and mobile devices.

### Tech Stack

*   **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Localization**: Custom React Hooks

---

## Getting Started

This is a pure frontend application with no build step required.

1.  Clone the repository or download the source code.
2.  Open the `index.html` file in your web browser.

## Usage

1.  **Load Data**: Use the dropdown menu to select a dataset from the list. The data will be loaded automatically from GitHub.
2.  **Search**: Use the search bar to filter results based on company name, organization number, or city.
3.  **Sort**: Select a sorting option from the dropdown to organize the data.
4.  **Filter**: Click on "Advanced filters" to reveal more specific filtering options for financials, contact details, and industry classifications.
5.  **Change View**: Toggle between the grid and list views using the icons in the control panel.

---

## Data Format

The application expects an array of company objects in a `.json` file, or one company object per line in a `.jsonl` file. Each object should conform to the following structure:

```json
{
  "company": {
    "name": "Example AB",
    "org_number": "555555-5555",
    "legal_form": "Aktiebolag",
    "status": "Bolaget är aktivt",
    "registration_date": "2020-01-15"
  },
  "contact": {
    "phone": "08-123 45 67",
    "address": "Exempelvägen 1",
    "city": "Stockholm",
    "county": "Stockholms län"
  },
  "financials": {
    "period": "2023",
    "revenue": 15000000,
    "profit_after_financial_items": 2500000,
    "net_profit": 1900000,
    "total_assets": 8000000
  },
  "industry": {
    "activity_description": "Konsultverksamhet avseende företags organisation",
    "sni_code": "70220",
    "sni_description": "Konsultverksamhet avseende företags organisation",
    "categories": ["Consulting", "B2B"]
  },
  "tax_info": {
    "f_skatt": true,
    "vat_registered": true,
    "employer_registered": true
  },
  "board": [
    {
      "name": "Anna Andersson",
      "role": "Styrelseledamot",
      "age": 45,
      "phone": "070-111 22 33",
      "address": {
        "street": "Gågatan 5",
        "postal_code": "111 22",
        "city": "Stockholm"
      }
    }
  ]
}
```
All fields are optional, but the application will provide the best experience with complete data.