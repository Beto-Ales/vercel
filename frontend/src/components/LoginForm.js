import React from 'react'
import { useState } from 'react'
import SignIn from './SignIn'

const LoginForm = ({handleLogin, username, setUsername, password, setPassword, handleSignin} ) => {
  const [logSign, setlogSign] = useState(false)

  const log = {display: logSign ? 'none' : ''}
  const sign = {display: logSign ? '' : 'none'}
  const butStyl = {backgroundColor: 'red'}
  const inputStyle = {marginLeft: '1em', marginBottom: '1em'}

  const toggleLogSign = () => {
    setlogSign(!logSign)
  }
  return (
    <>
      <button className='screenBtn' style={butStyl} onClick={toggleLogSign}>{logSign ? 'Login' : 'Signin'}</button>   {/* buttons are confusing */}
      <div style={log}>
      <h2>Login</h2>
        <form onSubmit={handleLogin}>
              <div>
                  Username
                  <input style={inputStyle}
                      type="text"
                      value={username}
                      name="Username"
                      onChange={({ target }) => setUsername(target.value)} />
              </div>
              <div>
                  Password
                  <input style={inputStyle}
                      type="password"
                      value={password}
                      name="Password"
                      onChange={({ target }) => setPassword(target.value)} />
              </div>
              <button className='screenBtn' type="submit">Login</button>    {/* buttons are confusing */}
        </form>
      </div>
      <div style={sign}>
        {/* <h1>signin</h1> */}
        <SignIn
          handleSignin={handleSignin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    </>
  )
}

export default LoginForm