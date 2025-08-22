import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
export const WrapperTypeProduct = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  justify-content: center;
  flex-wrap: nowrap;
  padding-bottom: 24px;
  padding-top: 20px;
  margin-bottom: 0px;
  height: 44px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  box-sizing: border-box;
  background: #fff;
  padding-left: 24px;
  padding-right: 24px;
  > div {
    display: flex;
    gap: 8px;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
`;
export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover{
    color: #fff;
    background-color: #0b74e5;
    span{
      color: #fff;
    }
  }
    width: 100%;
    text-align: center;
`;
export const WrapperProduct = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 40px;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  
  /* Đảm bảo mỗi card có kích thước đồng đều */
  & > * {
    width: 100%;
    min-width: 0;
  }
  
  /* Responsive cho màn hình nhỏ */
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`
export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  justify-items: center;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 18px;
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

/* Alternative: Flexbox với căn giữa thông minh */
export const WrapperProductSmart = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin-top: 40px;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  
  /* Căn giữa thông minh: cards sẽ căn giữa khi có thể, nhưng bắt đầu từ trái khi wrap */
  &::before {
    content: '';
    flex: 1;
    min-width: 0;
  }
  
  &::after {
    content: '';
    flex: 1;
    min-width: 0;
  }
  
  /* Responsive */
  @media (max-width: 1199px) {
    &::before,
    &::after {
      display: none;
    }
  }
`;