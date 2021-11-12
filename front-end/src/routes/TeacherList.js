import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../fbase';
import styled from 'styled-components';
import CardProfile from '../Components/CardProfile';
import { async } from '@firebase/util';

const SearchBox = styled.div`
  /* margin: auto; */
  margin-top: 10px;
  height: 55px;
  padding: 10px;
  display: flex;
  justify-content: center;
`;

const SearchSelect = styled.select`
  background-color: #f9f9f9;
  width: 150px;
  height: 100%;
  line-height: 30px;
  margin-right: 10px;
  text-align: center;
`;

const SearchInput = styled.input`
  text-align: center;
  background-color: #f9f9f9;
  width: 400px;
  height: 100%;
  margin-right: 10px;
  border: 1px solid black;
`;

const TeacherList = () => {
  const [keyword, setKeyword] = useState('');
  const selectList = { none: '<검색 필터>', name: '이름', field: '분야', career: '경력' };
  const [searchSelected, setSearchSelected] = useState('none');
  const sortList = {
    none: '<정렬 조건>',
    starPoint_Desc: '별점 높은 순',
    starPoint_Asc: '별점 낮은 순',
    student_Desc: '학생들이 많이 수강한 순',
    student_Asc: '학생들이 적게 수강한 순',
  };
  const [sortSelected, setSortSelected] = useState('none');

  // db에 정확한 filed 성립되면 쓸 코드
  const [teacherList, setTeacherList] = useState([
    // {
    //   image: 'das',
    //   name: '김밍밍',
    //   field: '수학',
    //   starPoint: 4.5,
    //   career: '수상',
    // },
    // {
    //   image: 'das',
    //   name: '류건열',
    //   field: '수학',
    //   starPoint: 4.7,
    //   career: '수상',
    // },
    // {
    //   image: 'das',
    //   name: '김핑핑',
    //   field: '영어',
    //   starPoint: 4.3,
    //   career: '수상',
    // },
  ]);

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
    if (sortSelected == 'none') return;
    console.log(sortSelected);
    const sort_condition = sortSelected.split('_');
    sort_condition[1] == 'Asc'
      ? sortAsc(teacherList, sort_condition[0])
      : sortDesc(teacherList, sort_condition[0]);
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

  // const q = query(collection(db, 'users'), where('role', '==', 'tutor'));
  // const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //   const teacher = [];
  //   querySnapshot.forEach((doc) => {
  //     teacher.push(doc);
  //   });
  //   console.log(teacher);
  //   // setTeacherList(teacher);
  // });
  // const searchHandler = (e) => {
  //   e.preventDefault();
  // };

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
          {/* <Button onClick={searchHandler}>검색</Button> */}
        </SearchBox>
        {console.log(teacherList)}
        <CardProfile data={teacherList} target={searchSelected} keyword={keyword} />
      </div>
    </main>
  );
};
export default TeacherList;
