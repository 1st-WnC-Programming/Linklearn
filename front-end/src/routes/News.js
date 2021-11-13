import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';
import styled from 'styled-components';
import { Link, useParams, useNavigate } from 'react-router-dom';

import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import { useEffect, useState, useRef } from 'react';
import { authService, db } from '../fbase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
const TitleBox = styled.div`
  width: 1000px;
  margin: 30px auto;
`;
const Title = styled.input`
  width: 100%;
  font-size: 30px;
  padding-left: 10px;
`;
const ButtonBox = styled.div`
  margin: 20px auto;
  width: 100%;
`;

const PostButton = styled.button`
  background-color: #3c78c0;
  border-radius: 10px;
  margin: 10px;
  width: 200px;
  height: 50px;
  font-size: 18px;
  float: right;
`;
const Content = styled.section`
  width: 1000px;
  margin: 30px auto;
  min-height: 500px;
  border: 1px solid black;
  padding: 20px;
  font-size: 1rem;
  line-height: 2.5rem;
`;
const SortBox = styled.div`
  height: 30px;
  margin: 30px auto;
  align-items: center;
  width: 1000px;
`;
const InputBox = styled.input`
  height: 100%;
  font-size: 13px;
  margin-right: 30px;
`;
const TextBox = styled.label`
  margin-right: 10px;
`;
const SortTitle = styled.select`
  background-color: #f9f9f9;
  width: 100px;
  height: 100%;
  line-height: 30px;
  margin-right: 30px;
`;
const selectList = {
  personal: '개인',
  group: '그룹',
};
const Titlespan = styled.span`
  font-size: 35px;
  font-weight: 500px;
  margin-right: 20px;
`;
const News = ({ info, dataFile, setReload }) => {
  const { id } = useParams();
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('personal');
  const [numberOfPeople, setNumberOfPeople] = useState('0');
  const [time, setTime] = useState('0');
  const [isInfo, setIsInfo] = useState(false);
  const [curData, setCurData] = useState({});

  const navigate = useNavigate();
  const user = authService.currentUser;
  let [userData, setUserData] = useState({ role: '' });
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
  const editorRef = useRef();
  const selectHandler = (e) => {
    e.preventDefault();
    setType(e.target.value);
  };
  useEffect(() => {
    // 공지글일때
    let data;
    if (id > 1000) {
      data = info.find((item) => {
        if (item.id == id) {
          return true;
        }
      });
      setIsInfo(true);
    } else {
      data = dataFile.find((item) => {
        if (item.id == id) {
          return true;
        }
      });
    }
    if (data === undefined) {
      navigate('/Board');
    } else {
      setTitle(data.title);
      setType(data.type);
      setNumberOfPeople(data.numberOfPeople);
      setTime(data.time);
      setCurData(data);
    }
  }, []);
  const viewMode = () => {
    return (
      <>
        <TitleBox>
          <Titlespan>{isInfo ? '[공지]' : ''}</Titlespan>
          <Titlespan>{title}</Titlespan>
        </TitleBox>
        <SortBox>
          <SortTitle value={type} disabled>
            {Object.entries(selectList).map((item) => (
              <option value={item[0]} key={item[0]}>
                {item[1]}
              </option>
            ))}
          </SortTitle>
          <TextBox>모집 인원: </TextBox>
          <InputBox type='number' value={numberOfPeople} readonly />
          <TextBox>과외 시간: </TextBox>
          <InputBox type='number' readonly value={time} />
        </SortBox>

        <Content>
          <ReactMarkdown>{curData.content}</ReactMarkdown>
          {/* <Viewer initialValue={curData.content} /> */}
        </Content>

        <ButtonBox>
          <Link
            to={{
              pathname: '/Board/',
            }}
          >
            <PostButton>뒤로가기</PostButton>
          </Link>
          <PostButton
            onClick={() => {
              if (userData.id == curData.uid || userData.role !== 'admin') {
                setEdit(true);
              } else {
                alert('관리자 혹은 작성자만 수정할 수 있습니다.');
              }
            }}
          >
            수정
          </PostButton>
        </ButtonBox>
      </>
    );
  };
  const editMode = () => {
    return (
      <>
        <TitleBox>
          <Title
            type='text'
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </TitleBox>
        <SortBox>
          <SortTitle onChange={selectHandler} value={type}>
            {Object.entries(selectList).map((item) => (
              <option value={item[0]} key={item[0]}>
                {item[1]}
              </option>
            ))}
          </SortTitle>
          <TextBox>모집 인원: </TextBox>
          <InputBox
            type='number'
            min='0'
            onChange={(e) => {
              e.preventDefault();
              setNumberOfPeople(e.target.value);
            }}
            value={numberOfPeople}
          />
          <TextBox>과외 시간: </TextBox>
          <InputBox
            type='number'
            min='0'
            onChange={(e) => {
              e.preventDefault();
              setTime(e.target.value);
            }}
            value={time}
          />
        </SortBox>
        <Editor
          previewStyle='vertical'
          height='400px'
          initialEditType='markdown'
          useCommandShortcut={true}
          initialValue={curData.content}
          ref={editorRef}
        />
        <ButtonBox>
          <PostButton
            onClick={() => {
              setEdit(false);
            }}
          >
            취소
          </PostButton>
          <Link
            to={{
              pathname: '/Board/',
            }}
          >
            <PostButton onClick={deleteData}>삭제</PostButton>
          </Link>
          <PostButton onClick={btnClick}>수정</PostButton>
        </ButtonBox>
      </>
    );
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
    } else {
      let type2 = type === 'personal' ? '개인' : '그룹';
      let curData = {
        title: title,
        type: type2,
        numberOfPeople: numberOfPeople,
        time: time,
        teacher: user.displayName,
        date: new Date().toISOString().slice(0, 10),
        content: getContent_md,
        id: id,
      };
      setCurData(curData);
      if (isInfo) {
        await setDoc(doc(db, 'info', `${id}`), curData);
      } else {
        await setDoc(doc(db, 'dataFile', `${id}`), curData);
      }
      setEdit(false);
      setReload(1);
      alert('수정되었습니다.');
    }
  };
  const deleteData = async () => {
    if (isInfo) {
      await deleteDoc(doc(db, 'info', `${id}`));
    } else {
      await deleteDoc(doc(db, 'dataFile', `${id}`));
    }
    setReload(1);
    alert('삭제되었습니다.');
  };
  return (
    <div className='inner'>
      <main>{edit === false ? viewMode() : editMode()}</main>
    </div>
  );
};
export default News;
