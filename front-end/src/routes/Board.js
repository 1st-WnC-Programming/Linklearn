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
  background-color: aliceblue;
  width: 20%;
  height: 100%;
  line-height: 30px;
  margin-right: 10px;
`;
const SeacrchInput = styled.input`
  background-color: aliceblue;
  width: 60%;
  height: 100%;
  line-height: 30px;
  border: 0px;
  margin-right: 10px;
`;
const SearchButton = styled.button`
  width: 20%;
  background-color: aliceblue;
`;

const Board = () => {
  return (
    <div className='inner'>
      <SearchBox>
        <SortTitle>123</SortTitle>
        <SeacrchInput></SeacrchInput>
        <SearchButton>검색</SearchButton>
      </SearchBox>
      <Container></Container>
    </div>
  );
};
export default Board;
