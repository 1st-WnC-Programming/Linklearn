import styled from 'styled-components';

const ModalContainer = styled.div`
  flex-direction: column;
  width: 500px;
  height: 800px;
  background-color: white;
  padding: 40px;
  display: flex;
  align-items: center;

  z-index: 100;
  border-radius: 30px;
  position: absolute;
  box-shadow: 1px 1px 15px -2px grey;
`;

const Avata = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 15px;
`;

const Name = styled.input`
  font-size: 15px;
  padding: 10px;
  margin: 15px;
  width: 100%;
`;

const Info = styled.input`
  font-size: 15px;
  padding: 10px;
  margin: 15px;
  width: 100%;
`;

const Button = styled.button`
  background-color: ${({ color }) => color};
  font-size: 15px;
  padding: 12px 50px;
  color: white;
  justify-content: center;
  font-size: 18px;
  margin: 8px 0;
  width: 300px;
  border: none;
`;

const InfoModal = ({ avata, name, field, career, onModalClick }) => {
  return (
    <ModalContainer>
      <Avata src={avata} />
      이름
      <Name type='text' value={name} />
      분야
      <Info type='text' value={field} />
      경력(200자 이하)
      <Info type='text' value={career} style={{ height: 200 }} />
      <Button color='#dc3545' onClick={onModalClick}>
        취소
      </Button>
      <Button color='#3c78c8'>확인</Button>
    </ModalContainer>
  );
};

export default InfoModal;
