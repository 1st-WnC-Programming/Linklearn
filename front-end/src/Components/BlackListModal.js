import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { authService, db } from '../fbase';
import { Close } from '@styled-icons/evaicons-solid';
import {collection, query, where, getDocs} from 'firebase/firestore';

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
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-height: 80%;
  width: 70%;
  height: 70%;
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
  font-size: 15px;
  font-weight: 400;
  padding-bottom: 20px;
`;

const ModalBody = styled.div`
  width: 100%;
  height: 95%;
`;
const ReportList = styled.div`
  width: 50%;
  height: 100%;
  float: left;
`;
const BlackList = styled.div`
  width: 50%;
  height: 100%;
  float: right;
`;
const Header = styled.div`
  font-size: 30px;
  font-weight: 500;
  margin: 20px;
`;
const Container = styled.div`
  display: flex;
  padding: 5px;
  flex: 1;
`;
const Table = styled.table`
  width: 1500px;
  border: 1px solid #ededed;
`;
const Row = styled.tr`
  border-bottom: 1px solid #ededed;
  font-size: 12px;
  background-color: #fff;

  &:first-child {
    & > th {
      padding: 10px;
      background-color: #f9f9f9;
    }
  }
  & > td {
    padding: 11px;
    font-size: 15px;
    text-align: center;
    &:first-child {
      font-size: 20px;
      font-weight: 800;
    }
  }
`;
 const Button = styled.button`
    background-color: ${({ color }) => color};
    border: none;
    color: white;
    border-radius:5px;
    padding: 3px 5px;
    text-align: center;
    font-size: 13px;
 `;

const BlackListModal = ({ showModal, close }) => {
    const [reportList, setReportList] = useState([]);
    const SetReportList = async() => {
        const q = query(collection(db, "users"), where("numberOfReport", ">", 3));
        const querySnapshot = await getDocs(q);
        const list =[];
        querySnapshot.forEach((doc) => {
            const temp = {
                name: doc.data().name,
                email: doc.data().email,
                numberOfReport: doc.data().numberOfReport,
                id: doc.data().id
            };
            list.push(temp);
        });
        setReportList([...list]);
        console.log(reportList);
    }
    useEffect(() => {
        SetReportList();
      }, []);
    

  const [blackList, setBlackList] = useState([
    {
      name: '정균',
      numberOfReport: 5,
      email: 'wjk6044@naver.com',
      role: 'tutor',
    },
    {
      name: '우균',
      numberOfReport: 5,
      email: 'wjk6044@naver.com',
      role: 'tutor',
    },
  ]);
  const viewList = (info) => {
    const result = [];
    info.map((curData) => {
      result.push(
        <Row className='dataList'>
          <td>{curData.name}</td>
          <td>{curData.email}</td>
          <td>🚨 {curData.numberOfReport}</td>
          <td><Button color='#dc3545'>블랙</Button></td>
        </Row>,
      );
    });
    return result;
  };
  const viewBlackList = (info) => {
    const result = [];
    info.map((curData) => {
      result.push(
        <Row className='dataList'>
          <td>{curData.name}</td>
          <td>{curData.email}</td>
          <td><Button color='#3c78c8'>해제</Button></td>
        </Row>,
      );
    });
    return result;
  };
  return (
    <div>
      {showModal ? (
        <Background onClick={close}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>블랙리스트 관리</ModalHeader>
            <CloseIcon onClick={close}></CloseIcon>
            <ModalBody>
              <ReportList>
                <Header>신고 목록</Header>
                <Container>
                  <Table>
                    <thead>
                      <Row>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>신고 수</th>
                        <th>블랙</th>
                      </Row>
                    </thead>
                    <tbody>{viewList(reportList)}</tbody>
                  </Table>
                </Container>
              </ReportList>
              <BlackList>
                <Header>블랙리스트</Header>
                <Container>
                  <Table>
                    <thead>
                      <Row>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>해제</th>
                      </Row>
                    </thead>
                    <tbody>{viewBlackList(blackList)}</tbody>
                  </Table>
                </Container>
              </BlackList>
            </ModalBody>
          </ModalContainer>
        </Background>
      ) : null}
    </div>
  );
};

export default BlackListModal;
