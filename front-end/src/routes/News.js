import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

import '@toast-ui/editor/dist/toastui-editor-viewer.css';

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
const Content = styled.div`
  width: 1000px;
  margin: 30px auto;
  min-height: 500px;
  /* background-color: red; */
`;
const News = () => {
  const { id } = useParams();
  return (
    <div className='inner'>
      <main>
        <TitleBox>
          <h1>제목입니다</h1>
        </TitleBox>
        {/* <Editor
          previewStyle='vertical'
          height='400px'
          initialEditType='markdown'
          useCommandShortcut={true}
          initialValue='마크다운으로 내용을 입력하세요.'
        /> */}
        <Content>{id}</Content>
        <ButtonBox>
          <Link
            to={{
              pathname: '/Board/',
              state: { isInfo: false },
            }}
          >
            <PostButton>취소</PostButton>
          </Link>
          <PostButton>수정</PostButton>
        </ButtonBox>
      </main>
    </div>
  );
};
export default News;
