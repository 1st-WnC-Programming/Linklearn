import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { authService, db, rt_db, storageService } from '../fbase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref, set, child, update, push } from 'firebase/database';

import unknown from '../Images/Unknown_person.jpeg';
import { v4 } from 'uuid';
import { getDownloadURL, uploadString, ref as storageRef } from 'firebase/storage';

const Logo = styled.div`
  font-size: 70px;
  font-weight: 700;
  /* font-style: italic; */
  color: #3c78c8;
  margin-bottom: 30px;
  /* width: 100%; */
  border-bottom: 4px solid #3c78c8;
  @media only screen and (max-width: 800px) {
    font-size: 50px;
  }
`;

const PhotoSelect = styled.input`
  display: none;
`;

const Avata = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 20px;

  &:hover {
    opacity: 0.6;
  }
`;

const TextField = styled.input`
  margin-bottom: 10px;
  border: 1px solid lightgray;
  font-size: 15px;
  padding: 10px 15px;
  width: 100%;
  height: 50px;
  outline: 0;

  &:focus {
    border: 1.5px solid #0062df;
  }

  @media only screen and (max-width: 800px) {
    height: 45px;
  }
`;

const LoginButton = styled.input`
  background-color: ${({ color }) => color};
  font-size: 15px;
  padding: 12px 50px;
  color: white;
  justify-content: center;
  font-size: 18px;
  margin: 8px 0;
  width: 100%;
  border: none;
  @media only screen and (max-width: 800px) {
    font-size: 15px;
  }
`;

const LoginWrap = styled.div`
  min-height: calc(100vh - 190px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 370px;
  padding-bottom: 70px;
`;

const Register = () => {
  const uploadPhotoRef = useRef();
  const [selectedImg, setSelectedImg] = useState(unknown);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSignClick = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(authService, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        let fileURL = '';

        if (selectedImg !== unknown) {
          const fileRef = storageRef(storageService, `${user.uid}/${v4()}`);
          const res = await uploadString(fileRef, selectedImg, 'data_url');
          fileURL = await getDownloadURL(res.ref);
        } else {
          fileURL = unknown;
        }

        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          name: name,
          role: 'student',
          major: null,
          photoURL: fileURL,
          rate: 0,
          evaluateNumber: 0,
          bio: null,
          myLecture: [],
          numberOfReport: 0,
          createdAt: serverTimestamp(),
        });

        updateProfile(authService.currentUser, {
          displayName: name,
          photoURL: fileURL,
        })
          .then(() => {
            console.log('update profile');
          })
          .catch((error) => {
            console.long(error);
          });

        set(ref(rt_db, 'users/' + user.uid), {
          username: name,
          email: email,
          profile_picture: '',
        });
        window.location.replace('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  const onTextChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'name') setName(value);
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

  const onPhotoClick = () => {
    uploadPhotoRef.current.click();
  };

  return (
    <LoginWrap>
      <LoginBox>
        <Logo>REGISTER</Logo>
        <PhotoSelect type='file' accept='image/*' ref={uploadPhotoRef} name='photo' onChange={onImgChange} />
        <Avata src={selectedImg} onClick={onPhotoClick} />
        <form onSubmit={onSignClick}>
          <TextField placeholder={'이름'} id='name' name='name' onChange={onTextChange} required />
          <TextField placeholder={'이메일'} id='email' name='email' onChange={onTextChange} required />
          <TextField
            type='password'
            placeholder={'비밀번호'}
            id='password'
            name='password'
            onChange={onTextChange}
            required
          />

          {<div style={{ color: 'red' }}>{error}</div>}

          <LoginButton type='submit' color='#3c78c8' name='signup' value='REGISTER' />
        </form>
      </LoginBox>
    </LoginWrap>
  );
};

export default Register;
