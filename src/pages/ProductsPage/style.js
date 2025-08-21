import { Col } from "antd"
import styled from "styled-components"
export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  justify-items: center;
  place-items: center;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 18px;
    justify-items: center;
    place-items: center;
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    justify-items: center;
    place-items: center;
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    justify-items: center;
    place-items: center;
  }
`
export const WrapperNavBar = styled(Col)`
  background: #fff;
  margin-right: 10px;
  padding: 10px;
  border-radius: 4px;
  height: fit-content;
  margin-top: 20px;
  width: 200px;
`
