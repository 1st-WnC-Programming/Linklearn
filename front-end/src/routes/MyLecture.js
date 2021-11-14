import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService, db } from '../fbase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { CellularData1 } from 'styled-icons/fluentui-system-filled';
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
const RateBtn = styled.button`
  padding: 5px 10px;
  text-align: center;
  font-size: 15px;

  color: black;
  border: 1px solid black;
  border-radius: 5px;

  &:hover {
    background-color: ${({ color }) => color};
    color: white;
    transition: all ease-out 0.3s 0s;
  }
`;
const ReportBtn = styled.button`
  padding: 5px 10px;
  text-align: center;
  font-size: 15px;

  color: #e0557d;
  border: 1px solid #e0557d;
  border-radius: 5px;

  &:hover {
    background-color: ${({ color }) => color};
    color: white;
    transition: all ease-out 0.3s 0s;
  }
`;
const MyLecture = () => {
  const user = authService.currentUser;
  let [userData, setUserData] = useState();
  let [myLecture, setMyLecture] = useState([]);

  let [tutorReport, setTutorReport] = useState([]);
  let [tutorRate, setTutorRate] = useState([]);
  let [rate, setRate] = useState(-1);

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
  useEffect(() => {
    if (userData !== undefined) {
      getData(userData.myLecture);
    }
  }, [userData]);

  useEffect(() => {
    if (tutorReport.length !== 0) {
      updateNumOfReport(tutorReport);
    }
  }, [tutorReport]);

  useEffect(() => {
    if (tutorRate.length !== 0 && rate !== -1) {
      updateRate(tutorRate);
      setRate(-1);
    }
  }, [tutorRate]);

  const viewContent = () => {
    const result = [];
    myLecture.map((curData) => {
      console.log(curData);
      result.push(
        <Row className='dataList'>
          <td>{Number(curData.numberOfPeople) <= curData.studentId.length ? `완료` : `미완료`}</td>
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
              color='black'
              onClick={() => {
                if (user.uid === curData.uid) {
                  alert('자기자신은 평가할 수 없습니다.');
                } else {
                  let rate = prompt(`평점을 입력하시오.(1~5)`);
                  if (1 <= rate && rate <= 5) {
                    setRate(rate);
                    getTutorRate(curData.uid);
                    alert('평가 되었습니다.');
                  } else {
                    alert('1~5 사이의 평점을 입력하세요');
                  }
                }
              }}
            >
              평가
            </RateBtn>
          </td>
          <td>
            <ReportBtn
              color='#e0557d'
              onClick={() => {
                if (user.uid === curData.uid) {
                  alert('자기자신은 신고할 수 없습니다.');
                } else {
                  if (window.confirm('신고하시겠습니까?')) {
                    //console.log(curData);
                    getTutorReport(curData.uid);
                    alert('신고 되었습니다.');
                  } else {
                    return;
                  }
                }
              }}
            >
              신고
            </ReportBtn>
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
    ids.forEach((id) => {
      fetch(id)
        .then((data) => {
          result.push(data);
          if (result.length === ids.length) {
            setMyLecture(result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
  const getTutorReport = (id) => {
    const fetch = async (uid) => {
      const docRef = doc(db, 'users', `${uid}`);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    };
    fetch(id)
      .then((data) => {
        console.log(data);
        setTutorReport(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getTutorRate = (id) => {
    const fetch = async (uid) => {
      const docRef = doc(db, 'users', `${uid}`);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    };
    fetch(id)
      .then((data) => {
        console.log(data.rate);
        setTutorRate(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateRate = async (data) => {
    console.log(rate);
    console.log(data.rate);
    await updateDoc(doc(db, 'users', data.id), {
      rate: data.rate + Number(rate),
      evaluateNumber: data.evaluateNumber + 1,
    });
  };
  const updateNumOfReport = async (data) => {
    await updateDoc(doc(db, 'users', data.id), {
      numberOfReport: data.numberOfReport + 1,
    });
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
            <tbody>{userData !== undefined ? viewContent() : ''}</tbody>
          </Table>
        </Container>
      </main>
    </div>
  );
};
export default MyLecture;
