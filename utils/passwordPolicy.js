module.exports = {
    validatePassword(password) {
        const minLength = 10;

        if (!password || password.length < minLength) {
            return { ok: false, message: `A senha deve ter pelo menos ${minLength} caracteres.` };
        }

        if (!/[A-Z]/.test(password)) {
            return { ok: false, message: "A senha deve conter pelo menos uma letra maiúscula." };
        }

        if (!/[a-zA-Z]/.test(password)) {
            return { ok: false, message: "A senha deve conter letras." };
        }

        if (!/\d/.test(password)) {
            return { ok: false, message: "A senha deve conter pelo menos um número." };
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
            return { ok: false, message: "A senha deve conter pelo menos um caractere especial." };
        }

        return { ok: true };
    }
};
