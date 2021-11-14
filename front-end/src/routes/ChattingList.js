import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { authService, db, rt_db } from '../fbase';
import { getDocs, query } from 'firebase/firestore';
import { ref, child, push, get, startAt, endAt } from 'firebase/database';

const ChattingList = ({ userObj }) => {
  const [chatRoomId, setChatRoomId] = useState([]);
  const [userId, setUserId] = useState([]);
  const chatRoomRef = ref(rt_db, 'userRooms/' + userObj.uid);
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
  }, []);

  //현재 로그인한 유저가 속한 채팅방의 id값으로 채팅목록 가져오기
  useEffect(async () => {
    // get(child());
    console.log(userObj.uid);
    const chatUserRef1 = query(ref(rt_db, 'roomUsers/'), startAt(userObj.uid));
    const chatUserRef2 = query(ref(rt_db, 'roomUsers/'), endAt(userObj.uid));
    console.log(chatUserRef1);
    console.log(chatUserRef2);
    // const querySnapshot1 = await getDocs(chatUserRef1);
    // console.log(querySnapshot1);
    // const querySnapshot2 = await getDocs(chatUserRef2);
    // console.log(querySnapshot2);
    // querySnapshot2.forEach((doc) => {
    //   console.log(doc);
    // });
    // get(child(chatUserRef + '/')).then((snapshot, ll) => {
    //   if (snapshot.exists()) {
    //     console.log(ll);
    //     console.log(snapshot.val());
    //   }
    // });
  }, [chatRoomId]);

  return (
    <main>
      <div>{console.log(chatRoomId)}</div>
    </main>
  );
};

export default ChattingList;
