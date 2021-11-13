import React, { useState, useEffect } from 'react';
import unknown from '../Images/Unknown_person.jpeg';
import styled from 'styled-components';
import { authService, db } from '../fbase';
import { doc, getDoc, collection, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {
  deleteUser,
  EmailAuthCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import InfoModal from '../Components/InfoModal';
import BlackListModal from '../Components/BlackListModal';

const ProfileWrap = styled.div`
  flex-direction: column;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 800px;
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

const Role = styled.div`
  font-size: 20px;
  font-weight: 200;
  margin: 5px;
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

const Infos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Profile = ({ avataURL, userObj }) => {
  const user = authService.currentUser;
  const navigate = useNavigate();

  const [avata, setAvataURL] = useState(avataURL);
  const [name, setName] = useState(user.displayName);
  const [starRate, setStarRate] = useState('5.0');
  const [email, setEmail] = useState(user.email);
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

  useEffect(() => {
    fetchUser()
      .then((user) => {
        setRole(user.role);
        setStarRate(user.rate);
        setField(user.major);
        setCareer(user.bio);

        if (avata === null) {
          setAvataURL(unknown);
        }

        if (name === null) {
          setName(user.name);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      // cleanup;
    };
  }, []);

  //TODO: 회원 탈퇴 구현 중.....

  // const onResignClick = () => {
  //   if (window.confirm('정말 회원 탈퇴하시겠습니까?') === true) {
  //     const userPassword = window.prompt('비밀번호를 입력해주세요');
  //     console.log(userPassword);
  //     const credential = EmailAuthProvider.credential(user.email, userPassword);

  //     reauthenticateWithCredential(user, credential)
  //       .then(() => {
  //         console.log('ASDF');
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });

  //     deleteUser(user)
  //       .then(async () => {
  //         await deleteDoc(doc(db, 'users', user.uid));
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //     navigate('/');
  //   }
  // };

  //TODO: 정보수정 모달창 제작중
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
              <Email>{email}</Email>
              <TeacherInfo>
                <TeacherInfoTitle>튜터 정보</TeacherInfoTitle>
                <Info>{field}</Info>
                <Info> ★★★★★ {starRate} </Info>
                <Info>{career}</Info>
              </TeacherInfo>
            </Infos>
            <Buttons>
              <Button color='#3c78c8' name='info' onClick={onModalClick}>
                정보 수정
              </Button>
              <Button color='#dc3545'>회원 탈퇴</Button>
            </Buttons>
          </>
        ) : role === 'student' ? (
          <>
            <Infos>
              <Avata src={avata} />
              <Name>{name}</Name>
              <Role>{role}</Role>
              <Email>{email}</Email>
            </Infos>

            <Buttons>
              <Button color='#3c78c8'>튜터 신청</Button>
              <Button color='#3c78c8' name='info' onClick={onModalClick}>
                정보 수정
              </Button>
              <Button color='#dc3545'>회원 탈퇴</Button>
            </Buttons>
          </>
        ) : (
          <>
            <Infos>
              <Avata src={avata} />
              <Name>{name}</Name>
              <Role>{role}</Role>
              <Email>{email}</Email>
            </Infos>

            <Buttons>
              <Button color='#3c78c8' name='info' onClick={onModalClick}>
                정보 수정
              </Button>
              <Button color='#3c78c8' name='blacklist' onClick={onModalClick}>
                블랙리스트 관리
              </Button>
              <Button color='#dc3545'>회원 탈퇴</Button>
            </Buttons>
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
            setName={setName}
            setField={setField}
            setCareer={setCareer}
          />
        ) : (
          ''
        )}
      </ProfileWrap>
    </main>
  );
};
export default Profile;
