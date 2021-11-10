import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { authService } from '../fbase';

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

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSignClick = (e) => {
    const {
      target: { name },
    } = e;
    if (name === 'signin') {
      signInWithEmailAndPassword(authService, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          navigate('/');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
        });
    } else if (name === 'signup') {
      createUserWithEmailAndPassword(authService, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          navigate('/');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
        });
    }
  };

  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    try {
      if (name === 'google') {
        provider = new GoogleAuthProvider();
        const result = await signInWithPopup(authService, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
      } else if (name === 'github') {
        provider = new GithubAuthProvider();
        const result = await signInWithPopup(authService, provider);
        // const credential = GithubAuthProvider.credentialFromResult(result);
      }
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const onTextChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  return (
    <LoginWrap>
      <LoginBox>
        <Logo>LOGIN</Logo>
        <TextField placeholder={'이메일'} id='email' name='email' onChange={onTextChange}></TextField>
        <TextField
          type='password'
          placeholder={'비밀번호'}
          id='password'
          name='password'
          onChange={onTextChange}
        ></TextField>

        {<div style={{ color: 'red' }}>{error}</div>}

        <LoginButton color='#3c78c8' name='signin' onClick={onSignClick}>
          LOGIN
        </LoginButton>
        <LoginButton color='#8E8E8E' name='signup' onClick={onSignClick}>
          회원가입
        </LoginButton>
        <LoginButton color='#8E8E8E' name='google' onClick={onSocialClick}>
          Continue with Google
        </LoginButton>
        <LoginButton color='#8E8E8E' name='github' onClick={onSocialClick}>
          Continue with Github
        </LoginButton>
      </LoginBox>
    </LoginWrap>
  );
};

export default Auth;
