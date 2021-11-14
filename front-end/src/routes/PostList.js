import { React, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import { authService, db } from '../fbase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const TitleBox = styled.div`
  width: 100%;
  margin: 30px auto;
`;

const Title = styled.input`
  width: 100%;
  font-size: 20px;
  padding-left: 10px;
  border: 1px solid grey;
  border-radius: 10px;
  padding: 15px 25px;
`;

const ButtonBox = styled.div`
  margin: 40px auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostButton = styled.button`
  padding: 2px 50px;
  height: 50px;
  color: black;

  font-size: 18px;
  border: 2px solid black;
  border-radius: 10px;

  margin-left: 20px;

  &:hover {
    background-color: black;
    color: white;
    transition: all ease-out 0.3s 0s;
  }
`;
const SortTitle = styled.select`
  background-color: white;
  border-radius: 10px;
  border: 1px solid grey;
  font-size: 18px;

  padding: 10px;
  width: 20%;
  height: 45px;
`;

const selectList = {
  personal: '개인',
  group: '그룹',
};

const SortBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px auto;
  align-items: center;
  width: 60%;
`;

const InputBox = styled.input`
  background-color: white;
  border-radius: 10px;
  border: 1px solid grey;
  font-size: 18px;
  padding: 10px;
  width: 35%;
  height: 45px;
  display: flex;
  text-align: center;
`;
const TextBox = styled.label`
  margin-right: 10px;
`;
const CheckBox = styled.input`
  margin-right: 50px;
`;
const PostList = ({ info, dataFile, setReload }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('personal');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [time, setTime] = useState('0');
  const [isInfo, setIsInfo] = useState(false);
  const selectHandler = (e) => {
    e.preventDefault();
    setType(e.target.value);
  };
  const editorRef = useRef();
  const navigate = useNavigate();

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

  const viewInfoBox = () => {
    if (userData.role === 'admin') {
      return (
        <>
          <TextBox>공지</TextBox>
          <CheckBox
            type='checkbox'
            onClick={() => {
              setIsInfo(!isInfo);
            }}
          />
        </>
      );
    }
  };
  const btnClick = () => {
    const editorInstance = editorRef.current.getInstance();
    const getContent_md = editorInstance.getMarkdown();
    postData(getContent_md);
  };

  const postData = async (getContent_md) => {
    if (title === '') {
      alert('제목을 입력하세요.');
    } else if (getContent_md === '') {
      alert('내용을 입력하세요.');
    } else if (time === '0') {
      alert('과외 기간을 입력하세요.');
    } else if (type === 'personal' && numberOfPeople != 1) {
      alert('개인 과외는 한명만 가능합니다.');
    } else {
      let type2 = type === 'personal' ? '개인' : '그룹';
      let id2;
      if (isInfo) {
        id2 = info.length === 0 ? 1001 : info[dataFile.info - 1].id + 1;
      } else {
        id2 = dataFile.length === 0 ? 1 : dataFile[dataFile.length - 1].id + 1;
      }
      let curData = {
        title: title,
        type: type2,
        numberOfPeople: Number(numberOfPeople),
        time: time,
        teacher: user.displayName,
        date: new Date().toISOString().slice(0, 10),
        content: getContent_md,
        id: id2,
        uid: user.uid,
        studentId: [],
      };
      if (isInfo) {
        // setInfo([...info, curData]);
        await setDoc(doc(db, 'info', `${id2}`), curData);
      } else {
        // setDataFile([...dataFile, curData]);
        await setDoc(doc(db, 'dataFile', `${id2}`), curData);
      }
      if (!isInfo) {
        await updateDoc(doc(db, 'users', user.uid), {
          myLecture: [...userData.myLecture, id2],
        });
      }
      alert('게시되었습니다.');
      navigate('/Board');
      setReload(id2);
    }
  };
  return (
    <div className='inner'>
      <main>
        <SortBox>
          {viewInfoBox()}
          <SortTitle onChange={selectHandler} value={type}>
            {Object.entries(selectList).map((item) => (
              <option value={item[0]} key={item[0]}>
                {item[1]}
              </option>
            ))}
          </SortTitle>
          <InputBox
            type='number'
            min='1'
            placeholder='모집인원'
            onChange={(e) => {
              e.preventDefault();
              setNumberOfPeople(e.target.value);
            }}
          />

          <InputBox
            type='date'
            min='0'
            placeholder='과외 기간'
            onChange={(e) => {
              e.preventDefault();
              setTime(e.target.value);
            }}
          />
        </SortBox>
        <TitleBox>
          <Title
            placeholder='제목을 입력하세요'
            onChange={(e) => {
              e.preventDefault();
              setTitle(e.target.value);
            }}
            value={title}
          ></Title>
        </TitleBox>

        <Editor
          previewStyle='vertical'
          height='700px'
          initialEditType='markdown'
          useCommandShortcut={true}
          initialValue='마크다운으로 내용을 입력하세요.'
          ref={editorRef}
        />

        <ButtonBox>
          <Link
            to={{
              pathname: '/Board/',
            }}
          >
            <PostButton>취소</PostButton>
          </Link>
          <PostButton onClick={btnClick}>글쓰기</PostButton>
        </ButtonBox>
      </main>
    </div>
  );
};
export default PostList;
