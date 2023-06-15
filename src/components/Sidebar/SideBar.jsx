import React, { useEffect, useState } from 'react';
import LogoW from '../../assets/Images/LogoW.svg';
import Logoic from '../../assets/Images/Logoic.svg';
import Analitycs from '../../assets/Images/Analitycs.svg';
import Dashboard from '../../assets/Images/Dashboard Icon.svg';
import Search from '../../assets/Images/Search.svg';
import materialsymbols from '../../assets/Images/material-symbols_help-outline.svg';
import setting from '../../assets/Images/setting2.svg';
import logout from '../../assets/Images/logout.svg';
import profile from '../../assets/Images/Frame 19.svg';
import Straight from '../../assets/Images/Straight.svg';
import RevStraight from '../../assets/Images/RevStraight.svg';
import sprout from '../../assets/Images/sprout.svg';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getCookie, removeCookie } from '../../Cookies/Cookies';
import { instance } from '../../core/api/axios/instance';

function SideBar({ children }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const [token, setToken] = useState('');
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  const userInfo = async () => {
    try {
      const response = await instance.get(`/api/members/mypage`);
      // console.log('#######response', response.data.data);

      const { totalStudyTime } = response.data.data;

      setTotalStudyTime(totalStudyTime);

      return response.data.data;
    } catch (error) {
      console.error('????error:', error);
    }
  };

  useEffect(() => {
    const accessToken = getCookie('AccessToken');
    setToken(accessToken);
    userInfo();
  }, []);

  const tokenHandler = () => {
    if (token) {
      removeCookie('AccessToken', { path: '/' });
      removeCookie('RefreshToken', { path: '/' });
      localStorage.removeItem('member');
      setToken('');
      window.location.reload();
    }
  };

  const totalTime = (totalStudyTime) => {
    const hours = Math.floor(totalStudyTime / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((totalStudyTime % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalStudyTime % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const menuItem = [
    {
      navigate: '/main',
      name: '진행중인 스터디',
      icon: <img src={Analitycs} alt="오류" />,
    },
    {
      navigate: '/mypage',
      name: '내 공부 현황',
      icon: <img src={Dashboard} alt="오류" />,
    },
  ];
  const menuItem1 = [
    {
      name: 'Help',
      icon: <img src={materialsymbols} alt="오류" />,
    },
    {
      name: '설정',
      icon: <img src={setting} alt="오류" />,
    },
  ];
  const menuItem2 = [
    {
      onClick: () => (token ? tokenHandler() : navigate('/members/login')),
      name: token ? '로그아웃' : '로그인',
      icon: <img src={logout} alt="오류" />,
    },
  ];

  return (
    <StContainer>
      <StSidebarContainer isOpen={isOpen}>
        <StLogoContainer>
          <StSymbol
            src={isOpen ? LogoW : Logoic}
            alt="오류"
            isOpen={isOpen}
            onClick={() => {
              navigate('/');
            }}
          />
          {/* <StSymbolName isOpen={isOpen}>스터브</StSymbolName> */}
          <StRevStraight src={RevStraight} alt="오류" isOpen={isOpen} onClick={toggle} />
        </StLogoContainer>

        <StNavLinkContainer>
          {menuItem.map((item, index) => (
            <StNavLink to={item.navigate} key={index}>
              <StMenuItems isOpen={isOpen}>
                <StIcon>{item.icon}</StIcon>
                <StName isOpen={isOpen}>{item.name}</StName>
              </StMenuItems>
            </StNavLink>
          ))}
          <StLine isOpen={isOpen} />
          {menuItem1.map((item, index) => (
            <StNavLink to={item.navigate} key={index}>
              <StMenuItems isOpen={isOpen}>
                <StIcon>{item.icon}</StIcon>
                <StName isOpen={isOpen}>{item.name}</StName>
              </StMenuItems>
            </StNavLink>
          ))}
          {menuItem2.map((item, index) => (
            <StNavLink2 key={index} onClick={item.onClick}>
              <StMenuItems isOpen={isOpen}>
                <StIcon>{item.icon}</StIcon>
                <StName isOpen={isOpen}>{item.name}</StName>
              </StMenuItems>
            </StNavLink2>
          ))}
        </StNavLinkContainer>

        <StProfileContainer>
          <StProfileLaout>
            <StProfileFreame isOpen={isOpen}>
              <StProfile src={profile} alt="오류" />
            </StProfileFreame>

            <StPofileTextFreame>
              <StPofileImgText isOpen={isOpen}>
                <StPofileImg src={sprout} />
                <StPofileName>{token ? localStorage.member : '게스트'}</StPofileName>
              </StPofileImgText>

              <StPofileText2 isOpen={isOpen}>
                {token ? `누적시간 ${totalTime(totalStudyTime)}` : '로그인하여 이용하기'}
              </StPofileText2>
            </StPofileTextFreame>
          </StProfileLaout>
        </StProfileContainer>
      </StSidebarContainer>
      <StOutFrame isOpen={isOpen}>
        <StStraight src={Straight} alt="오류" isOpen={isOpen} onClick={toggle} />
      </StOutFrame>
      {/* <StMainContainer>{children}</StMainContainer> */}
    </StContainer>
  );
}

export default SideBar;

const StContainer = styled.div`
  display: flex;
  height: 100vh;
`;
const StSidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100vh;
  background: #00573f;
  filter: drop-shadow(6px 6px 10px #d9e7dd);
  transition: width 0.3s ease;
  ${({ isOpen }) =>
    !isOpen &&
    `
    width: 80px; /* isOpen이 false일 때의 너비 */
  `}
`;
const StLogoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 260px;
  height: 86px;
`;
const StNavLinkContainer = styled.div`
  height: 59px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
const StNavLink = styled(Link)`
  height: 59px;
  display: flex;
  align-items: center;
  text-decoration: none;
  &:hover {
    height: 29.5px;
    margin: 15px 0px 15px 0px;
    border-left: 3px solid #ffffff;
  }
`;
const StNavLink2 = styled.div`
  height: 59px;
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    height: 29.5px;
    margin: 15px 0px 15px 0px;
    border-left: 3px solid #ffffff;
  }
`;
const StMenuItems = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 0px 0px 0px 36px;
  ${({ isOpen }) =>
    !isOpen &&
    `
    margin: 0px 28px 0px 28px; /* isOpen이 false일 때의 너비 */
  `}
`;
const StIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 12px;
`;
const StName = styled.div`
  width: 101px;
  height: 20px;
  font-family: 'Noto Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
  color: #ffffff;
  ${({ isOpen }) =>
    !isOpen &&
    `
    display: none; /* isOpen이 false일 때의 너비 */
  `}
`;
const StLine = styled.div`
  width: 212px;
  margin: 0px 24px 0px 24px;
  border: 1px solid #e8e8e8;
  ${({ isOpen }) =>
    !isOpen &&
    `
    width: 32px; /* isOpen이 false일 때의 너비 */
  `}
`;
const StSymbol = styled.img`
  height: 39.44px;
  width: 106px;
  margin: 0px 0px 0px 36px;
  cursor: pointer;
  ${({ isOpen }) =>
    !isOpen &&
    `
    width: 22px;
    height: 32px;
    margin: 0px 0px 0px 30px; /* isOpen이 false일 때의 너비 */
  `}
`;
const StSymbolName = styled.div`
  width: 50px;
  height: 25px;
  font-family: 'Noto Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  color: #ffffff;
  ${({ isOpen }) =>
    !isOpen &&
    `
    display: none; /* isOpen이 false일 때의 너비 */
  `}
`;
const StRevStraight = styled.img`
  width: 24px;
  height: 24px;
  margin: 0px 36px 0px 74px;
  cursor: pointer;
  transition: display 0.36s ease;
  ${({ isOpen }) =>
    !isOpen &&
    `
    display: none; /* isOpen이 false일 때의 너비 */
  `}
`;
const StStraight = styled.img`
  width: 24px;
  height: 24px;
  margin: 32px 0px 0px 0px;
  cursor: pointer;
  transition: display 0.36s ease;
  ${({ isOpen }) =>
    isOpen &&
    `
    display: none; /* isOpen이 false일 때의 너비 */
  `}
`;
const StProfileContainer = styled.div`
  box-sizing: border-box;
  height: 128px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #e8e8e8;
`;
const StProfileLaout = styled.div`
  width: 197px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StProfileFreame = styled.div`
  width: 48px;
  height: 48px;
  transition: margin 0.36s ease;
  ${({ isOpen }) =>
    !isOpen &&
    `
    margin: 0px 0px 0px 72.67px; /* isOpen이 false일 때의 너비 */
  `}
`;
const StProfile = styled.img`
  width: 48px;
  height: 48px;
`;
const StPofileTextFreame = styled.div`
  width: 124px;
  height: 51px;
  display: flex;
  flex-direction: column;
  margin: 0px 0px 0px 12.67px;
`;
const StPofileImgText = styled.div`
  width: 124px;
  height: 24px;
  display: flex;
  align-items: center;
  ${({ isOpen }) =>
    !isOpen &&
    `
    display: none; /* isOpen이 false일 때의 너비 */
  `}
`;
const StPofileImg = styled.img`
  width: 16px;
  height: 16px;
  margin: 0px 7px 0px 0px;
`;
const StPofileName = styled.div`
  width: 70px;
  height: 16px;
  display: flex;
  align-items: center;
  color: #ffffff;
`;
const StPofileText2 = styled.div`
  width: 129px;
  height: 28px;
  font-family: 'Noto Sans';
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  color: #e8e8e8e8;
  display: flex;
  align-items: flex-end;
  ${({ isOpen }) =>
    !isOpen &&
    `
    display: none; /* isOpen이 false일 때의 너비 */
  `}
`;
const StMainContainer = styled.div`
  width: 100%;
  height: 100vh;
  flex: 1;
  background-color: #9aaeff;
`;
const StOutFrame = styled.div`
  width: ${({ isOpen }) => (!isOpen ? '20px' : '0px')};
  background: ${({ isOpen }) => (!isOpen ? '#00573f' : 'transparent')};
  opacity: ${({ isOpen }) => (!isOpen ? 0.8 : 0)};
  box-shadow: ${({ isOpen }) => (!isOpen ? '6px 6px 10px #d9e7dd' : 'none')};
`;
