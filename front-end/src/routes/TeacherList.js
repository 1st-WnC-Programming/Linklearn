import React, { useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../fbase';
import styled from 'styled-components';
import CardProfile from '../Components/CardProfile';

const TeacherList = () => {
  // const [teacherList, setTeacherList] = useState('');

  // const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
  // const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //   const teachers = [];
  //   querySnapshot.forEach((doc) => {
  //     teachers.push(doc.data().name);
  //   });
  //   console.log('teacher 목록 : ', teachers.join(', '));
  // });

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
      <CardProfile data={teacherList} />
    </>
  );
};
export default TeacherList;
