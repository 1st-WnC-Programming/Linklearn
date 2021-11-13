import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { authService, db, storageService } from '../fbase';
import { Close } from '@styled-icons/evaicons-solid';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
`;
const CloseIcon = styled(Close)`
  position: absolute;
  right: 40px;
  top: 40px;
  width: 2rem;
  cursor: pointer;
`;

const ModalContainer = styled.div`
  flex-direction: column;
  width: 500px;
  background-color: white;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1002;
  border-radius: 20px;
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
  margin-top: 90px;
  &:hover {
    opacity: 0.6;
  }
`;

const Name = styled.input`
  font-size: 20px;
  padding: 10px;
  margin: 15px;
  width: 75%;
  background-color: #e2e2e2;
  border-radius: 5px;
  border: none;
`;

const Info = styled.input`
  font-size: 20px;
  padding: 10px;
  margin: 15px;
  width: 75%;
  background-color: #e2e2e2;
  border-radius: 5px;
  border: none;
`;

const Bio = styled.textarea`
  font-size: 20px;
  padding: 10px;
  margin: 15px;
  width: 64%;
  background-color: #e2e2e2;
  border-radius: 5px;
  border: none;
`;

const Button = styled.button`
  font-size: 15px;
  padding: 12px 50px;
  color: black;
  justify-content: center;
  font-size: 18px;
  margin: 8px 0;
  width: 40%;
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
  margin-bottom: 40px;
`;

const TextSpace = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.div`
  font-size: 20px;
`;

const PhotoSelect = styled.input`
  display: none;
`;

const Title = styled.div`
  font-size: 30px;
  position: absolute;
  left: 40px;
  top: 40px;
  font-weight: 700;
`;

const InfoModal = ({
  userObj,
  avata,
  name,
  field,
  career,
  role,
  onModalClick,
  setName,
  setField,
  setCareer,
}) => {
  const user = authService.currentUser;
  const [selectedImg, setSelectedImg] = useState(avata);
  const uploadPhotoRef = useRef();

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
      console.log(userObj.uid);
      console.log(selectedImg);

      if (selectedImg !== avata) {
        const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
        const res = await uploadString(fileRef, selectedImg, 'data_url');
        const fileURL = await getDownloadURL(res.ref);

        updateProfile(user, { photoURL: fileURL })
          .then(() => {
            console.log('proflie update');
          })
          .catch((error) => {
            console.log();
          });
      }

      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: name,
          photoURL: selectedImg,
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

  const onPhotoClick = () => {
    uploadPhotoRef.current.click();
  };

  const onImgChange = async (e) => {
    const {
      target: { files },
    } = e;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setSelectedImg(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Background onClick={onCancelClick} name='info' />
      <ModalContainer>
        <Infos>
          <Title>정보 수정</Title>
          <CloseIcon name='info' onClick={onCancelClick}></CloseIcon>
          <PhotoSelect
            type='file'
            accept='image/*'
            ref={uploadPhotoRef}
            name='photo'
            onChange={onImgChange}
          />
          <Avata src={selectedImg} onClick={onPhotoClick} />
          <TextSpace>
            <Text>이름</Text>
            <Name name='name' placeholder='이름을 입력하세요' value={name} onChange={onTextChange} />
          </TextSpace>

          {role === 'tutor' ? (
            <>
              <TextSpace>
                <Text>분야</Text>
                <Info name='field' value={field} onChange={onTextChange} />
              </TextSpace>
              <TextSpace>
                <Text>경력</Text>
                <Bio name='career' value={career} style={{ height: 150 }} onChange={onTextChange} />
              </TextSpace>
            </>
          ) : (
            ''
          )}
        </Infos>
        <Button color='black' name='info' onClick={onButtonClick}>
          확인
        </Button>
      </ModalContainer>
    </>
  );
};

export default InfoModal;
