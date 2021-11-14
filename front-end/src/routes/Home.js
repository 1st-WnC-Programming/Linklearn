import gate from '../Images/gate.png';
import styled from 'styled-components';

const Gate = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
  filter: brightness(60%);
`;

const Home = () => {
  return (
    <>
      <Gate src={gate} alt='gate' />
    </>
  );
};
export default Home;
