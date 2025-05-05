import React, { useState } from 'react';

const sampleReports = {
  allTime: {
    totalMessagesSent: 1200,
    totalFriends: 50,
    mostMessagedUser: 'User A',
    mostMessagedBy: 'User B',
    friendsAdded: 30,
  },
  oneWeek: {
    totalMessagesSent: 42,
    totalFriends: 10,
    mostMessagedUser: 'User B',
    mostMessagedBy: 'User C',
    friendsAdded: 5,
  },
  oneMonth: {
    totalMessagesSent: 150,
    totalFriends: 15,
    mostMessagedUser: 'User D',
    mostMessagedBy: 'User E',
    friendsAdded: 10,
  },
  threeMonths: {
    totalMessagesSent: 400,
    totalFriends: 25,
    mostMessagedUser: 'User F',
    mostMessagedBy: 'User G',
    friendsAdded: 15,
  },
};

const Report = (): JSX.Element => {
  const [filter, setFilter] = useState<'allTime' | 'oneWeek' | 'oneMonth' | 'threeMonths'>('oneWeek'); // Default filter

  const reportData = sampleReports[filter]; // Get the report data based on the selected filter

  return (
    <div className="p-6 h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">Report</h2>

      {/* Filter Buttons */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setFilter('allTime')}
          className={`px-4 py-2 mx-2 rounded-lg ${
            filter === 'allTime' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setFilter('oneWeek')}
          className={`px-4 py-2 mx-2 rounded-lg ${
            filter === 'oneWeek' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          1 Week
        </button>
        <button
          onClick={() => setFilter('oneMonth')}
          className={`px-4 py-2 mx-2 rounded-lg ${
            filter === 'oneMonth' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          1 Month
        </button>
        <button
          onClick={() => setFilter('threeMonths')}
          className={`px-4 py-2 mx-2 rounded-lg ${
            filter === 'threeMonths' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          3 Months
        </button>
      </div>

      {/* Report Data */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <p className="text-lg mb-4">
          <span className="font-bold">Total messages sent:</span> {reportData.totalMessagesSent}
        </p>
        <p className="text-lg mb-4">
          <span className="font-bold">Total friends:</span> {reportData.totalFriends}
        </p>
        <p className="text-lg mb-4">
          <span className="font-bold">You sent the most messages to:</span> {reportData.mostMessagedUser}
        </p>
        <p className="text-lg mb-4">
          <span className="font-bold">User who sent the most messages to you:</span> {reportData.mostMessagedBy}
        </p>
        <p className="text-lg">
          <span className="font-bold">Number of friends added:</span> {reportData.friendsAdded}
        </p>
      </div>
    </div>
  );
};

export default Report;