import React from 'react';

const CardProfile = ({ data, target, keyword }) => {
  let count = 0;
  const cardList = data
    .filter((item) => {
      if (keyword == null || keyword == '' || target === 'none') return item;
      else {
        if (target === 'name' && item.name.toLowerCase().includes(keyword.toLowerCase())) {
          return item;
        } else if (target == 'field' && item.field.toLowerCase().includes(keyword.toLowerCase())) {
          return item;
        } else if (target == 'career' && item.career.toLowerCase().includes(keyword.toLowerCase())) {
          return item;
        }
      }
    })
    .map((value) => (
      <div className='cardItem innerContainer' key={count++ + value.name + value.point}>
        <div className='innerItem'>{value.image}</div>
        <div className='innerItem'>
          <div>{value.name} 선생님</div>
          <div>분야 : {value.field}</div>
          <div>별점 : {value.starPoint}</div>
          <div>경력 : {value.career}</div>
        </div>
      </div>
    ));
  return <div className='cardContainer'>{cardList}</div>;
};

export default CardProfile;
