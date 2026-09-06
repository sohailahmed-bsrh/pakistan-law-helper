import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bot, CheckCircle2, Lightbulb, FileText, Link as LinkIcon, Info, Book, List, Link2, File, Building, CheckCircle, AlertTriangle, ClipboardList, Loader2 } from 'lucide-react';
import './answer-page.css';

// Import province icons
import federalIcon from '../assets/icons/federal icon/federal.jpeg';
import punjabIcon from '../assets/icons/punjab icon/punjab.jpeg';
import sindhIcon from '../assets/icons/sindh/sindh.jpeg';
import kpkIcon from '../assets/icons/kpk icon/kpk.jpeg';
import balochistanIcon from '../assets/icons/blochistan icon/balochistan.jpeg';
import islamabadIcon from '../assets/icons/islamabad territory icon/islamabad.jpeg';
import gilgitIcon from '../assets/icons/gilgit icon/gilgit.jpeg';
import ajkIcon from '../assets/icons/azad jamu and kashmir icon/azad jamu kashmir.jpeg';
import locationIcon from '../assets/icons/location icon/location.jpeg';

const getProvinceIcon = (provinceName) => {
  if (!provinceName) return locationIcon;
  const lower = provinceName.toLowerCase();
  if (lower.includes('punjab')) return punjabIcon;
  if (lower.includes('sindh')) return sindhIcon;
  if (lower.includes('khyber') || lower.includes('kpk')) return kpkIcon;
  if (lower.includes('balochistan')) return balochistanIcon;
  if (lower.includes('islamabad') || lower.includes('ict')) return islamabadIcon;
  if (lower.includes('gilgit') || lower.includes('gb')) return gilgitIcon;
  if (lower.includes('azad') || lower.includes('kashmir') || lower.includes('ajk')) return ajkIcon;
  return federalIcon;
};

