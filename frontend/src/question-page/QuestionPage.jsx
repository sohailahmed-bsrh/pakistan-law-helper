import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import './question-page.css';

// Import actual province icons
import federalIcon from '../assets/icons/federal icon/federal.jpeg';
import punjabIcon from '../assets/icons/punjab icon/punjab.jpeg';
import sindhIcon from '../assets/icons/sindh/sindh.jpeg';
import kpkIcon from '../assets/icons/kpk icon/kpk.jpeg';
import balochistanIcon from '../assets/icons/blochistan icon/balochistan.jpeg';
import islamabadIcon from '../assets/icons/islamabad territory icon/islamabad.jpeg';
import gilgitIcon from '../assets/icons/gilgit icon/gilgit.jpeg';
import ajkIcon from '../assets/icons/azad jamu and kashmir icon/azad jamu kashmir.jpeg';

// Import location icon
import locationIcon from '../assets/icons/location icon/location.jpeg';

const provincesData = [
  { id: 'federal', name: 'Federal', icon: federalIcon },
  { id: 'punjab', name: 'Punjab', icon: punjabIcon },
  { id: 'sindh', name: 'Sindh', icon: sindhIcon },
  { id: 'kp', name: 'Khyber Pakhtunkhwa', icon: kpkIcon },
  { id: 'balochistan', name: 'Balochistan', icon: balochistanIcon },
  { id: 'ict', name: 'Islamabad Capital Territory', icon: islamabadIcon },
  { id: 'gb', name: 'Gilgit-Baltistan', icon: gilgitIcon },
  { id: 'ajk', name: 'Azad Jammu and Kashmir', icon: ajkIcon }
];

function QuestionPage({ onSearch }) {
  const [province, setProvince] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!province) {
      setError('Please select a province.');
      return;
    }

    if (!question.trim()) {
      setError('Please enter your legal question.');
      return;
    }

    setIsSearching(true);

    // Call onSearch immediately, the answer page will handle the loading
    if (onSearch) {
      onSearch(question, province.name);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setError('');
  };

  const selectProvince = (p) => {
    setProvince(p);
    setIsDropdownOpen(false);
    setError('');
  };

  return (
    <div className="question-page">
      <div className="hero-background-section">
        <section className="hero-section">
          <span className="hero-label">Your Guide to Pakistani Law</span>
          <h2 className="hero-title">Ask a Legal Question</h2>
          <p className="hero-subtitle">
            Get accurate answers from authentic Pakistani law documents.<br/><br/>
            Select your province, enter your question, and let AI find the relevant legal information.
          </p>
        </section>

        <form className="question-card card-base" onSubmit={handleSearch}>
          <div className="form-group" ref={dropdownRef}>
            <label className="form-label">Select Province</label>
            <div className={`custom-dropdown-header ${isDropdownOpen ? 'open' : ''} ${error && !province ? 'error-border' : ''}`} onClick={toggleDropdown}>
              {province ? (
                <div className="selected-province">
                  <img src={province.icon} alt={province.name} className="province-emblem-img" />
                  <span>{province.name}</span>
                </div>
              ) : (
                <div className="selected-province placeholder-style">
                  <img src={locationIcon} alt="Location" className="province-emblem-img" style={{ opacity: 0.6 }} />
                  <span className="dropdown-placeholder">Select a Province</span>
                </div>
              )}
              <ChevronDown className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`} size={20} />
            </div>
            
            {isDropdownOpen && (
              <div className="custom-dropdown-list">
                {provincesData.map((p) => (
                  <div 
                    key={p.id} 
                    className={`dropdown-item ${province?.id === p.id ? 'selected' : ''}`}
                    onClick={() => selectProvince(p)}
                  >
                    <img src={p.icon} alt={p.name} className="province-emblem-img" />
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="question">Your Legal Question</label>
            <textarea 
              id="question" 
              className={`form-textarea ${error && question.length === 0 ? 'error-border' : ''}`}
              placeholder="Type your legal question here..."
              maxLength={500}
              value={question}
              onChange={(e) => { setQuestion(e.target.value); setError(''); }}
            ></textarea>
            <div className={`char-counter ${question.length >= 500 ? 'error' : ''}`}>
              {question.length}/500
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div style={{ marginTop: '40px' }}>
            <button type="submit" className="submit-btn btn-primary" disabled={isSearching}>
              {isSearching ? (
                <>
                  <div className="loading-spinner"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Search Relevant Laws →
                </>
              )}
            </button>
            <p className="form-helper-text">
              We search through authentic Pakistani law documents to provide accurate answers.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionPage;
