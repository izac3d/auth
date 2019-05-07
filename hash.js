const bcrypt = require('bcrypt');
const {MD5} = require('crypto-js');
const jwt = require('jsonwebtoken');

// bcrypt.genSalt(10, (err, salt)=>{
//     if (err) return next(err);
//     bcrypt.hash('password123', salt, (err, hash)=>{
//         if (err) return next(err);
//         console.log(salt);
//     })
    
// });

// const user = {
//     id: 1,
//     token: MD5('dfgdfg').toString()
// }

const id = 1000;
const secret = 'mysecret';
const recToken = 'eyJhbGciOiJIUzI1NiJ9.MTAwMA.n1bMGa04DxNY-hSxSqKwDr_jwC7ljkxxPCUMMTr4OjA';

const token = jwt.sign(id, secret);
const decodeToken = jwt.verify(recToken, secret);

console.log(decodeToken);