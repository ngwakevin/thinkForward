"use client";

import { useState, useEffect } from 'react';
import { validatePasswordStrength } from '../../lib/security';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export function PasswordStrengthMeter({ password, className = '' }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState({
    score: 0,
    label: '',
    color: '',
    width: '0%',
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        label: '',
        color: '',
        width: '0%',
      });
      return;
    }

    // Basic validation check
    const validation = validatePasswordStrength(password);
    
    // Calculate strength score (0-4)
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Lower score if not valid according to policy
    if (!validation.isValid) {
      score = Math.max(0, score - 1);
    }
    
    // Cap at 4
    score = Math.min(4, score);
    
    // Map score to visual feedback
    const strengthMap = [
      { label: 'Weak', color: 'bg-red-500', width: '25%' },
      { label: 'Fair', color: 'bg-orange-500', width: '50%' },
      { label: 'Good', color: 'bg-yellow-500', width: '75%' },
      { label: 'Strong', color: 'bg-green-500', width: '90%' },
      { label: 'Very Strong', color: 'bg-green-600', width: '100%' },
    ];
    
    setStrength({
      score,
      label: strengthMap[score].label,
      color: strengthMap[score].color,
      width: strengthMap[score].width,
    });
  }, [password]);

  if (!password) {
    return null;
  }

  return (
    <div className={`mt-2 ${className}`}>
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${strength.color} transition-all duration-300`}
          style={{ width: strength.width }}
        ></div>
      </div>
      <p className="text-sm mt-1 text-gray-500">
        Password strength: <span className="font-medium">{strength.label}</span>
      </p>
      {strength.score < 3 && (
        <p className="text-xs mt-1 text-red-500">
          For a stronger password, include uppercase letters, numbers, and special characters.
        </p>
      )}
    </div>
  );
}