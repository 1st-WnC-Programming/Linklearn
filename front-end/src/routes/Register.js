import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { authService, db } from '../fbase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

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

const LoginButton = styled.button`
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
  width: 100%;
  max-width: 370px;
  padding-bottom: 70px;
`;

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSignClick = () => {
    createUserWithEmailAndPassword(authService, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          name: name,
          role: 'student',
          major: null,
          photoURL: null,
          rate: 0,
          bio: null,
          numberOfReport: 0,
          createdAt: serverTimestamp(),
        });

        navigate('/');
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

  return (
    <LoginWrap>
      <LoginBox>
        <Logo>REGISTER</Logo>
        <TextField placeholder={'이름'} id='name' name='name' onChange={onTextChange}></TextField>
        <TextField placeholder={'이메일'} id='email' name='email' onChange={onTextChange}></TextField>
        <TextField
          type='password'
          placeholder={'비밀번호'}
          id='password'
          name='password'
          onChange={onTextChange}
        ></TextField>

        {<div style={{ color: 'red' }}>{error}</div>}

        <LoginButton color='#3c78c8' name='signup' onClick={onSignClick}>
          REGISTER
        </LoginButton>
      </LoginBox>
    </LoginWrap>
  );
};

export default Register;
