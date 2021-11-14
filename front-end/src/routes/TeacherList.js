import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { authService, db } from '../fbase';
import styled from 'styled-components';
import unknownPersonImg from '../Images/Unknown_person.jpeg';
import ChattingModal from '../Components/ChattingModal';

const SearchBox = styled.div`
  margin-top: 10px;
  height: 55px;
  padding: 10px;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const SearchSelect = styled.select`
  background-color: white;
  font-size: 15px;
  width: 150px;
  height: 45px;
  line-height: 30px;
  margin-right: 10px;
  text-align: center;
  border-radius: 10px;
  border: 1px solid grey;
`;

const SearchInput = styled.input`
  padding: 15px;
  font-size: 15px;
  width: 500px;
  height: 45px;
  margin-right: 10px;
  border: 1px solid grey;
  border-radius: 10px;
`;

const Avata = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: none;
  margin-bottom: 20px;
`;

const CardContainer = styled.div`
  flex-direction: column;
  width: 450px;
  height: 600px;
  background-color: white;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  border: none;
  box-shadow: 5px 10px 20px -2px #e2e2e2;
  margin: 20px;
`;

const Container = styled.div`
  /* max-width: 80%; */
  width: 1000px;
  position: absolute;
  left: 48%;
  transform: translate(-50%);
`;

const Infos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Name = styled.div`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Field = styled.div`
  font-size: 20px;
  font-weight: 200;
  margin-bottom: 10px;
`;

const Rate = styled.div`
  font-size: 20px;
  font-weight: 200;
  margin-bottom: 30px;
`;

const Career = styled.div`
  font-size: 20px;
  font-weight: 200;
  margin-bottom: 10px;
`;

const Button = styled.button`
  font-size: 15px;
  padding: 12px 30px;
  color: black;
  justify-content: center;
  font-size: 18px;
  margin: 8px 0;
  width: 40%;
  border: 2px solid black;
  margin: 10px;
  border-radius: 5px;

  &:hover {
    background-color: ${({ color }) => color};
    color: white;
    transition: all ease-out 0.3s 0s;
  }
`;

const TeacherList = () => {
  const user = authService.currentUser;
  const [keyword, setKeyword] = useState('');
  const selectList = { none: '검색 필터', name: '이름', field: '분야', career: '경력' };
  const [searchSelected, setSearchSelected] = useState('none');
  const sortList = {
    none: '정렬 조건',
    starPoint_Desc: '별점 높은 순',
    starPoint_Asc: '별점 낮은 순',
    student_Desc: '학생들이 많이 수강한 순',
    student_Asc: '학생들이 적게 수강한 순',
  };
  const [sortSelected, setSortSelected] = useState('none');
  const [card, setCard] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [chattingToggle, setChattingToggle] = useState(false);
  const [clickedTeacher, setClickedTeacher] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    };

    fetchUser()
      .then((user) => {
        setCurrentUserRole(user.role);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const searchSpace = async (e) => {
    let search = await e.target.value;
    setKeyword(search);
  };

  const searchSelectHandler = (e) => {
    e.preventDefault();
    setSearchSelected(e.target.value);
  };

  const sortSelectHandler = (e) => {
    e.preventDefault();
    setSortSelected(e.target.value);
  };

  useEffect(() => {
    if (sortSelected === 'none') return;
    const sort_condition = sortSelected.split('_');
    setTeacherList(
      sort_condition[1] === 'Asc'
        ? sortAsc(teacherList, sort_condition[0])
        : sortDesc(teacherList, sort_condition[0]),
    );
  }, [sortSelected]);

  const sortAsc = (list, criteria) => {
    console.log('asc');
    return list.sort((user1, user2) => {
      if (user1[criteria] > user2[criteria]) {
        return 1;
      }
      if (user2[criteria] > user1[criteria]) {
        return -1;
      }
      return 0;
    });
  };

  const sortDesc = (list, criteria) => {
    console.log('desc');
    return list.sort((user1, user2) => {
      if (user1[criteria] > user2[criteria]) {
        return -1;
      }
      if (user2[criteria] > user1[criteria]) {
        return 1;
      }
      return 0;
    });
  };

  const getTutor = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'tutor'));
    const querySnapshot = await getDocs(q);
    const tutor = [];
    querySnapshot.forEach((doc) => {
      const temp = {
        id: doc.data().id,
        image: doc.data().photoURL,
        name: doc.data().name,
        field: doc.data().major,
        starPoint: doc.data().rate,
        career: doc.data().bio,
      };
      tutor.push(temp);
    });
    setTeacherList((teacherList) => [...teacherList, ...tutor]);
  };

  useEffect(() => {
    getTutor();
  }, []);

  useEffect(() => {
    let count = 0;
    const newData = teacherList.filter((item) => {
      if (keyword === null || keyword === '' || searchSelected === 'none') return item;
      else {
        if (searchSelected === 'name' && item.name.toLowerCase().includes(keyword.toLowerCase())) {
          return item;
        } else if (searchSelected === 'field' && item.field.toLowerCase().includes(keyword.toLowerCase())) {
          return item;
        } else if (searchSelected === 'career' && item.career.toLowerCase().includes(keyword.toLowerCase())) {
          return item;
        }
        return '??';
      }
    });
    setCard(
      newData.map((value) => (
        <CardContainer key={count++ + value.name + value.starPoint}>
          <Infos className='inner'>
            {value.image === null || value.image === '' ? (
              <Avata src={unknownPersonImg} display='block' />
            ) : (
              <Avata src={value.image} display='block' />
            )}
            <Name>{value.name}</Name>
            <Field>{value.field}</Field>
            <Rate>{value.starPoint}</Rate>
            <Career>{value.career}</Career>
          </Infos>

          <Button color={'black'} onClick={(e) => handleModalClick(e, value)}>
            채팅하기
          </Button>
        </CardContainer>
      )),
    );
  }, [teacherList, sortSelected]);

  const handleModalClick = (e, value) => {
    e.preventDefault();
    if (currentUserRole === 'tutor') {
      alert('Service for only students.');
      return;
    }
    !chattingToggle ? setClickedTeacher(value) : setClickedTeacher('');
    setChattingToggle((prev) => !prev);
  };

  return (
    <main>
      <div className='boxDiv'>
        <SearchBox>
          <SearchSelect onChange={sortSelectHandler} value={sortSelected}>
            {Object.entries(sortList).map((item) => (
              <option value={item[0]} key={item[0]}>
                {item[1]}
              </option>
            ))}
          </SearchSelect>
          <SearchSelect onChange={searchSelectHandler} value={searchSelected}>
            {Object.entries(selectList).map((item) => (
              <option value={item[0]} key={item[0]}>
                {item[1]}
              </option>
            ))}
          </SearchSelect>
          <SearchInput type='text' placeholder='검색어를 입력하세요.' onChange={(e) => searchSpace(e)} />
        </SearchBox>
        <Container className='cardContainer' style={{ width: 1000 }}>
          {card}
        </Container>
      </div>
      {chattingToggle === true && currentUserRole === 'student' ? (
        <ChattingModal handleModalClick={handleModalClick} teacherObj={clickedTeacher}></ChattingModal>
      ) : (
        ''
      )}
    </main>
  );
};
export default TeacherList;
