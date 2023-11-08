import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100vh;

  background: rgba(0, 0, 0, 0.45);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const sizes = {
  sm: {
    with: "500px",
    height: "250px",
    fontSize: "20px",
  },
  md: {
    with: "900px",
    height: "400px",
    fontSize: "24px",
  },
  lg: {
    with: "1088px",
    height: "479px",
    fontSize: "36px",
  },
};

export const Content = styled.div`
  position: relative;
  width: ${(props) => sizes[props.size].with};
  height: ${(props) => sizes[props.size].height};

  padding: 0px 15px;

  background: #fff;
  border-radius: 20px;

  display: flex;
  align-items: center;
  flex-direction: column;

  h2 {
    font-size: ${(props) => sizes[props.size].fontSize};
    font-weight: 500;
    color: #2f80ed;
  }

  button.close {
    position: absolute;
    top: 15px;
    right: 35px;

    width: 12px;
    height: 12px;

    border: none;
    background: #fff;
    cursor: pointer;
  }

  section.content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
`;
