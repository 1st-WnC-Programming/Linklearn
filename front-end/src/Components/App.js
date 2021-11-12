import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import GlobalStyles from './GlobalStyles';
import Footer from './Footer';
import unknown from '../Images/Unknown_person.jpeg';
import { authService } from '../fbase';

const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avataURL, setAvataURL] = useState(unknown);

  const [info, setInfo] = useState([
    {
      number: '공지',
      title: '가',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '한석원',
      date: '2021-07-23',
      content: '',
      id: '7',
    },
    {
      number: '공지',
      title: '나',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '한석원',
      date: '2021-07-23',
      content: '',
      id: '8',
    },
  ]);
  const [dataFile, setDataFile] = useState([
    {
      number: '1',
      title: '가',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '한석원',
      date: '2021-07-23',
      content: '',
      id: '1',
    },
    {
      number: '2',
      title: '나',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '한석원',
      date: '2021-07-23',
      content: '',
      id: '2',
    },
    {
      number: '3',
      title: '다',
      type: '개인',
      numberOfPeople: '3',
      time: '2',
      teacher: '한석원',
      date: '2021-07-23',
      content: '',
      id: '3',
    },
    {
      number: '4',
      title: '제목입니다',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '배성현',
      date: '2021-07-23',
      id: '4',
    },
    {
      number: '5',
      title: '제목입니다',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '전병민',
      date: '2021-07-23',
      content: '',
      id: '5',
    },
    {
      number: '6',
      title: '제목입니다',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '한석원',
      date: '2021-07-23',
      content: '',
      id: '6',
    },
  ]);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        if (user.photoURL !== null) {
          setAvataURL(user.photoURL);
        }
      } else {
        setAvataURL(false);
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <>
          <GlobalStyles />
          <AppRouter
            isLoggedIn={isLoggedIn}
            avataURL={avataURL}
            info={info}
            setInfo={setInfo}
            dataFile={dataFile}
            setDataFile={setDataFile}
          />
          <Footer />
        </>
      ) : (
        //TODO: 추후 로딩 애니메이션 넣어야함
        'Loading...'
      )}
    </>
  );
};

export default App;
