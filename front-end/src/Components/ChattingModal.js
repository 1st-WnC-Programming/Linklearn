import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Close } from '@styled-icons/evaicons-solid';
import { authService, db, rt_db } from '../fbase';
import { ref, set, child, update, push } from 'firebase/database';

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

const ChattingInput = styled.input`
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
    transition: all ease-out 0.4s 0s;
  }
`;

const ChattingBox = styled.div`
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

const Title = styled.div`
  font-size: 30px;
  position: absolute;
  left: 40px;
  top: 40px;
  font-weight: 700;
`;

const ChattingModal = ({ handleModalClick, teacherObj }) => {
  const user = authService.currentUser;

  const handleCancelButton = (e) => {
    handleModalClick(e);
  };

  const handleSendChat = (data) => {};

  return (
    <>
      <Background onClick={handleCancelButton} />
      <ModalContainer>
        <ChattingBox>
          <Title>{teacherObj.name} 선생님과의 채팅</Title>
          <CloseIcon onClick={handleCancelButton}></CloseIcon>
          <TextSpace>
            <ChattingInput name='chattingInput' placeholder='' />
            <Button color='black' onClick={(e) => handleSendChat(e)}>
              전송
            </Button>
          </TextSpace>
        </ChattingBox>
        <Button color='black' onClick={handleCancelButton}>
          나가기
        </Button>
      </ModalContainer>
    </>
  );
};

export default ChattingModal;
