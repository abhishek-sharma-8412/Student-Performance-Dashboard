import pandas as pd
import numpy as np
import json
import sys
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

def process_student_data(csv_path):
    """
    Process student data and train ML model (simplified version)
    """
    try:
        # Load dataset
        df = pd.read_csv(csv_path)
        
        # Check if required columns exist
        required_columns = ['comprehension', 'attention', 'focus', 'retention', 'engagement_time', 'assessment_score']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            return {
                'success': False,
                'error': f'Missing required columns: {missing_columns}. Please ensure your CSV has columns: {required_columns}'
            }
        
        # Check if there are any rows
        if len(df) == 0:
            return {
                'success': False,
                'error': 'The CSV file is empty. Please provide a file with data.'
            }
        
        # Check for missing values
        missing_values = df[required_columns].isnull().sum()
        if missing_values.any():
            missing_cols = missing_values[missing_values > 0].index.tolist()
            return {
                'success': False,
                'error': f'Missing values found in columns: {missing_cols}. Please ensure all data is complete.'
            }
        
        # Check data types - ensure numeric columns are numeric
        numeric_columns = required_columns
        for col in numeric_columns:
            if not pd.api.types.is_numeric_dtype(df[col]):
                try:
                    df[col] = pd.to_numeric(df[col], errors='coerce')
                    if df[col].isnull().any():
                        return {
                            'success': False,
                            'error': f'Column "{col}" contains non-numeric values that cannot be converted.'
                        }
                except:
                    return {
                        'success': False,
                        'error': f'Column "{col}" contains non-numeric values.'
                    }
        
        # Feature engineering
        df['mean_cognitive'] = (df['comprehension'] + df['attention'] + df['focus'] + df['retention']) / 4
        df['attention_focus'] = df['attention'] * df['focus']
        df['comprehension_retention'] = df['comprehension'] * df['retention']

        features = [
            'comprehension', 'attention', 'focus', 'retention',
            'engagement_time', 'mean_cognitive', 'attention_focus', 'comprehension_retention'
        ]
        X = df[features]
        y = df['assessment_score']

        # Feature scaling
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Train/test split
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

        # Simple Random Forest model (robust for serverless)
        rf = RandomForestRegressor(
            n_estimators=300,
            max_depth=10,
            random_state=42,
            n_jobs=1
        )
        rf.fit(X_train, y_train)
        y_pred = rf.predict(X_test)

        # Metrics
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)

        # Simple cross-validation
        cv_scores = cross_val_score(rf, X_scaled, y, cv=3, scoring='r2')

        # Feature importance
        importances = rf.feature_importances_
        feature_importance_df = pd.DataFrame({'feature': features, 'importance': importances})
        feature_importance_df = feature_importance_df.sort_values('importance', ascending=False)

        # Generate predictions for all data
        y_all_pred = rf.predict(X_scaled)
        
        # Create results dataframe with predictions
        results_df = df.copy()
        results_df['predicted_score'] = y_all_pred

        # Prepare data for charts
        predicted_vs_actual = []
        for i in range(len(y_test)):
            predicted_vs_actual.append({
                'actual': float(y_test.iloc[i]),
                'predicted': float(y_pred[i])
            })

        # Prepare feature importance data
        feature_importance_data = []
        for _, row in feature_importance_df.iterrows():
            feature_importance_data.append({
                'feature': row['feature'],
                'importance': float(row['importance'])
            })

        # Dataset overview
        dataset_overview = {
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'sample_data': df.head(5).to_dict('records'),
            'column_names': list(df.columns)
        }

        # Return results
        results = {
            'success': True,
            'metrics': {
                'r2': float(r2),
                'mae': float(mae),
                'mse': float(mse),
                'rmse': float(rmse),
                'cv_r2_mean': float(cv_scores.mean()),
                'cv_r2_std': float(cv_scores.std())
            },
            'best_params': {
                'n_estimators': 300,
                'max_depth': 10
            },
            'feature_importance': feature_importance_data,
            'predicted_vs_actual': predicted_vs_actual,
            'dataset_overview': dataset_overview,
            'predictions_csv': results_df.to_csv(index=False)
        }

        return results

    except FileNotFoundError:
        return {
            'success': False,
            'error': 'File not found. Please ensure the CSV file exists and is accessible.'
        }
    except pd.errors.EmptyDataError:
        return {
            'success': False,
            'error': 'The CSV file is empty or corrupted. Please provide a valid CSV file with data.'
        }
    except pd.errors.ParserError as e:
        return {
            'success': False,
            'error': f'Error parsing CSV file: {str(e)}. Please ensure the file is a valid CSV format.'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Unexpected error: {str(e)}'
        }

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"success": False, "error": "Please provide CSV file path"}))
        sys.exit(1)
    
    csv_path = sys.argv[1]
    results = process_student_data(csv_path)
    print(json.dumps(results))
