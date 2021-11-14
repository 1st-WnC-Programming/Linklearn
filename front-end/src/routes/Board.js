import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService, db } from '../fbase';
import { doc, getDoc } from 'firebase/firestore';
const Container = styled.div`
  display: flex;
  flex: 1;
`;
const SearchBox = styled.div`
  margin: auto;
  width: 1000px;
  height: 55px;
  margin: 50px auto;
  padding: 10px;
  display: flex;
  justify-content: center;
`;
const SortTitle = styled.select`
  background-color: #f9f9f9;
  font-size: 15px;
  width: 150px;
  height: 40px;
  line-height: 30px;
  margin-right: 10px;
  text-align: center;
  border-radius: 10px;
`;
const SeacrchInput = styled.input`
  padding: 15px;
  font-size: 15px;
  width: 500px;
  height: 40px;
  margin-right: 10px;
  border: 2px solid black;
  border-radius: 10px;
`;
const SearchButton = styled.button`
  padding: 2px 20px;
  height: 40px;
  color: black;
  justify-content: center;
  font-size: 15px;
  border: 2px solid black;
  border-radius: 5px;

  &:hover {
    background-color: black;
    color: white;
    transition: all ease-out 0.3s 0s;
  }
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
const AddBoardListButton = styled.button`
  background-color: #3c78c0;
  border-radius: 10px;
  margin: 30px auto 20px;
  width: 100%;
  height: 50px;
  font-size: 18px;
`;
const ButtonBox = styled.div`
  margin: 0px auto;
  width: 200px;
  height: 200px;
`;

const PostButton = styled.button`
  background-color: #3c78c0;
  border-radius: 10px;
  margin: auto;
  width: 100%;
  height: 50px;
  font-size: 18px;
`;
const Board = ({ info, dataFile }) => {
  const [keyword, setKeyword] = useState(null);
  const selectList = {
    all: '전체',
    title: '제목',
    type: '과외 종류',
    teacher: '선생님',
    numberOfPeople: '모집인원',
  };
  const [selected, setSelected] = useState('all');
  const [viewingListCount, setViewingListCount] = useState(5);
  const user = authService.currentUser;
  let [userData, setUserData] = useState({});
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
  const navigate = useNavigate();

  const selectHandler = (e) => {
    e.preventDefault();
    setSelected(e.target.value);
  };
  const searchSpace = async (e) => {
    let search = await e.target.value;
    setKeyword(search);
  };
  const viewPostBtn = () => {
    if (user != null) {
      if (userData.role !== 'student') {
        return (
          <PostButton
            onClick={() => {
              navigate('/Board/PostList');
            }}
          >
            글쓰기
          </PostButton>
        );
      }
    }
  };
  const contentList = (viewingListCount) => {
    const result = [];
    const filterData = dataFile.filter((item) => {
      if (keyword == null || keyword == '') return item;
      else {
        if ((selected == 'all' || selected === 'title') && item.title.includes(keyword)) {
          return item;
        } else if ((selected == 'all' || selected == 'teacher') && item.teacher.includes(keyword)) {
          return item;
        } else if (
          (selected == 'all' || selected == 'numberOfPeople') &&
          item.numberOfPeople.includes(keyword)
        )
          return item;
        else if ((selected == 'all' || selected == 'type') && item.type.includes(keyword)) return item;
      }
    });
    for (let i = 0; i < viewingListCount; i++) {
      if (filterData.length <= i) break;
      let curData = filterData[filterData.length - i - 1];
      result.push(
        <Row className='dataList'>
          <td>{filterData.length - i}</td>
          <td id='title'>
            <Link
              to={{
                pathname: '/Board/' + curData.id,
                state: { isInfo: false },
              }}
            >
              {curData.title}
            </Link>
          </td>
          <td>{curData.type}</td>
          <td>{curData.numberOfPeople}</td>
          <td>{curData.time}</td>
          <td>{curData.teacher}</td>
          <td>{curData.date}</td>
        </Row>,
      );
    }
    return result;
  };
  const viewInfo = (info) => {
    const result = [];
    info.map((curData) => {
      result.push(
        <Row className='dataList'>
          <td>공지</td>
          <td id='title'>
            <Link
              to={{
                pathname: '/Board/' + curData.id,
              }}
            >
              {curData.title}
            </Link>
          </td>
          <td>{curData.type}</td>
          <td>{curData.numberOfPeople}</td>
          <td>{curData.time}</td>
          <td>{curData.teacher}</td>
          <td>{curData.date}</td>
        </Row>,
      );
    });
    return result;
  };
  return (
    <div className='inner'>
      <main>
        <SearchBox>
          <SortTitle onChange={selectHandler} value={selected}>
            {Object.entries(selectList).map((item) => (
              <option value={item[0]} key={item[0]}>
                {item[1]}
              </option>
            ))}
          </SortTitle>
          <SeacrchInput
            type='text'
            placeholder='검색어를 입력하세요.'
            onChange={(e) => searchSpace(e)}
          ></SeacrchInput>
          <SearchButton>검색</SearchButton>
        </SearchBox>
        <Container>
          <Table>
            <thead>
              <Row>
                <th>번호</th>
                <th id='title'>제목</th>
                <th>종류</th>
                <th>모집 인원</th>
                <th>과외 시간</th>
                <th>선생님</th>
                <th>등록일</th>
              </Row>
            </thead>
            <tbody>
              {viewInfo(info)}
              {contentList(viewingListCount)}
            </tbody>
          </Table>
        </Container>
        <ButtonBox>
          <AddBoardListButton
            onClick={() => {
              setViewingListCount(viewingListCount + 5);
            }}
          >
            더보기
          </AddBoardListButton>

          {viewPostBtn()}
        </ButtonBox>
      </main>
    </div>
  );
};
export default Board;
