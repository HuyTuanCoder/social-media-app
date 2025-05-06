import React, { useState, useEffect } from 'react';
import reportService from '../services/reportService';

interface ReportData {
  totalUsers: number;
  totalFriends: number;
  totalMessagesSent: number;
  mostMessagedUser: string;
  mostMessagedBy: string;
}

const Report = ({ userId }: { userId: string }): JSX.Element => {
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await reportService.loadReport(userId);
        setReportData(data);
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };

    fetchReport();
  }, [userId]);

  if (!reportData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">All-Time Report</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <p className="text-lg mb-4">
          <span className="font-bold">Total users:</span> {reportData.totalUsers}
        </p>
        <p className="text-lg mb-4">
          <span className="font-bold">Total friends:</span> {reportData.totalFriends}
        </p>
        <p className="text-lg mb-4">
          <span className="font-bold">Total messages sent:</span> {reportData.totalMessagesSent}
        </p>
        <p className="text-lg mb-4">
          <span className="font-bold">You sent the most messages to:</span> {reportData.mostMessagedUser}
        </p>
        <p className="text-lg">
          <span className="font-bold">User who sent the most messages to you:</span> {reportData.mostMessagedBy}
        </p>
      </div>
    </div>
  );
};

export default Report;