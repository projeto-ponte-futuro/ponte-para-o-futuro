const auth = require('./authStorage');

auth.saveUserAuth(1, {
  passwordHash: "123",
  previousHashes: [],
  failedAttempts: 0,
  lockUntil: null
});

console.log(auth.loadUserAuth(1));
