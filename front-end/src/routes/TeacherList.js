import React, { useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../fbase';
import styled from 'styled-components';
import CardProfile from '../Components/CardProfile';
import { async } from '@firebase/util';

const Button = styled.button`
  border: 1px solid black;
  background-color: white;
`;

const TeacherList = () => {
  // const [teacherList, setTeacherList] = useState('');
  const [keyword, setKeyword] = useState(null);
  const selectList = { name: '이름', field: '분야', career: '경력' };
  const [selected, setSelected] = useState('name');

  // const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
  // const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //   const teachers = [];
  //   querySnapshot.forEach((doc) => {
  //     teachers.push(doc.data().name);
  //   });
  //   console.log('teacher 목록 : ', teachers.join(', '));
  // });

  const searchSpace = async (e) => {
    let search = await e.target.value;
    setKeyword(search);
  };

  const selectHandler = (e) => {
    e.preventDefault();
    setSelected(e.target.value);
  };

  // const searchHandler = (e) => {
  //   e.preventDefault();
  // };

  var teacherList = [
    {
      image: 'das',
      name: '류건열',
      field: '수학',
      point: 4.7,
      career: '수상',
    },
    {
      image: 'das',
      name: '김밍밍',
      field: '수학',
      point: 4.7,
      career: '수상',
    },
  ];

  return (
    <>
      <div>
        <select onChange={selectHandler} value={selected}>
          {Object.entries(selectList).map((item) => (
            <option value={item[0]} key={item[0]}>
              {item[1]}
            </option>
          ))}
        </select>
        <input type='text' placeholder='검색어를 입력하세요.' onChange={(e) => searchSpace(e)} />
        {/* <Button onClick={searchHandler}>검색</Button> */}
      </div>
      <CardProfile data={teacherList} target={selected} keyword={keyword} />
    </>
  );
};
export default TeacherList;
