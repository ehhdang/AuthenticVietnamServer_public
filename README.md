# Authentic Vietnam Server
This project uses Node.js, Passport, and MongoDB to create a backend server 
for the AuthenticVietnam application

## Generate jwtRSA key pair
1. Create a bin folder in your project directory and navigate into it
```
mkdir bin
cd bin
```
2. Generate the private key. **DO NOT** add a pass phrase. Simply hit ENTER when prompted to enter a pass phrase
```
ssh-keygen -t rsa -b 4096 -m PEM -f private.key
```
3. Generate the public key.
```
openssl rsa -in private.key -pubout -outform PEM -out public.key
```
4. Navigate back to the project folder
```
cd ..
```

## Development server
Run ```npm start``` in the terminal. 

Run this backend server before serving the AuthenticVietnam project.

Hit Ctrl+C to terminate the server.