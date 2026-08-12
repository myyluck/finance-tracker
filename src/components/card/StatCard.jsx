import React from 'react';
import './StatCard.css';
import { formatRupiah } from '../../utils/formatters';

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{formatRupiah(value)}</span>
      </div>
      <div className={`stat-icon-wrapper icon-${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;