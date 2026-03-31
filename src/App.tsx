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
}

export const INITIAL_POSTS: Post[] = [
  { id: 1, author: '익명1', content: '오늘 날씨 진짜 좋네요! 공원에 사람 많아요.', distance: '12m', time: '방금 전', latOffset: 0.0001, lngOffset: 0.0001 },
  { id: 2, author: '익명2', content: '근처에 맛있는 커피집 추천해주세요 ㅎㅎ', distance: '800m', time: '5분 전', latOffset: -0.004, lngOffset: 0.005 },
  { id: 3, author: '익명3', content: '토스인앱용 디자인 퀄리티 무슨일...!', distance: '2.5Km', time: '15분 전', latOffset: 0.015, lngOffset: -0.012 },
];

function App() {
  const [userName, setUserName] = useState('토스유저');
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
