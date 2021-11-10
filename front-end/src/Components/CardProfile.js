import React, { Children } from 'react';

const CardProfile = ({ data }) => {
  let count = 0;
  const cardList = data.map((value) => (
    <div className='cardItem innerContainer' key={count++ + value.point}>
      <div className='innerItem'>{value.image}</div>
      <div className='innerItem'>
        <div>{value.name} 선생님</div>
        <div>분야 : {value.field}</div>
        <div>별점 : {value.point}</div>
        <div>경력 : {value.career}</div>
      </div>
    </div>
  ));
  return <div className='cardContainer'>{cardList}</div>;
};

export default CardProfile;
