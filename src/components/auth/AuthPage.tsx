import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import logoMain from '../../assets/logo_main.png';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Email validation for registration
        if (!isLogin && !email.endsWith('@lpnu.ua')) {
            setError("Будь ласка, використовуйте корпоративну пошту @lpnu.ua");
            setLoading(false);
            return;
        }

        try {
            console.log('[AuthPage] Attempting', isLogin ? 'login' : 'registration', 'for:', email);

            if (isLogin) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('[AuthPage] Login successful:', userCredential.user.email);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('[AuthPage] Registration successful:', userCredential.user.email);
            }
        } catch (error: any) {
            console.error('[AuthPage] Authentication error:', error);

            // Better error messages
            let errorMessage = "Помилка автентифікації";
            if (error.code === 'auth/user-not-found') {
                errorMessage = "Користувача не знайдено. Спочатку зареєструйтесь.";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Неправильний пароль.";
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Ця пошта вже використовується. Спробуйте увійти.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Неправильний формат email.";
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                padding: '40px',
                width: '400px',
                maxWidth: '90%'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img src={logoMain} alt="SHO Logo" style={{ height: '80px', borderRadius: '16px' }} />
                </div>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#667eea',
                    marginBottom: '8px',
                    textAlign: 'center'
                }}>
                    {isLogin ? 'Вхід' : 'Реєстрація'}
                </h1>
                <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '32px',
                    textAlign: 'center'
                }}>
                    {isLogin ? 'Увійдіть у свій акаунт' : 'Створіть новий акаунт'}
                </p>

                {error && (
                    <div style={{
                        background: '#fee',
                        color: '#c33',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        border: '1px solid #fcc'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            Email {!isLogin && '(@lpnu.ua)'}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder={isLogin ? "your.email@lpnu.ua" : "student@lpnu.ua"}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            Пароль
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            minLength={6}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'white',
                            background: loading ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.1s',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                        }}
                        onMouseDown={(e) => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {loading ? 'Завантаження...' : (isLogin ? 'Увійти' : 'Зареєструватись')}
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '1px solid #e0e0e0',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                        {isLogin ? 'Немає акаунта?' : 'Вже є акаунт?'}
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        style={{
                            background: 'none',
                            border: '2px solid #667eea',
                            color: '#667eea',
                            padding: '10px 24px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#667eea';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                            e.currentTarget.style.color = '#667eea';
                        }}
                    >
                        {isLogin ? 'Створити акаунт' : 'Увійти'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
