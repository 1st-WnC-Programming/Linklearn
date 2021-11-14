import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';
import styled from 'styled-components';
import { Link, useParams, useNavigate } from 'react-router-dom';

import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import { useEffect, useState, useRef } from 'react';
import { authService, db } from '../fbase';
import { doc, setDoc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
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
const Content = styled.section`
  width: 100%;
  margin: 30px auto;
  min-height: 600px;

  padding: 20px;
  font-size: 1rem;
  line-height: 2.5rem;
`;
const SortBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px auto;
  align-items: center;
  width: 100%;
`;
const InputBox = styled.input`
  background-color: white;
  border-radius: 10px;
  border: 1px solid grey;
  font-size: 18px;
  padding: 10px;
  width: 25%;
  height: 45px;
  display: flex;
  text-align: center;
`;
const TextBox = styled.label`
  margin-right: 10px;
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
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [time, setTime] = useState('0');
  const [isInfo, setIsInfo] = useState(false);
  const [curData, setCurData] = useState({});
  const [studentId, setStudentId] = useState([]);
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
      setStudentId(data.studentId);
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
          <TextBox>과외 기간: </TextBox>
          <InputBox type='date' readonly value={time} />
        </SortBox>

        <Content>
          <ReactMarkdown>{curData.content}</ReactMarkdown>
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
              if (userData.id == curData.uid || userData.role === 'admin') {
                setEdit(true);
              } else {
                alert('관리자 혹은 작성자만 수정할 수 있습니다.');
              }
            }}
          >
            수정
          </PostButton>
          {isInfo ? '' : <PostButton onClick={tapSubmitBtn}>신청하기</PostButton>}
        </ButtonBox>
      </>
    );
  };
  const editMode = () => {
    return (
      <>
        <SortBox>
          <SortTitle onChange={selectHandler} value={type}>
            {Object.entries(selectList).map((item) => (
              <option value={item[0]} key={item[0]}>
                {item[1]}
              </option>
            ))}
          </SortTitle>
          <TextBox>모집 인원 </TextBox>
          <InputBox
            type='number'
            min='1'
            onChange={(e) => {
              e.preventDefault();
              setNumberOfPeople(e.target.value);
            }}
            value={numberOfPeople}
          />
          <TextBox>과외 기간 </TextBox>
          <InputBox
            type='date'
            onChange={(e) => {
              e.preventDefault();
              setTime(e.target.value);
            }}
            value={time}
          />
        </SortBox>
        <TitleBox>
          <Title
            type='text'
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </TitleBox>

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
    console.log(type);
    console.log(numberOfPeople);
    if (title === '') {
      alert('제목을 입력하세요.');
    } else if (getContent_md === '') {
      alert('내용을 입력하세요.');
    } else if (time === '0') {
      alert('과외 기간을 입력하세요.');
    } else if ((type === 'personal' || type === '개인') && numberOfPeople > 1) {
      alert('개인 과외는 한명만 가능합니다.');
    } else {
      let type2 = type === 'personal' ? '개인' : type;
      let curData = {
        title: title,
        type: type2,
        numberOfPeople: Number(numberOfPeople),
        time: time,
        teacher: user.displayName,
        date: new Date().toISOString().slice(0, 10),
        content: getContent_md,
        id: id,
        uid: user.uid,
        studentId: [],
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
  const tapSubmitBtn = async () => {
    if (user == null) {
      alert('로그인 후 이용할 수 있습니다.');
    } else {
      if (studentId.indexOf(user.uid) !== -1) {
        alert('이미 신청 하였습니다.');
      } else if (studentId.length >= numberOfPeople && numberOfPeople != 0) {
        alert('이미 모집이 완료 되었습니다.');
      } else {
        setStudentId([...studentId, user.uid]);
        if (isInfo) {
          await updateDoc(doc(db, 'info', `${id}`), {
            studentId: [...studentId, user.uid],
          });
        } else {
          await updateDoc(doc(db, 'dataFile', `${id}`), { studentId: [...studentId, user.uid] });
        }
        await updateDoc(doc(db, 'users', user.uid), { myLecture: [...userData.myLecture, Number(id)] });
        alert('신청 되었습니다.');
        if (studentId.length === numberOfPeople) {
          //신청 완료 알림
        }
      }
    }
  };
  return (
    <div className='inner'>
      <main>{edit === false ? viewMode() : editMode()}</main>
    </div>
  );
};
export default News;
