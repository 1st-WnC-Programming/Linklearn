import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { authService, db } from '../fbase';
import { Close } from '@styled-icons/evaicons-solid';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';

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
  padding-top: 40px;
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
  border: 1px solid rgba(0, 0, 0, 0.5);
`;
const Row = styled.tr`
  font-size: 12px;
  background-color: #fff;

  &:first-child {
    & > th {
      padding: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
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
  padding: 3px 5px;
  text-align: center;
  font-size: 13px;

  color: black;
  border: 1px solid black;
  border-radius: 5px;

  &:hover {
    background-color: ${({ color }) => color};
    color: white;
    transition: all ease-out 0.3s 0s;
  }
`;
const Notice = styled.div`
  font-size: 12px;
  float: right;
  margin-right: 5px;
`;

const BlackListModal = ({ showModal, close }) => {
  const [reportList, setReportList] = useState([]);
  const SetReportList = async () => {
    const q = query(collection(db, 'users'), where('numberOfReport', '>', 3));
    const querySnapshot = await getDocs(q);
    var list = [];
    querySnapshot.forEach((doc) => {
      const temp = {
        name: doc.data().name,
        email: doc.data().email,
        numberOfReport: doc.data().numberOfReport,
        id: doc.data().id,
      };
      list.push(temp);
    });
    blackList.map((blackdata) => {
      list = list.filter((data) => {
        return blackdata.id != data.id;
      });
    });
    setReportList(list);
  };

  const [blackList, setBlackList] = useState([]);
  const SetBlackList = async () => {
    const q = query(collection(db, 'blackList'));
    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach((doc) => {
      const temp = {
        name: doc.data().name,
        email: doc.data().email,
        numberOfReport: doc.data().numberOfReport,
        id: doc.data().id,
      };
      list.push(temp);
    });
    setBlackList([...list]);
    console.log(blackList);
  };

  useEffect(() => {
    SetBlackList();
  }, []);

  useEffect(() => {
    SetReportList();
  }, [blackList]);

  const viewList = (info) => {
    const result = [];
    info?.map((curData) => {
      result.push(
        <Row className='dataList'>
          <td>{curData?.name}</td>
          <td>{curData?.email}</td>
          <td>🚨 {curData?.numberOfReport}</td>
          <td>
            <Button color='black' onClick={() => moveToBlack(curData)}>
              블랙
            </Button>
          </td>
        </Row>,
      );
    });
    return result;
  };
  const viewBlackList = (info) => {
    const result = [];
    info?.map((curData) => {
      result.push(
        <Row className='dataList'>
          <td>{curData.name}</td>
          <td>{curData.email}</td>
          <td>
            <Button color='black' onClick={() => deleteBlack(curData)}>
              해제
            </Button>
          </td>
        </Row>,
      );
    });
    return result;
  };
  const moveToBlack = async (data) => {
    await setDoc(doc(db, 'blackList', data.id), {
      name: data.name,
      id: data.id,
      email: data.email,
      numberOfReport: data.numberOfReport,
    });
    SetBlackList();
  };
  const deleteBlack = async (data) => {
    await deleteDoc(doc(db, 'blackList', data.id));
    SetBlackList();
  };
  return (
    <div>
      {showModal ? (
        <Background onClick={close}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
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
                        <th></th>
                      </Row>
                    </thead>
                    <tbody>{viewList(reportList)}</tbody>
                  </Table>
                </Container>
                <Notice>* 신고 수가 3회 이상인 선생님들이 표시됩니다 </Notice>
              </ReportList>
              <BlackList>
                <Header>블랙리스트</Header>
                <Container>
                  <Table>
                    <thead>
                      <Row>
                        <th>이름</th>
                        <th>이메일</th>
                        <th></th>
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
