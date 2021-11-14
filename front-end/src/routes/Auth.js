import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  signInWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { authService, db, rt_db } from '../fbase';
import { ref, set, child, update, push } from 'firebase/database';
import { addDoc, collection, doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';

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

  const onSignClick = () => {
    signInWithEmailAndPassword(authService, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user.uid);
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  const onSocialClick = (e) => {
    const {
      target: { name },
    } = e;

    let provider;

    if (name === 'google') {
      provider = new GoogleAuthProvider();
      signInWithPopup(authService, provider)
        .then(async (result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          set(ref(rt_db, 'users/' + user.uid), {
            username: user.displayName,
            email: user.email,
            profile_picture: user.photoURL,
          });
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
              id: user.uid,
              email: user.email,
              name: user.displayName,
              role: 'student',
              major: null,
              photoURL: null,
              rate: 0,
              bio: null,
              numberOfReport: 0,
              createdAt: serverTimestamp(),
            });
          }

          navigate('/');
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
      signInWithPopup(authService, provider)
        .then(async (result) => {
          const credential = GithubAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          set(ref(rt_db, 'users/' + user.uid), {
            username: user.displayName,
            email: user.email,
            profile_picture: user.photoURL,
          });
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
              id: user.uid,
              email: user.email,
              name: user.displayName,
              role: 'student',
              major: null,
              photoURL: null,
              rate: 0,
              bio: null,
              numberOfReport: 0,
              createdAt: serverTimestamp(),
            });
          }

          navigate('/');
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
        });
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
        <TextField placeholder={'이메일'} id='email' name='email' onChange={onTextChange} />
        <TextField
          type='password'
          placeholder={'비밀번호'}
          id='password'
          name='password'
          onChange={onTextChange}
        />

        {<div style={{ color: 'red' }}>{error}</div>}

        <LoginButton color='#3c78c8' name='signin' onClick={onSignClick}>
          LOGIN
        </LoginButton>

        <Link to={'/Register'} style={{ width: '100%' }}>
          <LoginButton color='#8E8E8E' name='signup'>
            회원가입
          </LoginButton>
        </Link>

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
