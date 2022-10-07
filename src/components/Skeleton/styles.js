import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 24px;

  width: 100%;
  height: 100%;
`;

const sizes = {
  sm: "20px",
  md: "40px",
  lg: "50px",
};

export const Loader = styled.div`
  width: 100%;
  height: ${(props) => sizes[props.size || "md"]};
  display: block;
  margin: auto;
  position: relative;
  background: transparent;
  box-sizing: border-box;

  ::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 10px;
    left: 0;
    background-image: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.5) 80%,
        transparent 100%
      ),
      linear-gradient(#ddd 50px, transparent 0);

    background-repeat: no-repeat;
    background-size: 75px 175px, 100% 100px, 100% 16px, 100% 30px;
    background-position: -185px 0, center 0, center 115px, center 142px;
    box-sizing: border-box;
    animation: animloader 1.5s linear infinite;
  }

  @keyframes animloader {
    to {
      background-position: 100% 0, center 0, center 115px, center 142px;
    }
  }
`;
