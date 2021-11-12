import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

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
  /* background-color: red; */
`;

const News = ({ info, setInfo, dataFile, setDataFile }) => {
  const { id } = useParams();
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState('제목입니다');
  const [myContent, setMyContent] = useState('내용입니다.');
  const viewMode = () => {
    return (
      <>
        <TitleBox>
          <h1>{title}</h1>
        </TitleBox>
        <Content>{myContent}</Content>
        <ButtonBox>
          <Link
            to={{
              pathname: '/Board/',
            }}
          >
            <PostButton>취소</PostButton>
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
          <Title value={title}></Title>
        </TitleBox>
        <Editor
          previewStyle='vertical'
          height='400px'
          initialEditType='markdown'
          useCommandShortcut={true}
          initialValue={myContent}
        />
        <ButtonBox>
          <PostButton onClick={() => setEdit(false)}>취소</PostButton>
          <PostButton>삭제</PostButton>
          <PostButton>수정</PostButton>
        </ButtonBox>
      </>
    );
  };
  return (
    <div className='inner'>
      <main>{edit === false ? viewMode() : editMode()}</main>
    </div>
  );
};
export default News;
