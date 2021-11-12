import React, { useState } from 'react';
import unknown from '../Images/Unknown_person.jpeg';
import styled from 'styled-components';
import { authService, db } from '../fbase';
import { doc, getDoc, collection } from 'firebase/firestore';

const ProfileWrap = styled.div`
  flex-direction: column;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Avata = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 15px;
`;

const Name = styled.div`
  font-size: 50px;
  font-weight: 700;
  margin: 15px;
`;

const Email = styled.div`
  font-size: 20px;
  font-weight: 200;
  margin: 5px;
`;

const TeacherInfo = styled.div`
  flex-direction: column;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TeacherInfoTitle = styled.div`
  font-size: 30px;
  font-weight: 600;
  margin: 15px;
`;

const Info = styled.div`
  font-size: 20px;
  font-weight: 400;
  margin: 10px;
`;

const Button = styled.button`
  background-color: ${({ color }) => color};
  font-size: 15px;
  padding: 12px 50px;
  color: white;
  justify-content: center;
  font-size: 18px;
  margin: 8px 0;
  width: 300px;
  border: none;
`;

const Profile = ({ avataURL }) => {
  const user = authService.currentUser;

  const uid = user.uid;
  const currentEmail = user.email;

  const fetchUser = async () => {
    const docRef = doc(db, 'users', uid);

    const docSnap = await getDoc(docRef);

    return docSnap.data();
  };

  // const [avataURL, setAvataURL] = useState(unknown);
  const [name, setName] = useState(user.displayName);
  const [starRate, setStarRate] = useState('5.0');
  const [email, setEmail] = useState(user.email);
  const [field, setField] = useState('수학');
  const [career, setCareer] = useState('-충남대 졸업 -과외 5년');

  // fetchUser().then((value) => {
  //   setName(value.name);
  //   setEmail(value.email);
  //   if (value.photoURL !== null) {
  //     setAvataURL(value.photoURL);
  //   }
  // });
  return (
    <main>
      <ProfileWrap>
        <Avata src={avataURL} />
        <Name>{name}</Name>
        <Email>{email}</Email>

        <TeacherInfo>
          <TeacherInfoTitle>튜터 정보</TeacherInfoTitle>
          <Info>{field}</Info>
          <Info> ★★★★★ {starRate} </Info>
          <Info>{career}</Info>
        </TeacherInfo>

        <Button color='#3c78c8'>정보 수정</Button>
        <Button color='#dc3545'>회원 탈퇴</Button>
      </ProfileWrap>
    </main>
  );
};
export default Profile;
