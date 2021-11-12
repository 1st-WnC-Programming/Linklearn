import { React, useState, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import ReactMarkdown from 'react-markdown';
const test = `# markdown`;

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
const PostList = ({ info, setInfo, dataFile, setDataFile }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('personal');
  const [number, setNumber] = useState('0');
  const [time, setTime] = useState('0');
  const [isInfo, setIsInfo] = useState(false);
  const selectHandler = (e) => {
    e.preventDefault();
    setType(e.target.value);
  };
  const editorRef = useRef();

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
        numberOfPeople: number,
        time: time,
        teacher: '전병민',
        date: '2021-07-23',
        content: getContent_md,
        id: info.length,
      };

      if (isInfo) {
        setInfo([...info, curData]);
      } else {
        setDataFile([...dataFile, curData]);
      }
      alert('게시되었습니다.');
    }
  };
  return (
    <div className='inner'>
      <main>
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
        <SortBox>
          <TextBox>공지</TextBox>
          <CheckBox
            type='checkbox'
            onClick={() => {
              setIsInfo(!isInfo);
            }}
          />
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
              setNumber(e.target.value);
            }}
            value={number}
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
