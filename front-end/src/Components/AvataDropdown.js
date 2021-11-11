import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { authService } from '../fbase';

const DropdownContainer = styled.div`
  /* width: 400px; */
  position: relative;

  &:hover {
    cursor: pointer;
  }
`;

const Avata = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const DropdownMenu = styled.ul`
  display: ${(props) => (props.isActive ? `block` : `none`)};
  width: 150px;
  background-color: white;
  position: absolute;
  right: 0px;
  border: 1px solid #f4acbb;
  border-radius: 3%;
`;

const DropdownItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 14px;
  border-bottom: 2px solid #d2d2d2;
  border-top: none;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.p`
  padding-left: 10px;
  font-weight: 400;
`;

const AvataDropdown = ({ avataURL }) => {
  const navigate = useNavigate();
  const dropdownItems = [{ name: '프로필', path: '/Profile', pathName: 'profile' }];
  const [isActive, setIsActive] = useState(false);
  const [item, setItem] = useState(null);

  const onActiveToggle = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const onSelectItem = useCallback((e) => {
    const targetId = e.target.id;

    if (targetId === 'item_name') {
      setItem(e.target.parentElement.innertText);
    } else if (targetId === 'item') {
      setItem(e.target.innertText);
    }

    setIsActive((prev) => !prev);
  }, []);

  const onLogoutClick = () => {
    authService.signOut();
    navigate('/');
  };

  return (
    <DropdownContainer>
      <Avata onClick={onActiveToggle} src={avataURL} />

      <DropdownMenu isActive={isActive}>
        {dropdownItems.map((item) => (
          <DropdownItemContainer id='item' key={item.id} onClick={onSelectItem}>
            <Link to={item.path}>
              <ItemName id='item_name'>{item.name}</ItemName>
            </Link>
          </DropdownItemContainer>
        ))}
        <DropdownItemContainer id='item' onClick={onLogoutClick}>
          <ItemName id='item_name' style={{ color: 'red' }}>
            로그아웃
          </ItemName>
        </DropdownItemContainer>
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default AvataDropdown;
