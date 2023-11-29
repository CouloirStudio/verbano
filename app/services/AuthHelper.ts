import https from "https";

/**
 * Function for revoking google token upon account deletion.
 * @param token the token to be revoked
 */
const revokeToken = (token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const googleRevokeUrl = `https://accounts.google.com/o/oauth2/revoke?token=${token}`;

    https
      .get(googleRevokeUrl, (res) => {
        res.on('data', () => {
          // Handle successful response
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject(new Error('Failed to revoke Google OAuth token.'));
          }
        });
      })
      .on('error', (error) => {
        console.error('Error revoking Google token:', error);
        reject(new Error('Failed to revoke Google OAuth token.'));
      });
  });
};

export default revokeToken;
