import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  icon, 
  disabled = false,
  className = ''
}) => {
  return (
    <motion.button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;