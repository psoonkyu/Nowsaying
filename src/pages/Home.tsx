import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, PenLine } from 'lucide-react';
import Card from '../components/Card';
import type { Post } from '../App';
import './Home.css';

export default function Home({ 
  userName = '나', 
  posts, 
  setPosts,
  exploreDistance = '1Km',
  gender = 'male'
}: { 
  userName?: string;
  posts: Post[];
  setPosts: (p: Post[]) => void;
  exploreDistance?: '500m' | '1Km' | '3Km';
  gender?: 'male' | 'female';
}) {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState('위치 찾는 중...');
  const [isComposing, setIsComposing] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  const handleSubmit = () => {
    if (!newPostContent.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author: userName,
      content: newPostContent.trim(),
      distance: '현재 위치',
      time: '방금 전',
      latOffset: 0,
      lngOffset: 0,
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setIsComposing(false);
  };

  const radiusMeters = exploreDistance === '500m' ? 500 : exploreDistance === '1Km' ? 1000 : 3000;
  
  const visiblePosts = posts.filter(p => {
    if (p.author === userName || (!p.latOffset && !p.lngOffset)) return true;
    const distMeters = Math.sqrt((p.latOffset||0)**2 + (p.lngOffset||0)**2) * 111000;
    return distMeters <= radiusMeters;
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=ko`);
            if (!res.ok) throw new Error('Geocoding failed');
            const data = await res.json();
            
            if (data && data.address) {
              const { province, city, town, borough, suburb, quarter, road } = data.address;
              const sido = province || city || '';
              const sigungu = borough || town || '';
              const dong = suburb || quarter || '';
              const street = road || '';
              
              // Build Korean style address naturally: province/city + borough/town + suburb/quarter + road
              const ds = [sido, sigungu, dong, street].filter(Boolean);
              setLocationName(ds.join(' ') || `위도: ${latitude.toFixed(3)}, 경도: ${longitude.toFixed(3)}`);
            } else {
              setLocationName('알 수 없는 위치');
            }
          } catch (err) {
            console.error(err);
            setLocationName('실제 주소를 가져오지 못했습니다');
          }
        },
        (err) => {
          console.error(err);
          setLocationName('위치 정보 접근이 거부/실패되었습니다');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationName('위치 서비스 미지원 브라우저입니다');
    }
  }, []);

  return (
    <div className="page-container home-container">
      <header className="home-header">
        <div className="location-info">
          <MapPin size={24} color="var(--toss-blue)" />
          <h2>{locationName}</h2>
        </div>
      </header>

      <section className="feed-section">
        {visiblePosts.map(post => (
          <Card 
            key={post.id} 
            className="post-card"
            onDoubleClick={() => navigate('/map', { state: { focusLatOffset: post.latOffset || 0, focusLngOffset: post.lngOffset || 0 } })}
          >
            <div className="post-header">
              <span className="post-author">{post.author}</span>
              <span className="post-meta">{post.distance} · {post.time}</span>
            </div>
            <p className="post-content">
              {post.author === userName && (
                <span style={{ 
                  color: gender === 'female' ? '#f7729b' : 'var(--toss-blue)', 
                  fontWeight: 700,
                  marginRight: '6px'
                }}>
                  내글 :
                </span>
              )}
              {post.content}
            </p>
          </Card>
        ))}
      </section>

      <div className="fab-container">
        <button className="fab active-bounce" onClick={() => setIsComposing(true)}>
          <PenLine size={24} color="var(--toss-white)" />
        </button>
      </div>

      {isComposing && (
        <div className="compose-overlay" onClick={() => setIsComposing(false)}>
          <div className="compose-modal" onClick={e => e.stopPropagation()}>
            <div className="compose-header">
              <h3>글쓰기</h3>
              <button className="close-btn" onClick={() => setIsComposing(false)}>닫기</button>
            </div>
            <textarea 
              className="compose-textarea" 
              placeholder="내 주변 이웃과 나눌 이야기를 적어보세요."
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              autoFocus
            />
            <button 
              className="submit-btn" 
              disabled={!newPostContent.trim()} 
              onClick={handleSubmit}
            >
              등록하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
