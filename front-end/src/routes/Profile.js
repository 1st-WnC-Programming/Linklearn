import React, { useState, useEffect } from 'react';
import unknown from '../Images/Unknown_person.jpeg';
import styled from 'styled-components';
import { authService, db } from '../fbase';
import { doc, getDoc, collection, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import InfoModal from '../Components/InfoModal';
import BlackListModal from '../Components/BlackListModal';
import {
  deleteUser,
  EmailAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from 'firebase/auth';

const ProfileWrap = styled.div`
  flex-direction: column;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: 100%; */
`;

const Avata = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 15px;
`;

const Name = styled.div`
  font-size: 45px;
  font-weight: 700;
  margin: 15px;
`;

const Email = styled.div`
  font-size: 20px;
  font-weight: 200;
  margin: 5px;
  margin-bottom: 40px;
`;

const TeacherInfo = styled.div`
  flex-direction: column;
  padding: 30px;
  display: flex;

  align-items: center;
`;

const TeacherInfoTitle = styled.div`
  font-size: 30px;
  font-weight: 300;
  margin: 15px;
`;

const Info = styled.div`
  font-size: 20px;
  font-weight: 200;
  margin: 10px;
`;

const Role = styled.div`
  font-size: 20px;
  font-weight: 200;
  margin: 5px;
`;

const Button = styled.button`
  padding: 12px 50px;
  color: black;
  justify-content: center;
  font-size: 18px;
  margin: 8px 0;
  width: 200px;
  border: 2px solid black;
  margin: 10px;
  border-radius: 5px;

  &:hover {
    background-color: ${({ color }) => color};
    color: white;
    transition: all ease-out 0.3s 0s;
  }
`;

const Infos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 80px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px;
`;

const ResignButton = styled.button`
  padding: 12px 50px;
  color: red;
  font-size: 18px;
  justify-content: center;
  border: 2px solid white;
  background-color: white;
  margin: 10px;
  width: 200px;

  &:hover {
    opacity: 60%;
    transition: all ease-out 0.2s 0s;
  }
`;

const Profile = ({ avataURL, userObj }) => {
  const user = authService.currentUser;
  const navigate = useNavigate();

  const [avata, setAvataURL] = useState(avataURL);
  const [name, setName] = useState('');
  const [starRate, setStarRate] = useState('5.0');
  const [field, setField] = useState('');
  const [career, setCareer] = useState('');
  const [role, setRole] = useState(null);
  const [infoToggle, setInfoToggle] = useState(false);
  const [blacklistToggle, setBlacklistToggle] = useState(false);

  const fetchUser = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };

  fetchUser()
    .then((user) => {
      setRole(user.role);
      setStarRate(user.rate);
      setField(user.major);
      setCareer(user.bio);

      setName(user.name);

      if (avata === null) {
        setAvataURL(unknown);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  //TODO: 회원 탈퇴 구현 중.....

  const onResignClick = () => {
    if (window.confirm('정말 회원 탈퇴하시겠습니까?') === true) {
      console.log(user.providerData[0].providerId);
      if (user.providerData[0].providerId === 'google.com') {
        reauthenticateWithPopup(user, new GoogleAuthProvider())
          .then((credential) => {
            console.log(credential);
            deleteUser(user)
              .then(async () => {
                await deleteDoc(doc(db, 'users', user.uid));
              })
              .catch((error) => {
                console.log(error);
              });
            navigate('/');
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (user.providerData[0].providerId === 'github.com') {
        reauthenticateWithPopup(user, new GithubAuthProvider())
          .then((credential) => {
            console.log(credential);
            deleteUser(user)
              .then(async () => {
                await deleteDoc(doc(db, 'users', user.uid));
              })
              .catch((error) => {
                console.log(error);
              });
            navigate('/');
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (user.providerData[0].providerId === 'password') {
        const password = window.prompt('비밀번호를 입력해주세요');
        const credential = EmailAuthProvider.credential(user.email, password);
        reauthenticateWithCredential(user, credential)
          .then((credential) => {
            console.log(credential);
            deleteUser(user)
              .then(async () => {
                await deleteDoc(doc(db, 'users', user.uid));
              })
              .catch((error) => {
                console.log(error);
              });
            navigate('/');
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  const onModalClick = (e) => {
    const {
      target: { name },
    } = e;

    if (name === 'info' || e.target.getAttribute('name') === 'info') {
      console.log(infoToggle);
      setInfoToggle((prev) => !prev);
    } else if (name === 'blacklist') {
      setBlacklistToggle((prev) => !prev);
    }
  };

  const closeBlackList = () => {
    setBlacklistToggle(false);
  };

  return (
    <main>
      <ProfileWrap>
        {role === null ? (
          //TODO: 추후 로딩 애니메이션 넣어야함
          'Loading'
        ) : role === 'tutor' ? (
          <>
            <Infos>
              <Avata src={avata} />
              <Name>{name}</Name>
              <Role>{role}</Role>
              <Email>{user.email}</Email>
              <TeacherInfo>
                <TeacherInfoTitle>튜터 정보</TeacherInfoTitle>
                <Info>분야 : {field}</Info>
                <Info>평점 : {starRate} </Info>
                <Info>경력 : {career}</Info>
              </TeacherInfo>
            </Infos>
            <Buttons>
              <Button color='black' name='info' onClick={onModalClick}>
                정보 수정
              </Button>
            </Buttons>

            <ResignButton onClick={onResignClick}>회원 탈퇴</ResignButton>
          </>
        ) : role === 'student' ? (
          <>
            <Infos>
              <Avata src={avata} />
              <Name>{name}</Name>
              <Role>{role}</Role>
              <Email>{user.email}</Email>
            </Infos>

            <Buttons>
              <Button color='black'>튜터 신청</Button>
              <Button color='black' name='info' onClick={onModalClick}>
                정보 수정
              </Button>
            </Buttons>

            <ResignButton onClick={onResignClick}>회원 탈퇴</ResignButton>
          </>
        ) : (
          <>
            <Infos>
              <Avata src={avata} />
              <Name>{name}</Name>
              <Role>{role}</Role>
              <Email>{user.email}</Email>
            </Infos>

            <Buttons>
              <Button color='black' name='info' onClick={onModalClick}>
                정보 수정
              </Button>
              <Button color='black' name='blacklist' onClick={onModalClick}>
                회원 관리
              </Button>
            </Buttons>

            <ResignButton onClick={onResignClick}>회원 탈퇴</ResignButton>
          </>
        )}
        <BlackListModal showModal={blacklistToggle} close={closeBlackList} />
        {infoToggle === true ? (
          <InfoModal
            userObj={userObj}
            name={name}
            avata={avata}
            field={field}
            career={career}
            role={role}
            onModalClick={onModalClick}
            setAvataURL={setAvataURL}
          />
        ) : (
          ''
        )}
      </ProfileWrap>
    </main>
  );
};
export default Profile;
