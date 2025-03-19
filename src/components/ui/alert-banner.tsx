
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface AlertBannerProps {
  message: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ message }) => {
  return (
    <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="text-amber-800 dark:text-amber-300">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default AlertBanner;
