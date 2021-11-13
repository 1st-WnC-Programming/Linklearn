import React, { useState, useEffect } from 'react';
import unknown from '../Images/Unknown_person.jpeg';
import styled from 'styled-components';
import { authService, db } from '../fbase';
import { doc, getDoc, collection, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import InfoModal from '../Components/InfoModal';
import BlackListModal from '../Components/BlackListModal';

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
  font-size: 15px;
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
                <Info>분야 : {field}</Info>
                <Info>평점 : {starRate} </Info>
                <Info>경력 : {career}</Info>
              </TeacherInfo>
            </Infos>
            <Buttons>
              <Button color='black' name='info' onClick={onModalClick}>
                정보 수정
              </Button>
              <Button color='black'>회원 탈퇴</Button>
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
              <Button color='black'>튜터 신청</Button>
              <Button color='black' name='info' onClick={onModalClick}>
                정보 수정
              </Button>
              <Button color='black'>회원 탈퇴</Button>
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
              <Button color='black' name='info' onClick={onModalClick}>
                정보 수정
              </Button>
              <Button color='black' name='blacklist' onClick={onModalClick}>
                회원 관리
              </Button>
              <Button color='black'>회원 탈퇴</Button>
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
