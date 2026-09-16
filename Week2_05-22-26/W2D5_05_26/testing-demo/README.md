


cd testing-demo
npm init -y 
npm install express
npm install --save-dev jest supertest


**In package.json modify **
"scripts": {
  "test": "jest"
}

npm test


npx jest --coverage // jest can generate coverage 