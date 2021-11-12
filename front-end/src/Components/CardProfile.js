import React, { useEffect, useState } from 'react';

const CardProfile = ({ data, target, keyword }) => {
  const [card, setCard] = useState('');
  // console.log(data);s
  let count = 0;
  const newData = data.filter((item) => {
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
  });

  useEffect(() => {
    setCard(
      newData.map((value) => (
        <div className='cardItem innerContainer' key={count++ + value.name + value.starPoint}>
          <div className='innerItem'>{value.image}</div>
          <div className='innerItem'>
            <div>{value.name} 선생님</div>
            <div>분야 : {value.field}</div>
            <div>별점 : {value.starPoint}</div>
            <div>경력 : {value.career}</div>
          </div>
        </div>
      )),
    );
  }, [newData]);
  // const cardList = data
  //   .filter((item) => {
  //     if (keyword == null || keyword == '' || target === 'none') return item;
  //     else {
  //       if (target === 'name' && item.name.toLowerCase().includes(keyword.toLowerCase())) {
  //         return item;
  //       } else if (target == 'field' && item.field.toLowerCase().includes(keyword.toLowerCase())) {
  //         return item;
  //       } else if (target == 'career' && item.career.toLowerCase().includes(keyword.toLowerCase())) {
  //         return item;
  //       }
  //     }
  //   })
  //   .map((value) => (
  //     <div className='cardItem innerContainer' key={count++ + value.name + value.starPoint}>
  //       <div className='innerItem'>{value.image}</div>
  //       <div className='innerItem'>
  //         <div>{value.name} 선생님</div>
  //         <div>분야 : {value.field}</div>
  //         <div>별점 : {value.starPoint}</div>
  //         <div>경력 : {value.career}</div>
  //       </div>
  //     </div>
  //   ));
  return <div className='cardContainer'>{card}</div>;
};

export default CardProfile;
