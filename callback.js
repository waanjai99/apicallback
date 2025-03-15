const axios = require('axios');

module.exports = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('授权失败：未获取到授权码');
  }

  try {
    const tokenResponse = await axios.post('https://api.coze.cn/api/permission/oauth2/token', {
      grant_type: 'authorization_code',
      client_id: '70243083421339848285026781980719.app.coze', // medical Client ID
      code: code,
      code_verifier: req.query.code_verifier, // 从请求中获取 code_verifier
      redirect_uri: 'https://your-vercel-app.vercel.app/api/callback' // 替换为你的回调地址
    });

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;

    // 将令牌返回给小程序
    res.redirect(`https://your-miniprogram-domain.com/pages/oauth/success?access_token=${accessToken}&refresh_token=${refreshToken}`);
  } catch (error) {
    console.error('令牌交换失败:', error);
    res.status(500).send('令牌交换失败');
  }
};
