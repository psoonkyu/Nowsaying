import { useState } from 'react';
import { User, Navigation } from 'lucide-react';
import './ProfileTab.css';

export default function ProfileTab({ 
  userName = '토스유저', 
  setUserName,
  gender = 'male',
  setGender,
  exploreDistance = '1Km',
  setExploreDistance
}: { 
  userName?: string; 
  setUserName?: (name: string) => void;
  gender?: 'male' | 'female';
  setGender?: (g: 'male' | 'female') => void;
  exploreDistance?: '500m' | '1Km' | '3Km';
  setExploreDistance?: (d: '500m' | '1Km' | '3Km') => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleSave = () => {
    if (tempName.trim()) {
      if (setUserName) setUserName(tempName.trim());
    } else {
      setTempName(userName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="page-container profile-container">
      <header className="home-header">
        <h2>내 정보</h2>
      </header>
      
      <div className="profile-content">
        <section className="profile-card">
          <div className="profile-header">
            <User size={24} color="var(--toss-blue)" />
            <h3>기본 정보</h3>
          </div>
          
          <div className="name-setting-row">
            {isEditing ? (
              <div className="name-input-container">
                <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="name-input"
                  autoFocus
                />
                <button className="toss-btn primary small" onClick={handleSave}>완료</button>
              </div>
            ) : (
              <div className="name-display-container">
                <span className="user-name">{userName}</span>
                <button className="toss-btn secondary small" onClick={() => {
                  setTempName(userName);
                  setIsEditing(true);
                }}>수정</button>
              </div>
            )}
          </div>
          
          <div className="gender-setting-row">
            <span className="setting-label">성별</span>
            <div className="segment-control gender-segment">
              <button 
                className={`segment-btn ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender && setGender('male')}
              >
                남자
              </button>
              <button 
                className={`segment-btn ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender && setGender('female')}
              >
                여자
              </button>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <div className="profile-header">
            <Navigation size={24} color="var(--toss-blue)" />
            <h3>탐색 거리</h3>
          </div>
          <p className="section-description">내 주변 게시글을 탐색할 반경 거리를 선택해 주세요.</p>
          
          <div className="segment-control">
            {(['500m', '1Km', '3Km'] as const).map((d) => (
              <button 
                key={d}
                className={`segment-btn ${exploreDistance === d ? 'active' : ''}`}
                onClick={() => setExploreDistance && setExploreDistance(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
