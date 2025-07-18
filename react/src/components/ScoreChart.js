import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ScoreChart = ({ analytics }) => {
  const scoreDistribution = Array(10).fill(0);

  analytics.forEach((rating) => {
    const scoreIndex = rating.score - 1;
    scoreDistribution[scoreIndex]++;
  });

  const data = scoreDistribution.map((count, index) => ({
    score: index + 1,
    count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300} style={{ marginTop: '20px' }}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="score" label={{ value: 'Score', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Bar dataKey="count" fill="#1976d2" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ScoreChart;
