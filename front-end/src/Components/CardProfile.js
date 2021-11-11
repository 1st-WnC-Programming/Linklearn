import React from 'react';

const CardProfile = ({ data, target, keyword }) => {
  let count = 0;
  const cardList = data
    .filter((item) => {
      if (keyword == null || keyword == '') return item;
      else {
        if (target === 'name' && item.name.includes(keyword)) {
          return item;
        } else if (target == 'field' && item.field.includes(keyword)) {
          return item;
        } else if (target == 'career' && item.career.includes(keyword)) {
          return item;
        }
      }
    })
    .map((value) => (
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
