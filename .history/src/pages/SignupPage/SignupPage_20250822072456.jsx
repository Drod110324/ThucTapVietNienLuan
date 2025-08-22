import React, { useState } from 'react'
import { notification } from 'antd'
import { Link } from 'react-router-dom'
import { WrapperContainerLeft } from './style'
import { WrapperContainerRight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import Signup from '../../assets/images/Signup.png'
import { EyeFilled, EyeInvisibleOutlined } from '@ant-design/icons'
const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      notification.error({ 
        message: 'Lỗi đăng ký', 
        description: 'Vui lòng điền đầy đủ thông tin!', 
        duration: 3 
      })
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      notification.error({ 
        message: 'Lỗi đăng ký', 
        description: 'Email không hợp lệ!', 
        duration: 3 
      })
      return
    }
    if (password !== confirmPassword) {
      notification.error({ 
        message: 'Lỗi đăng ký', 
        description: 'Mật khẩu xác nhận không khớp!', 
        duration: 3 
      })
      return
    }
    if (password.length < 6) {
      notification.error({ 
        message: 'Lỗi đăng ký', 
        description: 'Mật khẩu phải có ít nhất 6 ký tự!', 
        duration: 3 
      })
      return
    }
    setLoading(true)
    try {
        const emailPrefix = email.split('@')[0];
        const accountData = {
          username: emailPrefix,
          password: password,
          email: email,
          hoTen: emailPrefix, 
          soDienThoai: '',
          diaChi: '',
          vaiTro: 'user'
        }
        console.log(' Sending request to:', 'http://localhost:5000/taikhoan');
       console.log(' Request data:', accountData);
       const res = await fetch('http://localhost:5000/api/taikhoan', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(accountData)
       })
             const result = await res.json()
       console.log(' Raw Response:', res);
       console.log(' Response Status:', res.status);
       console.log(' Response OK:', res.ok);
       console.log(' Parsed Result:', result);
       console.log(' Result Type:', typeof result);
       console.log(' Result Keys:', Object.keys(result));
       if (res.ok) {
        console.log(' API Response:', result);
        console.log(' Username:', result.username);
        console.log('️ HoTen:', result.hoTen);
        console.log(' Email:', result.email);
        notification.success({ 
          message: 'Đăng ký thành công!', 
          description: `Tài khoản ${result.hoTen || result.username} đã được tạo trong database. Vui lòng đăng nhập.`, 
          duration: 4 
        })
        alert(`Đăng ký thành công! Username: ${result.username}, HoTen: ${result.hoTen}`);
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('userRole', result.vaiTro || 'user');
        localStorage.setItem('userInfo', JSON.stringify({
          username: result.username,
          hoTen: result.hoTen,
          email: result.email,
          vaiTro: result.vaiTro
        }));
        setTimeout(() => {
          window.location.href = '/signin'
        }, 1000)
      } else {
        let errorMessage = 'Đăng ký thất bại'
        if (result.message) {
          if (result.message.includes('đã tồn tại') || result.message.includes('already exists')) {
            errorMessage = 'Email hoặc username đã tồn tại trong hệ thống'
          } else if (result.message.includes('validation failed')) {
            errorMessage = 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.'
          } else {
            errorMessage = result.message
          }
        }
        notification.error({ 
          message: 'Đăng ký thất bại', 
          description: errorMessage, 
          duration: 4 
        })
      }
    } catch {
      notification.error({ 
        message: 'Lỗi kết nối', 
        description: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau!', 
        duration: 4 
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F2', height: '100vh'}}>
      <div style={{width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex'}}>
        <WrapperContainerLeft>
        <h1 style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '10px'}}>Xin Chào</h1>
        <p style={{fontSize: '14px', marginBottom: '20px'}}>Đăng ký để tiếp tục</p>
          <InputForm 
            style={{marginBottom: '10px'}} 
            placeholder='Email' 
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{position: 'relative'}}>
            <span style={{
              zIndex: '10',
              position: 'absolute',
              top: '50%',
              right: '12px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#999'
            }}>
              {showPassword ? 
                <EyeFilled 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ fontSize: '18px' }}
                /> : 
                <EyeInvisibleOutlined 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ fontSize: '18px' }}
                />
              }
            </span>
            <InputForm 
              style={{
                marginBottom: '10px',
                paddingRight: '40px'
              }} 
              placeholder='Password' 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{position: 'relative'}}>
            <span style={{
              zIndex: '10',
              position: 'absolute',
              top: '50%',
              right: '12px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#999'
            }}>
              {showConfirmPassword ? 
                <EyeFilled 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  style={{ fontSize: '18px' }}
                /> : 
                <EyeInvisibleOutlined 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  style={{ fontSize: '18px' }}
                />
              }
            </span>
            <InputForm 
              style={{
                marginBottom: '10px',
                paddingRight: '40px'
              }} 
              placeholder='Confirm Password' 
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <ButtonComponent 
              size={40} 
              styleButton={{
                  height: '48px',
                  width: '220px',
                  borderRadius: '4px',
                  border: 'none',
                  background: 'rgb(255, 57, 69)',
                  fontSize: '15px',
                  fontWeight: '700',
                  margin: '26px 0 10px'
              }}
              textButton={loading ? 'Đang đăng ký...' : 'Đăng Ký'}
              StyleTextButton={{color: '#fff', fontSize: '15px', fontWeight: '700'}}
              onClick={handleSignup}
              disabled={loading}
            />
        <p style={{fontSize: '14px', marginTop: '10px'}}>Bạn đã có tài khoản? <Link to='/signin'>Đăng nhập</Link></p>
        <p style={{fontSize: '14px', marginTop: '10px'}}><Link to='/'>Quay Lại Trang Chủ</Link></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
              <img src={Signup} alt="" style={{width: '100%', height: '100%', borderTopRightRadius: '6px', borderBottomRightRadius: '6px'}}/>
        </WrapperContainerRight>
      </div>
    </div>
  ) 
}
export default SignupPage
