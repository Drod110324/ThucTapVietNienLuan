import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponet/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
const ButtonInputSearch = (props) => {
    const { placeholder, size, textButton, bordered, colorButton, border, onSearch, ...rest } = props
    const [searchValue, setSearchValue] = useState('')
    
    const handleSearch = () => {
        if (onSearch && searchValue.trim()) {
            onSearch(searchValue.trim())
        }
    }
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }
    
    return (
        <div style={{
            display: 'flex',
            gap: 0,
            padding: '5px',
            width: '100%',        
            maxWidth: 650,        
            boxSizing: 'border-box'
        }}>
            <InputComponent
                size={size}
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                    flex: 1, 
                    minWidth: 600, 
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderRight: 'none',
                }}
                {...rest}
            />
            <ButtonComponent
                size={size}
                icon={<SearchOutlined />}    
                bordered={bordered}
                onClick={handleSearch}
                style={{
                    minWidth: 50, 
                    backgroundColor: '#0a5d87',
                    color: '#fff',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderLeft: 'none',
                    boxShadow: 'none',
                    border: border ? border : 'none'
                }}
                {...rest}
            ><span style={{ color: colorButton }}>{textButton}</span>
            </ButtonComponent>
        </div>
    )
}
export default ButtonInputSearch