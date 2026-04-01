import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import MapTab from './pages/MapTab';
import ProfileTab from './pages/ProfileTab';
import './index.css';

export interface Post {
  id: number;
  author: string;
  content: string;
  distance: string;
  time: string;
  latOffset?: number;
  lngOffset?: number;
  gender?: 'male' | 'female';
}

const generateRandomName = () => {
  const animals = ['강아지', '고양이', '토끼', '다람쥐', '판다', '여우', '펭귄', '곰', '호랑이', '사자', '거북이', '알파카', '원숭이', '수달', '코알라'];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(1000 + Math.random() * 9000); // 1000 to 9999
  return `${animal}${number}`;
};

const generateRandomPostMeta = () => {
  const rMeters = Math.floor(Math.random() * 800) + 50; // 50m to 850m
  const distanceStr = rMeters < 1000 ? `${rMeters}m` : `${(rMeters/1000).toFixed(1)}Km`;
  const angle = Math.random() * 2 * Math.PI;
  const latOffset = (rMeters * Math.cos(angle)) / 111000;
  const lngOffset = (rMeters * Math.sin(angle)) / 88800;
  const gender: 'male' | 'female' = Math.random() > 0.5 ? 'male' : 'female';
  const timeMins = Math.floor(Math.random() * 59) + 1;
  const time = `${timeMins}분 전`;
  
  return { distance: distanceStr, latOffset, lngOffset, gender, time };
};

export const INITIAL_POSTS: Post[] = [
  { id: 1, author: generateRandomName(), content: '오늘 날씨 진짜 좋네요! 공원에 사람 많아요.', ...generateRandomPostMeta() },
  { id: 2, author: generateRandomName(), content: '근처에 맛있는 커피집 추천해주세요 ㅎㅎ', ...generateRandomPostMeta() },
  { id: 3, author: generateRandomName(), content: '토스인앱용 디자인 퀄리티 무슨일...!', ...generateRandomPostMeta() },
];

function App() {
  const [userName, setUserName] = useState(generateRandomName);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [exploreDistance, setExploreDistance] = useState<'500m' | '1Km' | '3Km'>('1Km');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home userName={userName} posts={posts} setPosts={setPosts} exploreDistance={exploreDistance} gender={gender} />} />
          <Route path="/map" element={<MapTab userName={userName} posts={posts} gender={gender} exploreDistance={exploreDistance} />} />
          <Route path="/profile" element={<ProfileTab userName={userName} setUserName={setUserName} gender={gender} setGender={setGender} exploreDistance={exploreDistance} setExploreDistance={setExploreDistance} />} />
          <Route path="*" element={<Home userName={userName} posts={posts} setPosts={setPosts} exploreDistance={exploreDistance} gender={gender} />} />
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;
