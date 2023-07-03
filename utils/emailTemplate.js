/**
 ** This function creates email template that will be sent to the email address of users
**/

const emailTemplate = (action, otpCode) => {
  return `<html>
            <head>
              <style>
                @import url('https://fonts.cdnfonts.com/css/sf-pro-display');

                * {
                  box-sizing: border-box;
                  margin: 0;
                  padding: 0;
                  color: #1E1E1E;
                  font-family: 'SF Pro Display', sans-serif;
                }

                body {
                  width: 100vw;
                }

                p {
                  font-size: 14px;
                }

                img {
                  height: 32px;
                }

                section {
                  width: 100%;
                  padding: 48px;
                  background-color: #E6EBF0;
                }

                section > div {
                  width: 75%;
                  margin: 0 auto;
                  padding: 48px 24px; 
                  border-radius: 12px; 
                  background-color: #FFF
                }

                .header {
                  display: grid;
                  gap: 24px;
                  margin-top: 40px;
                }

                .header > h1 {
                  margin-bottom: 14px;
                  font-size: 20px;
                  font-weight: 800;
                }

                .code {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin: 48px 0;
                  width: 100%;
                  padding: 12px;
                  background-color: #E6EBF0;
                }

                .code > p {
                  width: 100%;
                  text-align: center;
                  letter-spacing: 8px;
                  font-size: 24px;
                  font-weight: 800;
                }

                .footer {
                  display: grid;
                  gap: 24px;
                  margin-top: 80px;;
                }

                .footer > h2 {
                  margin-bottom: 8px;
                  font-size: 18px;
                  font-weight: 800;
                }

                @media screen and (max-device-width: 767px), screen and (max-width: 767px) {
                  img {
                    height: 24px;
                  }

                  section {
                    padding: 0;
                  }

                  section > div {
                    width: 100%;
                    padding: 24px; 
                    border-radius: 0;
                  }
                }
              </style>
            </head>
            <body>
              <section>
                <div>
                  <img src='https://imagizer.imageshack.com/img923/6832/kvj0Vj.png' alt='Brand Logo' />

                  <div class='header'>
                    <h1>Hello!</h1>
                    <p>A ${action} attempt requires further verification. To complete the ${action}, enter the verification code.</p>
                  </div>

                  <div class='code'>
                    <p>${otpCode}</p>
                  </div>

                  <div>
                    <p>This mail was generated because of a verification attempt from a web app.<p/>
                    <br><br>
                    <p>The one-time passcode is necessary to finish the verification. No one can access your account without also having access to this email address.<p/>
                    <br><br>
                    <p>Please ignore this email if you are not trying to verify your account.<p/>
                  <div>

                  <div class='footer'>
                    <h2>Kind regards,</h2>
                    <p>Silverdale Residences HOA</>
                  </div>
                <div>
              </section>
            </body>
          </html>`
}

export default emailTemplate