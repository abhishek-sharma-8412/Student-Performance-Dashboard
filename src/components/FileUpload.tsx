'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, X, Cloud, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

export default function FileUpload({ onFileUpload, isProcessing }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false,
    disabled: isProcessing
  });

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="w-full max-w-3xl mx-auto glass-effect border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardContent className="p-8">
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 relative overflow-hidden
                ${isDragActive 
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-105 shadow-lg' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 hover:scale-102'
                }
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              
              <motion.div
                animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative z-10"
              >
                <motion.div
                  animate={isDragActive ? { y: -10 } : { y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <div className="relative inline-block">
                    <motion.div
                      animate={{ rotate: isDragActive ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Cloud className="mx-auto h-16 w-16 text-blue-500" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: isDragActive ? 1.2 : 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-2 -right-2"
                    >
                      <Upload className="h-8 w-8 text-purple-500" />
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                  animate={{ color: isDragActive ? '#3b82f6' : undefined }}
                >
                  {isDragActive ? 'Drop your CSV file here' : 'Upload Student Dataset'}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600 dark:text-gray-300 mb-6 text-lg"
                  animate={{ opacity: isDragActive ? 0.8 : 1 }}
                >
                  Drag and drop your CSV file here, or click to browse
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Only CSV files are accepted
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                    <span>• Max file size: 10MB</span>
                    <span>• Required columns: comprehension, attention, focus, retention, engagement_time, assessment_score</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </motion.div>
                
                <div>
                  <motion.p 
                    className="font-semibold text-green-900 dark:text-green-100 text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {uploadedFile.name}
                  </motion.p>
                  <motion.p 
                    className="text-sm text-green-700 dark:text-green-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {(uploadedFile.size / 1024).toFixed(1)} KB • Ready for processing
                  </motion.p>
                </div>
              </div>
              
              {!isProcessing && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}