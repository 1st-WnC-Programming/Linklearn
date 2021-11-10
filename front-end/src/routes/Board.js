import styled from 'styled-components';
import { Link } from 'react-router-dom';
const info = [
  {
    title: '공지사항 입니다.공지사항 입니다.공지사항 입니다.',
    date: '2021-07-23',
    views: '42',
    id: 0,
  },
  { title: '공지사항 입니다1.', date: '2021-07-23', views: '42', id: 1 },
  { title: '공지사항 입니다2.', date: '2021-07-23', views: '42', id: 2 },
  { title: '공지사항 입니다3.', date: '2021-07-23', views: '42', id: 3 },
];
const dataFile = [
  { title: '데이터 파일0', date: '2021-07-23', views: '24', id: 4 },
  { title: '데이터 파일1', date: '2021-07-23', views: '24', id: 5 },
  { title: '데이터 파일2', date: '2021-07-23', views: '24', id: 6 },
  { title: '데이터 파일3', date: '2021-07-23', views: '24', id: 7 },
];
const Container = styled.div`
  display: flex;
  flex: 1;
`;
const SearchBox = styled.div`
  margin: auto;
  width: 90%;
  height: 50px;
  background-color: lightblue;
  margin-bottom: 50px;
  padding: 10px;
  display: flex;
`;
const SortTitle = styled.div`
  background-color: #f9f9f9;
  width: 20%;
  height: 100%;
  line-height: 30px;
  margin-right: 10px;
`;
const SeacrchInput = styled.input`
  background-color: #f9f9f9;
  width: 60%;
  height: 100%;
  line-height: 30px;
  border: 0px;
  margin-right: 10px;
`;
const SearchButton = styled.button`
  width: 20%;
  background-color: #f9f9f9;
`;
const Table = styled.table`
  width: 100%;
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
const contentList = () => {
  const result = [];
  for (let i = 0; i < 5; i++) {
    result.push(
      <Row>
        <td>{i + 1}</td>
        <td id='title'>제목입니다</td>
        <td>그룹</td>
        <td>3</td>
        <td>2</td>
        <td>한석원</td>
        <td>21.11.11</td>
      </Row>,
    );
  }
  return result;
};
const Board = () => {
  return (
    <div className='inner'>
      <SearchBox>
        <SortTitle>123</SortTitle>
        <SeacrchInput></SeacrchInput>
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
          <tbody>{contentList()}</tbody>
        </Table>
      </Container>
    </div>
  );
};
export default Board;
