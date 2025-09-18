'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, BarChart3, Activity, Zap, Award, TrendingDown } from 'lucide-react';

interface MetricsCardsProps {
  metrics: {
    r2: number;
    mae: number;
    mse: number;
    rmse: number;
    cv_r2_mean: number;
    cv_r2_std: number;
  };
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'R² Score',
      value: metrics.r2.toFixed(4),
      description: 'Coefficient of determination',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100 dark:bg-green-900/50',
      gradient: 'from-green-500 to-emerald-500',
      status: metrics.r2 > 0.8 ? 'excellent' : metrics.r2 > 0.6 ? 'good' : 'needs improvement'
    },
    {
      title: 'Mean Absolute Error',
      value: metrics.mae.toFixed(4),
      description: 'Average prediction error',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      gradient: 'from-blue-500 to-cyan-500',
      status: metrics.mae < 3 ? 'excellent' : metrics.mae < 5 ? 'good' : 'needs improvement'
    },
    {
      title: 'Root Mean Square Error',
      value: metrics.rmse.toFixed(4),
      description: 'Standard deviation of errors',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      iconBg: 'bg-purple-100 dark:bg-purple-900/50',
      gradient: 'from-purple-500 to-violet-500',
      status: metrics.rmse < 4 ? 'excellent' : metrics.rmse < 6 ? 'good' : 'needs improvement'
    },
    {
      title: 'Cross-Validation R²',
      value: `${metrics.cv_r2_mean.toFixed(4)} ± ${metrics.cv_r2_std.toFixed(4)}`,
      description: '5-fold CV performance',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      iconBg: 'bg-orange-100 dark:bg-orange-900/50',
      gradient: 'from-orange-500 to-amber-500',
      status: metrics.cv_r2_mean > 0.8 ? 'excellent' : metrics.cv_r2_mean > 0.6 ? 'good' : 'needs improvement'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Award className="h-4 w-4 text-green-500" />;
      case 'good':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      default:
        return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 dark:text-green-400';
      case 'good':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="group"
        >
          <Card className={`${card.bgColor} ${card.borderColor} border-2 hover:shadow-2xl transition-all duration-300 overflow-hidden relative`}>
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </CardTitle>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`p-2 rounded-lg ${card.iconBg}`}
              >
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </motion.div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <motion.div 
                className={`text-3xl font-bold ${card.color} mb-2`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
              >
                {card.value}
              </motion.div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {card.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-1 text-xs ${getStatusColor(card.status)}`}>
                  {getStatusIcon(card.status)}
                  <span className="capitalize font-medium">{card.status}</span>
                </div>
                
                <motion.div
                  className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                >
                  <motion.div
                    className={`h-full bg-gradient-to-r ${card.gradient} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: card.status === 'excellent' ? '100%' : card.status === 'good' ? '70%' : '40%' }}
                    transition={{ delay: index * 0.1 + 0.7, duration: 1 }}
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}