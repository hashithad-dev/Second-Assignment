import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(cookieParser())

app.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.VITE_GITHUB_CLIENT_ID,
        client_secret: process.env.VITE_GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    )

    const accessToken = tokenResponse.data.access_token
    console.log('GitHub Access Token:', accessToken)

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    
    console.log('GitHub User Data:', userResponse.data)

    res.cookie('github_token', accessToken, { httpOnly: true, maxAge: 3600000 })
    res.redirect(`http://localhost:5173?github_user=${encodeURIComponent(JSON.stringify(userResponse.data))}`)
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    res.redirect('http://localhost:5173?error=github_auth_failed')
  }
})

app.listen(3001, () => console.log('Backend server running on http://localhost:3001'))
