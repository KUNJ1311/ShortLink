/**
 * Generates a beautiful 404 HTML page for non-existent short links
 * @param {string} code - The short code that was not found
 * @param {string} frontendUrl - The URL of the frontend application
 * @returns {string} Complete HTML page as string
 */
const generate404Page = (code, frontendUrl) => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link Not Found</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 60px 40px;
      max-width: 540px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    .error-code {
      font-size: 96px;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 20px;
      line-height: 1;
      letter-spacing: -2px;
    }
    h1 {
      font-size: 28px;
      color: #1e293b;
      margin-bottom: 16px;
      font-weight: 700;
    }
    .short-code {
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      color: #667eea;
      padding: 4px 12px;
      border-radius: 6px;
      font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
      font-weight: 600;
      font-size: 15px;
      border: 1px solid #667eea30;
    }
    p {
      color: #64748b;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 36px;
    }
    .btn {
      padding: 14px 36px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: inline-block;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
    }
    .btn:active {
      transform: translateY(0);
    }
    @media (max-width: 640px) {
      .container { padding: 48px 28px; border-radius: 16px; }
      .error-code { font-size: 72px; }
      h1 { font-size: 24px; }
      p { font-size: 15px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error-code">404</div>
    <h1>Link Not Found</h1>
    <p>
      The link <span class="short-code">${code}</span> doesn't exist or may have expired.
      <br>Please check the URL and try again.
    </p>
    <a href="javascript:history.back()" class="btn">Go Back</a>
  </div>
</body>
</html>
`;
};

module.exports = { generate404Page };
