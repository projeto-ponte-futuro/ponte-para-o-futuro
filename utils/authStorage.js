const fs = require("fs");
const path = require("path");

const basePath = path.join(__dirname, "..", "auth-data");
if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });

function filePath(userId) {
  return path.join(basePath, `${userId}.json`);
}

function loadUserAuth(userId) {
  const f = filePath(userId);
  if (!fs.existsSync(f)) return null;
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch (e) {
    console.error("Erro lendo auth file:", e);
    return null;
  }
}

function saveUserAuth(userId, data) {
  const f = filePath(userId);
  fs.writeFileSync(f, JSON.stringify(data, null, 2), "utf8");
}

function deleteUserAuth(userId) {
  const f = filePath(userId);
  if (fs.existsSync(f)) fs.unlinkSync(f);
}

// updatePassword: registra histórico (mantém 3 anteriores)
function updatePassword(userId, newHash) {
  const userData = loadUserAuth(userId) || {
    passwordHash: null,
    previousHashes: [],
    failedAttempts: 0,
    lockUntil: null,
    lastLockLogDate: null
  };

  if (userData.passwordHash) {
    userData.previousHashes.unshift(userData.passwordHash);
  }
  userData.previousHashes = userData.previousHashes.slice(0, 3);
  userData.passwordHash = newHash;
  userData.failedAttempts = 0;
  userData.lockUntil = null;
  saveUserAuth(userId, userData);
}

// retorna { failedAttempts, locked, lockUntil, lockedNow (bool) }
function registerFailedAttempt(userId) {
  const userData = loadUserAuth(userId);
  if (!userData) return null;

  userData.failedAttempts = (userData.failedAttempts || 0) + 1;

  let lockedNow = false;
  if (userData.failedAttempts >= 5) {
    userData.lockUntil = Date.now() + 10 * 60 * 1000; // 10 min
    userData.failedAttempts = 0; // reset after lock
    lockedNow = true;
  }

  if (data.failedAttempts === 5) {
  logService.write("FALHAS_AUTENTICACAO_5X", {
    usuario: userId,
    descricao: "Usuário teve 5 falhas consecutivas de autenticação."
  });
}

  saveUserAuth(userId, userData);
  return {
    failedAttempts: userData.failedAttempts,
    locked: !!userData.lockUntil && Date.now() < userData.lockUntil,
    lockUntil: userData.lockUntil,
    lockedNow
  };
}

function resetAttempts(userId) {
  const userData = loadUserAuth(userId);
  if (!userData) return;
  userData.failedAttempts = 0;
  userData.lockUntil = null;
  saveUserAuth(userId, userData);
}

// checa se plain corresponde a passwordHash ou a qualquer previousHashes
async function isPasswordInPrevious(plain, userId) {
  const bcrypt = require("bcrypt");
  const userData = loadUserAuth(userId);
  if (!userData) return false;
  if (userData.passwordHash && await bcrypt.compare(plain, userData.passwordHash)) return true;
  for (const h of userData.previousHashes || []) {
    if (await bcrypt.compare(plain, h)) return true;
  }
  return false;
}

module.exports = {
  loadUserAuth,
  saveUserAuth,
  updatePassword,
  registerFailedAttempt,
  resetAttempts,
  deleteUserAuth,
  isPasswordInPrevious
};
