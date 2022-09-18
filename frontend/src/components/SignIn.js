import React from 'react'

const SignIn = ({handleSignin, username, setUsername, password, setPassword} ) => {
    const inputStyle = {marginLeft: '1em', marginBottom: '1em'}

    return (
      <><h2>Signin</h2>
      <form onSubmit={handleSignin}>
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
            <button className='screenBtn' type="submit">Signin</button>
        </form></>
    )
  }
  
  export default SignIn