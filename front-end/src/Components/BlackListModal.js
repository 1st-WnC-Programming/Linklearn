import React, { useState } from 'react';
import styled from 'styled-components';
import { Close } from "@styled-icons/evaicons-solid";

const Background = styled.div`
position: fixed;
top: 0;
left: 0;
bottom: 0;
right: 0;
background-color: rgba(0,0,0,0.50);
z-index: 0;
`;

const ModalContainer = styled.div`
position: fixed;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
max-height: 80%;
width: 70%;
height: 80%;
padding: 16px;
background: #fff;
border-radius: 10px;
text-align: center;

`;

const CloseIcon = styled(Close)`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 2rem;
    cursor: pointer;
`;

const ModalHeader = styled.div`
    font-size: 20px;
    font-weight:400;
    padding-bottom:20px;
`;

const ModalBody = styled.div`
    width:100%;
    height:95%;
`;
const ReportList = styled.div`
    width:50%;
    height:100%;
    float:left;
    background-color:red;
`;
const BlackList = styled.div`
    width:50%;
    height:100%;
    float:right;
    background-color:blue;
`;
const BlackListModal = ({showModal, close}) => {
    return (
      <div>
        {showModal ?
        <Background onClick={close}>
            <ModalContainer onClick={e => e.stopPropagation()}>
                <ModalHeader>블랙리스트 관리</ModalHeader>
                <CloseIcon onClick={close}></CloseIcon>
                <ModalBody> 
                    <ReportList>
                        
                    </ReportList>
                    <BlackList>
                        
                    </BlackList>
                </ModalBody>
            </ModalContainer>
        </Background> : null}
      </div>
    );
  };
  
  export default BlackListModal;
  