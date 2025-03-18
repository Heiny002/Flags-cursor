import React from 'react';
import FooterNav from '../components/FooterNav';

const Conversations: React.FC = () => {
  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="heading-1">Conversations</h1>
        <div className="card">
          <div className="text-center py-8">
            <p className="text-body mb-4">Start meaningful conversations with people who share your views!</p>
            <p className="text-caption">Coming soon...</p>
          </div>
        </div>
      </div>
      <FooterNav />
    </div>
  );
};

export default Conversations; 