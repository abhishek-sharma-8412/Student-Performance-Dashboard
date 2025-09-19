# Student Performance Dashboard

> 🚀 Live Demo: [student-performance-dashboard-xl8l.vercel.app](https://student-performance-dashboard-xl8l.vercel.app/)

For the latest deployed version, visit the link above. This is the production deployment on Vercel.

## Screenshots

<div align="center">
  <img src="screenshots/Screenshot 2025-09-19 193047.png" alt="Dashboard Overview" width="800"/>
  <p><em>Dashboard Overview</em></p>
</div>

<div align="center">
  <img src="screenshots/Screenshot 2025-09-19 193056.png" alt="File Upload Interface" width="800"/>
  <p><em>File Upload Interface</em></p>
</div>

<div align="center">
  <img src="screenshots/Screenshot 2025-09-19 193105.png" alt="ML Results Display" width="800"/>
  <p><em>ML Results Display</em></p>
</div>

<div align="center">
  <img src="screenshots/Screenshot 2025-09-19 193112.png" alt="Feature Importance Chart" width="800"/>
  <p><em>Feature Importance Chart</em></p>
</div>

An extraordinary Next.js application with a modern UI/UX dashboard for predicting student assessment scores using Machine Learning.

## Features

- **Dynamic File Upload**: Drag-and-drop CSV file upload with validation
- **Machine Learning Pipeline**: XGBoost with RandomizedSearchCV hyperparameter tuning
- **Interactive Dashboard**: Beautiful metrics cards, charts, and data visualization
- **Dark/Light Mode**: Toggle between themes for better usability
- **Real-time Processing**: Live progress tracking during ML processing
- **Export Functionality**: Download predictions as CSV

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Framer Motion, Recharts
- **Backend**: Python, Pandas, NumPy, Scikit-learn, XGBoost
- **UI Components**: shadcn/ui, Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Installation

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Upload Dataset**: Drag and drop a CSV file containing student data
2. **Wait for Processing**: The ML pipeline will run automatically
3. **View Results**: Explore metrics, charts, and feature importance
4. **Download Predictions**: Export the results with predicted scores

## Dataset Format

Your CSV file should contain the following columns:
- `comprehension`: Student comprehension score (0-100)
- `attention`: Student attention score (0-100) 
- `focus`: Student focus score (0-100)
- `retention`: Student retention score (0-100)
- `engagement_time`: Time spent engaged (minutes)
- `assessment_score`: Target assessment score (0-100)

## Sample Data

A sample dataset (`sample_student_data.csv`) is included for testing.

## Features Overview

### Dashboard Sections

1. **Data Overview**: Dataset summary with row/column counts and sample preview
2. **Model Performance**: R², MAE, MSE, RMSE metrics with stylish cards
3. **Cross-validation Results**: Mean ± std R² scores across 5 folds
4. **Feature Importance**: Interactive bar chart showing feature contributions
5. **Predicted vs Actual**: Scatter plot showing prediction accuracy

### Machine Learning Pipeline

- **Feature Engineering**: Creates derived features (mean_cognitive, attention_focus, etc.)
- **Hyperparameter Tuning**: RandomizedSearchCV with 30 iterations
- **Cross-validation**: 5-fold CV for robust performance estimation
- **Scaling**: StandardScaler for feature normalization

## Project Structure

```
student-performance-dashboard/
├── src/
│   ├── app/
│   │   ├── api/process-ml/     # ML processing API
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── FileUpload.tsx      # File upload component
│   │   ├── MetricsCards.tsx    # Performance metrics
│   │   ├── DataOverview.tsx    # Dataset overview
│   │   ├── FeatureImportanceChart.tsx
│   │   ├── PredictedVsActualChart.tsx
│   │   ├── ThemeProvider.tsx   # Theme context
│   │   └── ThemeToggle.tsx     # Dark/light toggle
│   └── lib/
│       └── utils.ts            # Utility functions
├── ml_model.py                 # Python ML script
├── requirements.txt            # Python dependencies
└── sample_student_data.csv     # Sample dataset
```

## Development

### Adding New Features

1. Create components in `src/components/`
2. Add API routes in `src/app/api/`
3. Update types and interfaces as needed
4. Test with sample data

### Styling

- Uses TailwindCSS with custom design system
- Dark mode support via CSS variables
- Responsive design for all screen sizes
- Framer Motion for smooth animations

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions, please open an issue on GitHub.