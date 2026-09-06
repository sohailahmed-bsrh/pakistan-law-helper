import React, { useState } from 'react';
import { Home, Gavel, Scale, Moon, RefreshCw } from 'lucide-react';
import QuestionPage from './question-page/QuestionPage';
import AnswerPage from './answer-page/AnswerPage';
import './styles.css';

import scaleOfJusticeImg from './assets/icons/scale of justice/scale of justice.jpeg';

function App() {
  const [currentPage, setCurrentPage] = useState('question');
  const [searchParams, setSearchParams] = useState(null);

  const navigateToAnswer = (question, province) => {
    setSearchParams({ question, province });
    setCurrentPage('answer');
    window.scrollTo(0, 0);
  };

  const navigateToQuestion = () => {
    setCurrentPage('question');
    setSearchParams(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      {/* Header aligned exactly with the reference design */}
      <header className="app-header-navy">
        <div className="header-brand-navy">
          <div className="brand-icon-navy">
            <img src={scaleOfJusticeImg} alt="Scale of Justice" className="header-logo-img-new" />
          </div>
          <div className="brand-text-navy">
            <h1><span className="text-white">Pakistan</span> <span className="text-blue">Law Helper</span></h1>
            <p>Find Legal Answers. Backed by Real Laws.</p>
          </div>
        </div>
        
        <div className="header-actions-navy">
          <button className="nav-btn" onClick={navigateToQuestion}>
            <Home size={18} /> Home
          </button>
          <button className="nav-btn active-nav-btn">
            <Gavel size={18} /> Ask Law
          </button>
        </div>
      </header>

      <main className="app-main">
        {currentPage === 'question' ? (
          <QuestionPage onSearch={navigateToAnswer} />
        ) : (
          <AnswerPage onNavigateBack={navigateToQuestion} searchParams={searchParams} />
        )}
      </main>

      {/* Footer aligned exactly with the reference design */}
      <footer className="app-footer-navy">
        <div className="footer-content-top">
          <div className="footer-left">
            <h2>"Knowledge of law empowers citizens."</h2>
            <p>Pakistan Law Helper</p>
          </div>
          <div className="footer-right">
            <button className="footer-btn-outline" onClick={navigateToQuestion}>
              <RefreshCw size={18} /> Ask Another Question
            </button>
          </div>
        </div>
        <div className="footer-content-bottom">
          <Moon size={24} color="#334155" style={{ transform: 'rotate(-45deg)' }} />
          <p>Real Laws. A More Informed Pakistan.</p>
          <Moon size={24} color="#334155" style={{ transform: 'rotate(-45deg)' }} />
        </div>
      </footer>
    </div>
  );
}

export default App;
