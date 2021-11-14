import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService, db } from '../fbase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
const Container = styled.div`
  display: flex;
  flex: 1;
`;
const Table = styled.table`
  width: 1500px;
  border: 1px solid #ededed;
`;
const Row = styled.tr`
  border-bottom: 1px solid #ededed;
  font-size: 13px;
  background-color: #f9f9f9;
  &:hover {
    background-color: #e7f6f6;
    transition: background-color 0.5s;
  }
  &:first-child {
    & > th {
      padding: 20px;
      background-color: #f9f9f9;
    }
  }
  #title {
    width: 500px;
  }
  & > td {
    padding: 15px;
    font-size: 15px;
    text-align: center;
    &:first-child {
      font-weight: 500;
    }
  }
`;
const RateBtn = styled.button``;
const reportBtn = styled.button``;
const MyLecture = () => {
  const user = authService.currentUser;
  let [userData, setUserData] = useState();
  let [myLecture, setMyLecture] = useState([]);
  const fetchUser = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };

  useEffect(() => {
    fetchUser()
      .then((user) => {
        setUserData(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const viewContent = () => {
    const result = [];
    getData(userData.myLecture);
    myLecture.map((curData) => {
      result.push(
        <Row className='dataList'>
          <td>{curData.numberOfPeople == curData.studentId.length ? `완료` : `미완료`}</td>
          <td id='title'>
            <Link
              to={{
                pathname: '/Board/' + curData.id,
              }}
            >
              {curData.title}
            </Link>
          </td>
          <td>{curData.numberOfPeople}</td>
          <td>{curData.studentId.length}</td>
          <td>{curData.teacher}</td>
          <td>
            <RateBtn
              onClick={() => {
                if (user.uid === curData.uid) {
                  alert('자기자신은 평가할 수 없습니다.');
                } else {
                  let rate = prompt(`평점을 입력하시오.(1~5)`);
                  if (1 <= rate && rate <= 5) {
                    setRate((curData.rate + rate) / 2, curData.uid);
                    alert('평가 되었습니다.');
                  } else {
                    alert('1~5 사이의 평점을 입력하세요');
                  }
                }
              }}
            ></RateBtn>
          </td>
          <td>
            <reportBtn></reportBtn>
          </td>
        </Row>,
      );
    });

    return result;
  };
  const getData = (ids) => {
    const fetch = async (id) => {
      const docRef = doc(db, 'dataFile', `${id}`);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    };
    let result = [];
    ids.map(async (id) => {
      fetch(id)
        .then((data) => {
          result.push(data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
    setMyLecture(result);
  };
  const setRate = async (rate, uid) => {
    await updateDoc(doc(db, 'users', uid), { rate: rate });
  };

  return (
    <div className='inner'>
      <main>
        <h1>My강좌</h1>
        <Container>
          <Table>
            <thead>
              <Row>
                <th>모집현황</th>
                <th id='title'>제목</th>
                <th>모집 인원</th>
                <th>신청 인원</th>
                <th>선생님</th>
                <th>평가하기</th>
                <th>신고하기</th>
              </Row>
            </thead>
            {/* <tbody>{userData !== undefined ? viewContent() : ''}</tbody> */}
          </Table>
        </Container>
      </main>
    </div>
  );
};
export default MyLecture;
