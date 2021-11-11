import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';

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
  width: 100px;
  height: 100%;
  line-height: 30px;
  margin-right: 10px;
`;
const SeacrchInput = styled.input`
  background-color: #f9f9f9;
  width: 600px;
  height: 100%;
  border: 0px;
  margin-right: 10px;
  border: 1px solid black;
`;
const SearchButton = styled.button`
  width: 150px;
  background-color: #3c78c0;
`;
const Table = styled.table`
  width: 1500px;
  border: 1px solid #ededed;
`;
const Row = styled.tr`
  border-bottom: 1px solid #ededed;
  font-size: 13px;
  background-color: #f9f9f9;
  &:first-child {
    & > th {
      padding: 20px;
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
  margin: 30px auto;
  width: 100%;
  height: 50px;
  font-size: 18px;
`;
const ButtonBox = styled.div`
  margin: auto;
  width: 200px;
`;

const Board = () => {
  const [info, setInfo] = useState([
    { title: '데이터 파일0', date: '2021-07-23', views: '24', id: 4 },
    { title: '데이터 파일1', date: '2021-07-23', views: '24', id: 5 },
    { title: '데이터 파일2', date: '2021-07-23', views: '24', id: 6 },
    { title: '데이터 파일3', date: '2021-07-23', views: '24', id: 7 },
  ]);

  const [dataFile, setDataFile] = useState([
    {
      number: '1',
      title: '가',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '한석원',
      date: '2021-07-23',
    },
    {
      number: '2',
      title: '나',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '한석원',
      date: '2021-07-23',
    },
    {
      number: '3',
      title: '다',
      type: '개인',
      numberOfPeople: '3',
      time: '2',
      teacher: '한석원',
      date: '2021-07-23',
    },
    {
      number: '4',
      title: '제목입니다',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '배성현',
      date: '2021-07-23',
    },
    {
      number: '5',
      title: '제목입니다',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '전병민',
      date: '2021-07-23',
    },
    {
      number: '6',
      title: '제목입니다',
      type: '그룹',
      numberOfPeople: '3',
      time: '2',
      teacher: '한석원',
      date: '2021-07-23',
    },
  ]);
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
  const selectHandler = (e) => {
    e.preventDefault();
    setSelected(e.target.value);
  };
  const searchSpace = async (e) => {
    let search = await e.target.value;
    setKeyword(search);
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
      let curData = filterData[i];
      result.push(
        <Row>
          <td>{curData.number}</td>
          <td id='title'>
            <Link
              to={{
                pathname: '/Board/' + curData.number,
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
  return (
    <div className='inner'>
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
          <tbody>{contentList(viewingListCount)}</tbody>
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
      </ButtonBox>
    </div>
  );
};
export default Board;