function AnswerPage({ onNavigateBack, searchParams }) {
  const [data, setData] = useState({
    isLoading: true,
    isNotFound: false,
    error: null,
    question: searchParams?.question || "",
    province: searchParams?.province || "Federal",
    searchId: "PLH-0000-01",
    answer: "",
    keyPoints: [],
    lawName: "",
    year: "",
    sectionNumber: "",
    originalLegalText: "",
    verificationStatus: "Pending",
    sourceInformation: {
      officialSource: "",
      publisher: "",
      reference: ""
    }
  });

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const fetchLegalAnswer = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/legal/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: searchParams.question,
            province: searchParams.province,
          }),
        });

        if (!response.ok) {
          let errorDetail = 'Failed to fetch legal information';
          try {
            const errorResult = await response.json();
            errorDetail = errorResult.detail || errorDetail;
          } catch (e) {
            // Ignore JSON parse error on 500
          }
          throw new Error(errorDetail);
        }

        const result = await response.json();
        
        // Setup initial active section
        const sections = result.sectionNumber ? result.sectionNumber.toString().split(',').map(s => s.trim()) : [];
        if (sections.length > 0 && sections[0] !== "Unknown") {
          setActiveSection(sections[0]);
        }
        
        setData(prev => ({
          ...prev,
          isLoading: false,
          answer: result.answer,
          keyPoints: result.keyPoints || [],
          lawName: result.lawName,
          year: result.year,
          sectionNumber: result.sectionNumber,
          originalLegalText: result.originalLegalText,
          verificationStatus: result.verificationStatus,
          sourceInformation: result.sourceInformation || prev.sourceInformation
        }));

      } catch (error) {
        console.error("API Error:", error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    };

    if (searchParams?.question) {
      fetchLegalAnswer();
    }
  }, [searchParams]);

  if (data.isLoading) {
    return (
      <div className="answer-page loading-state-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={56} color="var(--secondary-blue)" className="spin-icon" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '24px' }} />
        <h2 style={{ color: 'var(--primary-navy)', fontSize: '1.75rem', marginBottom: '8px' }}>Analyzing Pakistan Law...</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Searching through the official legal documents</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="answer-page error-state-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <AlertTriangle size={56} color="var(--danger-red)" style={{ marginBottom: '24px' }} />
        <h2 style={{ color: 'var(--primary-navy)', fontSize: '1.75rem', marginBottom: '12px' }}>Something went wrong</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '400px' }}>{data.error}</p>
        <button onClick={onNavigateBack} className="btn-primary">Go Back</button>
      </div>
    );
  }

  const sectionsList = data.sectionNumber && data.sectionNumber !== "Unknown" ? data.sectionNumber.toString().split(',').map(s => s.trim()) : [];

  return (
    <div className="answer-page">
      
      {/* 1. Top Search Card with Background */}
      <div className="hero-background-section answer-hero-bg">
        <div className="search-hero-card card-base" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', zIndex: 1, position: 'relative' }}>
          <div className="search-hero-left">
            <div className="search-icon-box">
              <Search size={28} color="var(--secondary-blue)" />
            </div>
            <div className="search-question-content">
              <span className="search-label">Your Legal Question</span>
              <h2 className="search-question-text">{data.question}</h2>
            </div>
          </div>
          
          <div className="search-hero-divider"></div>
          
          <div className="search-hero-right">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span className="region-label">Selected Province / Region</span>
              <div className="region-selector">
                <div className="region-selector-left">
                  <img src={getProvinceIcon(data.province)} alt={data.province} className="province-emblem-img" />
                  <span>{data.province !== "Unknown" ? data.province : "Federal"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 2. Main Two-Column Layout */}
      <div className="two-column-layout">
        
        {/* Left Card: AI Legal Answer */}
        <div className="reference-card card-base">
          <div className="card-header-flex">
            <div className="card-title-left">
              <div className="icon-box-blue">
                <Bot size={24} />
              </div>
              <h2>AI Legal Answer</h2>
            </div>
            {data.verificationStatus === "Verified" && (
              <div className="badge-green-pill">
                <CheckCircle2 size={16} /> Based on Official Law
              </div>
            )}
          </div>
          
          <p className="answer-intro">Here is a clear summary based on the {data.lawName !== "Unknown" ? data.lawName : "retrieved document"}:</p>
          
          {data.keyPoints && Array.isArray(data.keyPoints) && data.keyPoints.length > 0 && data.keyPoints[0] !== "Unknown" && data.keyPoints[0] !== "" ? (
            <>
              <div className="key-points-heading">
                <CheckCircle2 size={22} /> Key Functions & Powers
              </div>
              
              <div className="timeline-list">
                {data.keyPoints.map((point, idx) => {
                  const colorClass = `color-${idx % 4}`;
                  let pointTitle = `Key Provision ${idx + 1}`;
                  let pointText = point;
                  if (point.includes(':')) {
                    const parts = point.split(':');
                    pointTitle = parts[0].trim();
                    pointText = parts.slice(1).join(':').trim();
                  }

                  return (
                    <div className="timeline-item" key={idx}>
                      <div className={`timeline-number ${colorClass}`}>{idx + 1}</div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>{pointTitle}</h4>
                          {sectionsList.length > 0 && (
                            <span className="timeline-badge">Section {sectionsList[0]}</span>
                          )}
                        </div>
                        <p className="timeline-text">{pointText}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            data.answer.includes("No relevant law found") || data.answer.includes("I don't know") ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)', margin: '20px 0' }}>
                <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.2rem', marginBottom: '8px' }}>No Results Found</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                  {data.answer}
                </p>
                <button onClick={onNavigateBack} className="btn-primary" style={{ margin: '24px auto 0' }}>
                  Try Another Question
                </button>
              </div>
            ) : (
              <div className="plain-answer-text">
                {data.answer !== "Unknown" && data.answer.split('\n').map((paragraph, index) => (
                  <p key={index} style={{ marginBottom: '12px', fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.6' }}>{paragraph}</p>
                ))}
              </div>
            )
          )}

          {data.answer && data.answer !== "Unknown" && data.keyPoints && data.keyPoints.length > 0 && (
            <div className="summary-box">
              <div className="summary-box-header">
                <Lightbulb size={20} />
                <h4>Summary</h4>
              </div>
              <p>{data.answer}</p>
            </div>
          )}
        </div>

        {/* Right Card: Original Legal Text */}
        <div className="reference-card card-base">
          <div className="card-header-flex">
            <div className="card-title-left">
              <div className="icon-box-navy">
                <FileText size={24} />
              </div>
              <h2>{data.verificationStatus === "Unverified" ? "Unrelated Retrieved Context" : "Original Legal Text"}</h2>
            </div>
          </div>
          
          <h3 className="law-title-h3">
            {data.lawName !== "Unknown" ? data.lawName : "Original Document"}
            {data.year && data.year !== "Unknown" ? `, ${data.year}` : ''}
          </h3>

          {sectionsList.length > 0 && (
            <div className="section-tabs">
              {sectionsList.map(sec => (
                <button 
                  key={sec} 
                  className={`section-tab-btn ${activeSection === sec ? 'active' : ''}`}
                  onClick={() => setActiveSection(sec)}
                >
                  {sec}
                </button>
              ))}
            </div>
          )}

          <div className="legal-text-container">
            <div className="legal-text-header">
              <div className="legal-text-header-left">
                <LinkIcon size={18} color="var(--secondary-blue)" />
                Section {activeSection || data.sectionNumber}
              </div>
              <span className="page-badge">Page ~ 1</span>
            </div>
            
            {data.originalLegalText && data.originalLegalText !== "Unknown" ? (
              <div className="legal-text-body">
                {data.originalLegalText.split('\n').map((para, idx) => (
                  <p key={idx} style={{ marginBottom: '16px' }}>{para}</p>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Original document text is not available.</p>
            )}
          </div>

          <div className="original-info-callout">
            <Info size={24} color="var(--secondary-blue)" style={{ flexShrink: 0 }} />
            {data.verificationStatus === "Unverified" ? (
              <p><strong>Note:</strong> No directly relevant legal text was found. The text shown above is what was searched, but it does not answer your question.</p>
            ) : (
              <p>This is the original text from the official law. In case of any doubt, please refer to the complete document.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Three Lower Information Cards */}
      <div className="three-column-layout">
        
        {/* Source Information */}
        <div className="info-card card-base">
          <div className="info-card-header">
            <FileText className="icon-source" size={24} />
            <h3>Source Information</h3>
          </div>
          <ul className="source-list">
            <li className="source-item">
              <Book size={16} />
              <div className="source-content">
                <span className="source-label">Law Name</span>
                <span className="source-value">
                  {data.lawName && data.lawName !== "Unknown" ? data.lawName : "Law name unavailable in the retrieved metadata."}
                </span>
              </div>
            </li>
            {sectionsList.length > 0 && (
              <li className="source-item">
                <List size={16} />
                <div className="source-content">
                  <span className="source-label">Sections</span>
                  <span className="source-value">{data.sectionNumber}</span>
                </div>
              </li>
            )}
            {data.province && data.province !== "Unknown" && (
              <li className="source-item">
                <MapPin size={16} />
                <div className="source-content">
                  <span className="source-label">Jurisdiction</span>
                  <span className="source-value">{data.province}</span>
                </div>
              </li>
            )}
            {data.sourceInformation?.officialSource && data.sourceInformation.officialSource !== "Unknown" && (
              <li className="source-item">
                <Link2 size={16} />
                <div className="source-content">
                  <span className="source-label">Official Source</span>
                  <span className="source-value">{data.sourceInformation.officialSource}</span>
                </div>
              </li>
            )}
            {data.sourceInformation?.reference && data.sourceInformation.reference !== "Unknown" && (
              <li className="source-item">
                <File size={16} />
                <div className="source-content">
                  <span className="source-label">File Name</span>
                  <span className="source-value" style={{ wordBreak: 'break-all' }}>{data.sourceInformation.reference}</span>
                </div>
              </li>
            )}
            {data.sourceInformation?.publisher && data.sourceInformation.publisher !== "Unknown" && (
              <li className="source-item">
                <Building size={16} />
                <div className="source-content">
                  <span className="source-label">Publisher</span>
                  <span className="source-value">{data.sourceInformation.publisher}</span>
                </div>
              </li>
            )}
          </ul>
        </div>

        {/* Answer Verification */}
        <div className="info-card card-base">
          <div className="info-card-header">
            <CheckCircle className="icon-verify" size={24} color={data.verificationStatus === "Unverified" ? "var(--danger-red)" : "var(--primary-navy)"} />
            <h3 style={{ color: data.verificationStatus === "Unverified" ? "var(--danger-red)" : "inherit" }}>Answer Verification</h3>
          </div>
          
          {data.verificationStatus === "Verified" ? (
            <>
              <ul className="verify-list">
                <li className="verify-item verified">
                  <CheckCircle size={18} /> Relevant section found in official documents
                </li>
                <li className="verify-item verified">
                  <CheckCircle size={18} /> Section number verified
                </li>
                <li className="verify-item verified">
                  <CheckCircle size={18} /> Law name verified
                </li>
                <li className="verify-item verified">
                  <CheckCircle size={18} /> Answer is based on retrieved legal text
                </li>
              </ul>
              <div className="verified-box">
                <CheckCircle size={32} color="var(--success-green)" />
                <div className="verified-box-content">
                  <h4>Verified</h4>
                  <p>This answer is backed by the official legal document.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <ul className="verify-list" style={{ color: 'var(--danger-red)' }}>
                <li className="verify-item pending" style={{ color: 'var(--danger-red)' }}>
                  <AlertTriangle size={18} /> No relevant section found in retrieved documents
                </li>
                <li className="verify-item pending" style={{ color: 'var(--danger-red)' }}>
                  <AlertTriangle size={18} /> Law name not found or unknown
                </li>
                <li className="verify-item pending" style={{ color: 'var(--danger-red)' }}>
                  <AlertTriangle size={18} /> Answer could not be generated from context
                </li>
              </ul>
              <div className="verified-box" style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}>
                <AlertTriangle size={32} color="var(--danger-red)" />
                <div className="verified-box-content">
                  <h4 style={{ color: 'var(--danger-red)' }}>Not Verified</h4>
                  <p style={{ color: 'var(--text-main)' }}>Insufficient evidence found. This query could not be verified against the official documents.</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Important Notes */}
        <div className="info-card card-base">
          <div className="info-card-header">
            <AlertTriangle className="icon-warning" size={24} />
            <h3>Important Notes</h3>
          </div>
          <ul className="notes-list">
            <li className="note-item">
              <div className="note-icon-bg">
                <ClipboardList size={18} />
              </div>
              <p>This is a general explanation based on the referenced law section.</p>
            </li>
            <li className="note-item">
              <div className="note-icon-bg">
                <ClipboardList size={18} />
              </div>
              <p>Your specific situation may have additional details.</p>
            </li>
            <li className="note-item">
              <div className="note-icon-bg">
                <ClipboardList size={18} />
              </div>
              <p>Please consult a qualified lawyer for legal advice.</p>
            </li>
            <li className="note-item">
              <div className="note-icon-bg">
                <ClipboardList size={18} />
              </div>
              <p>The app does not provide legal advice.</p>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}

export default AnswerPage;
