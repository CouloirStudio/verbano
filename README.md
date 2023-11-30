This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started With Verbano

Verbano is a cutting-edge AI-powered application designed to revolutionize the way audio recordings and transcriptions
are integrated and utilized. Verbano uniquely combines audio recording capabilities, transcription services, and
document linking to produce contextually rich summaries.

Verbano relies on several microservices, and has a complex development environment. Below will detail what is currently
needed to run this program.

### Software Requirements to run:

- Node.js (you must install all packages before attempting to run)
- Webstorm (recommended IDE)

### Required API keys:

- REPLICATE_API_KEY
- OPENAI_API_KEY

In order to get these keys, you must set up an account with these services and give them your billing information.
Whenever you transcribe or summarize, your account will be charged.

### Other required ENV variables:

- MONGO_URI
    - This must be acquired after being granted access to the database by an administrator after you create an account
      with MongoDB.
    - This is a paid service, your IP address must be whitelisted by an admin in order for the program to work.
- AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET
    - This can only be acquired after being granted access to the database by an administrator, they will create an
      account for you and send you the details.
        - This is a paid service, with limited storage.
- GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
    - This must be either created on your own, or granted to you by an administrator. It is used for Google OAuth
      privileges.
- JWT_SECRET
    - This can be set to whatever you wish.
- CERT_PASSPHRASE
    - This is the passphrase you would have set while generating your cert.pem and key.pem files.

### Certificates for HTTPS:

- In order to run you must place a cert.pem and key.pem file in the 'certs' folder of the root directory.
- The password you choose while generating these must be used for the CERT_PASSPHRASE env variable listed above.
- These are used in order for HTTPS to work.

### Dependencies:

For a full list of dependencies, please see the package.json file in the root directory.

To install all dependencies:

```bash
Npm install 
```

### To run:

to run the development server:

```bash
yarn dev
```

Open [https://localhost:3000](https://localhost:3000) with your browser to see the result.

