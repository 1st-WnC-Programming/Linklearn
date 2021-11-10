import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;
const SearchBox = styled.div`
  margin: auto;
  width: 90%;
  height: 50px;
  background-color: lightblue;
  margin-bottom: 50px;
`;
const TeacherBox = styled.div`
  background-color: white;
  width: 350px;
  height: 200px;
  border: 1px solid lightgray;
`;
const Board = () => {
  return (
    <div className='inner'>
      <SearchBox>123</SearchBox>
      <Container>
        <TeacherBox>123</TeacherBox>
      </Container>
    </div>
  );
};
export default Board;
