import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { authService, db, rt_db } from '../fbase';
import { getDocs, query } from 'firebase/firestore';
import { ref, child, push, get, startAt, endAt } from 'firebase/database';
import ChattingModal from '../Components/ChattingModal';

const ChattingList = ({ userObj }) => {
  const [chatRoomId, setChatRoomId] = useState([]);
  const [userId, setUserId] = useState([]);
  const chatRoomRef = ref(rt_db, 'userRooms/' + userObj.uid);
  const [chatUser, setChatUser] = useState([]);
  const [chattingToggle, setChattingToggle] = useState(false);
  const [clickedUser, setClickedUser] = useState('');

  //형재 로그인한 유저가 속한 채팅방 가져오기
  useEffect(() => {
    get(child(chatRoomRef, '/')).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const id = [];
        Object.entries(data).map((room) => {
          const temp = {
            roomid: room[1].roomid,
          };
          id.push(temp);
        });
        setChatRoomId((chatRoomId) => [...chatRoomId, ...id]);
      }
    });

    //현재 로그인한 유저가 속한 채팅방의 id값으로 채팅목록 가져오기
    const dbRef = ref(rt_db);
    get(child(dbRef, 'roomUsers/')).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.entries(data).map((entry) => {
          if (userObj.uid === entry[1].uid1) {
            // if (!userId.includes(entry[1].uid1)) {
            setUserId((userId) => [...userId, entry[1].uid2]);
            // }
          } else if (userObj.uid === entry[1].uid2) {
            setUserId((userId) => [...userId, entry[1].uid1]);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    userId.forEach((element) => {
      const dbRef = ref(rt_db);
      get(child(dbRef, 'users/' + element)).then((snapshot) => {
        if (snapshot.exists()) {
          const temp = {
            id: snapshot.key,
            name: snapshot.val().username,
          };
          let cnt = 0;
          console.log(userId);
          setChatUser((chatUser) => [
            ...chatUser,
            <div>
              <div key={cnt++ + snapshot.val().username}>
                {snapshot.val().username + ' '}
                <button onClick={(e) => handleModalClick(e, temp)}>채팅하기</button>
              </div>
            </div>,
          ]);
        }
      });
    });
  }, [userId]);

  const handleModalClick = (e, value) => {
    e.preventDefault();
    !chattingToggle ? setClickedUser(value) : setClickedUser('');
    setChattingToggle((prev) => !prev);
  };

  return (
    <main>
      <div>{chatUser}</div>
      {chattingToggle === true ? (
        <ChattingModal handleModalClick={handleModalClick} opponentObj={clickedUser}></ChattingModal>
      ) : (
        ''
      )}
    </main>
  );
};

export default ChattingList;
