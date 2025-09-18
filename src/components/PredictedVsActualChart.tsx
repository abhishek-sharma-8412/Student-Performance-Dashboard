'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Target } from 'lucide-react';

interface PredictedVsActualChartProps {
  data: Array<{
    actual: number;
    predicted: number;
  }>;
}

export default function PredictedVsActualChart({ data }: PredictedVsActualChartProps) {
  // Calculate R² for display
  const actualMean = data.reduce((sum, item) => sum + item.actual, 0) / data.length;
  const ssRes = data.reduce((sum, item) => sum + Math.pow(item.actual - item.predicted, 2), 0);
  const ssTot = data.reduce((sum, item) => sum + Math.pow(item.actual - actualMean, 2), 0);
  const r2 = 1 - (ssRes / ssTot);

  // Find min and max values for perfect line
  const allValues = data.flatMap(item => [item.actual, item.predicted]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Predicted vs Actual Scores</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="actual" 
                  name="Actual Score"
                  label={{ value: 'Actual Score', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="predicted" 
                  name="Predicted Score"
                  label={{ value: 'Predicted Score', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [value.toFixed(2), name]}
                  labelFormatter={(label) => `Actual: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#f9fafb', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <ReferenceLine 
                  y={minVal} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  label={{ value: "Perfect Prediction", position: "top" }}
                />
                <ReferenceLine 
                  y={maxVal} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                />
                <Scatter 
                  dataKey="predicted" 
                  fill="#3b82f6"
                  r={4}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              R² Score: <span className="font-semibold text-blue-600">{r2.toFixed(4)}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Points closer to the diagonal line indicate better predictions
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
