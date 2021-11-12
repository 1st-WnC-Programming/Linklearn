import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import ReactMarkdown from 'react-markdown';
import { useEffect, useState, useRef } from 'react';

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
const Content = styled.div`
  width: 1000px;
  margin: 30px auto;
  min-height: 500px;
  border: 1px solid black;
  padding: 20px;
  /* background-color: red; */
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
const CheckBox = styled.input`
  margin-right: 50px;
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
const News = ({ info, setInfo, dataFile, setDataFile }) => {
  const { id } = useParams();
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('personal');
  const [numberOfPeople, setNumberOfPeople] = useState('0');
  const [time, setTime] = useState('0');
  const [isInfo, setIsInfo] = useState(false);
  const [curData, setCurData] = useState({});

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
        // console.log(item);
        if (item.id == id) {
          return true;
        }
      });
    }
    setTitle(data.title);
    setType(data.type);
    setNumberOfPeople(data.numberOfPeople);
    setTime(data.time);
    setCurData(data);
  }, []);
  const viewMode = () => {
    return (
      <>
        <TitleBox>
          <Titlespan>{isInfo ? '[공지]' : ''}</Titlespan>
          <Titlespan>{title}</Titlespan>
        </TitleBox>
        <SortBox>
          <SortTitle onChange={selectHandler} value={type} disabled>
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
          <ReactMarkdown children={curData.content} />
        </Content>

        <ButtonBox>
          <Link
            to={{
              pathname: '/Board/',
            }}
          >
            <PostButton>뒤로가기</PostButton>
          </Link>
          <PostButton onClick={() => setEdit(true)}>수정</PostButton>
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
          <PostButton onClick={() => setEdit(false)}>취소</PostButton>
          <Link
            to={{
              pathname: '/Board/',
            }}
          >
            <PostButton
              onClick={() => {
                if (isInfo) {
                  setInfo(deleteData(info));
                } else {
                  setDataFile(deleteData(dataFile));
                }
              }}
            >
              삭제
            </PostButton>
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
  const postData = (getContent_md) => {
    if (title === '') {
      alert('제목을 입력하세요.');
    } else if (getContent_md === '') {
      alert('내용을 입력하세요.');
    } else {
      let type2 = type === 'personal' ? '개인' : '그룹';
      let curData = {
        number: 999,
        title: title,
        type: type2,
        numberOfPeople: numberOfPeople,
        time: time,
        teacher: '전병민',
        date: new Date().toISOString().slice(0, 10),
        content: getContent_md,
        id: id,
      };
      setCurData(curData);
      if (isInfo) {
        setInfo(changeData(info, curData));
      } else {
        setDataFile(changeData(dataFile, curData));
      }
      setEdit(false);
      alert('수정되었습니다.');
    }
  };
  const changeData = (datas, curData) => {
    const nextData = datas.map((data) => {
      if (data.id == id) {
        data.content = curData.content;
        data.numberOfPeople = curData.numberOfPeople;
        data.type = curData.type;
        data.title = curData.title;
        data.time = curData.time;
        return data;
      }
      return data;
    });
    return nextData;
  };
  const deleteData = (datas) => {
    const nextData = datas.filter((data) => data.id != id);

    console.log(nextData);
    alert('삭제되었습니다.');
    return nextData;
  };
  return (
    <div className='inner'>
      <main>{edit === false ? viewMode() : editMode()}</main>
    </div>
  );
};
export default News;
