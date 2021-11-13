import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import styled from 'styled-components';
import { authService, db } from '../fbase';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
`;

const ModalContainer = styled.div`
  flex-direction: column;
  width: 500px;
  height: 800px;
  background-color: white;
  padding: 40px;
  display: flex;
  align-items: center;

  z-index: 1002;
  border-radius: 30px;
  position: fixed;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  box-shadow: 1px 1px 15px -2px grey;
`;

const Avata = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 15px;
`;

const Name = styled.input`
  font-size: 15px;
  padding: 10px;
  margin: 15px;
  width: 100%;
`;

const Info = styled.input`
  font-size: 15px;
  padding: 10px;
  margin: 15px;
  width: 100%;
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

const InfoModal = ({
  avata,
  name,
  field,
  career,
  onModalClick,
  setAvataURL,
  setName,
  setField,
  setCareer,
}) => {
  const user = authService.currentUser;

  const fetchUser = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };

  const onCancelClick = (e) => {
    fetchUser()
      .then((user) => {
        setName(user.name);
        setField(user.major);
        setCareer(user.bio);
        onModalClick(e);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onTextChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'name') setName(value);
    else if (name === 'field') setField(value);
    else if (name === 'career') setCareer(value);
  };

  const onButtonClick = async (e) => {
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: name,
          photoURL: avata,
          major: field,
          bio: career,
        },
        { merge: true },
      );

      onModalClick(e);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Background onClick={onCancelClick} name='info' />
      <ModalContainer>
        <Avata src={avata} />
        이름
        <Name name='name' value={name} onChange={onTextChange} />
        분야
        <Info name='field' value={field} onChange={onTextChange} />
        경력(200자 이하)
        <Info name='career' value={career} style={{ height: 200 }} onChange={onTextChange} />
        <Button color='#dc3545' name='info' onClick={onCancelClick}>
          취소
        </Button>
        <Button color='#3c78c8' name='info' onClick={onButtonClick}>
          확인
        </Button>
      </ModalContainer>
    </>
  );
};

export default InfoModal;
