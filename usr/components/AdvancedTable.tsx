import React from 'react';
import { DataTb } from '@core/components/DataTb';
import type { ColumnConfig } from '@core/components/DataTb/types';

export default function AdvancedTable() {
  const data = [
    { id: 1, task: 'Fix MDX Props', priority: 'high', status: 'completed' },
    { id: 2, task: 'Add Custom Render', priority: 'medium', status: 'in_progress' },
    { id: 3, task: 'Write Documentation', priority: 'low', status: 'pending' },
  ];

  const columns: ColumnConfig[] = [
    { key: 'id', header: 'ID', width: '50px' },
    { key: 'task', header: 'Task Name' },
    { 
      key: 'priority', 
      header: 'Priority',
      render: (val) => {
        const colors = {
          high: 'bg-red-100 text-red-800',
          medium: 'bg-yellow-100 text-yellow-800',
          low: 'bg-green-100 text-green-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[val as keyof typeof colors] || ''}`}>
            {String(val).toUpperCase()}
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Actions',
      render: (_, row) => (
        <button 
          onClick={() => alert(`Clicked task: ${row.task}`)}
          className="scms-btn scms-btn-primary scms-btn-sm transition-colors"
        >
          View Details
        </button>
      )
    }
  ];

  return (
    <DataTb
      source={{ type: 'json', data }}
      columns={columns}
      searchable
      client:load
    />
  );
}