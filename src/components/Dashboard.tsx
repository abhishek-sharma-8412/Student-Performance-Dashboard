'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, Sparkles, Brain, TrendingUp } from 'lucide-react';
import FileUpload from './FileUpload';
import DataOverview from './DataOverview';
import MetricsCards from './MetricsCards';
import FeatureImportanceChart from './FeatureImportanceChart';
import PredictedVsActualChart from './PredictedVsActualChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MLResults {
  success: boolean;
  metrics: {
    r2: number;
    mae: number;
    mse: number;
    rmse: number;
    cv_r2_mean: number;
    cv_r2_std: number;
  };
  best_params: any;
  feature_importance: Array<{
    feature: string;
    importance: number;
  }>;
  predicted_vs_actual: Array<{
    actual: number;
    predicted: number;
  }>;
  dataset_overview: {
    total_rows: number;
    total_columns: number;
    sample_data: any[];
    column_names: string[];
  };
  predictions_csv: string;
}

export default function Dashboard() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<MLResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResults(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/process-ml', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error('Failed to process file');
      }

      const data = await response.json();
      
      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || 'Processing failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadPredictions = () => {
    if (!results?.predictions_csv) return;

    const blob = new Blob([results.predictions_csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_predictions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl"
            >
              <Brain className="h-12 w-12 text-white" />
            </motion.div>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            Student Performance Dashboard
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            AI-Powered Assessment Score Prediction with Advanced Machine Learning
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>XGBoost ML Model</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Real-time Analytics</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="max-w-7xl mx-auto space-y-8">
          <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-effect border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                    </motion.div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Processing Your Data
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Running advanced machine learning pipeline with XGBoost...
                      </p>
                    </div>
                    
                    <div className="w-full max-w-md mx-auto">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center text-red-600 dark:text-red-400">
                    <h3 className="font-semibold mb-2 text-lg">Processing Error</h3>
                    <p className="mb-4">{error}</p>
                    <div className="text-sm text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                      <p className="font-medium mb-2">Required CSV format:</p>
                      <p>Columns: comprehension, attention, focus, retention, engagement_time, assessment_score</p>
                      <p className="mt-1">All values must be numeric and complete (no missing values)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex justify-between items-center"
              >
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Analysis Results
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your machine learning model has been successfully trained and evaluated
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={downloadPredictions} 
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Predictions</span>
                  </Button>
                </motion.div>
              </motion.div>

              <DataOverview overview={results.dataset_overview} />
              <MetricsCards metrics={results.metrics} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FeatureImportanceChart data={results.feature_importance} />
                <PredictedVsActualChart data={results.predicted_vs_actual} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}