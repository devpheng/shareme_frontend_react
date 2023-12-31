import React, { useEffect } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Cookies from 'universal-cookie';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

const Login = () => {
    const navigate = useNavigate();
    const responseGoogle = async (response) => {
        const user = jwtDecode(response.credential);
        let data = {
            firstname: user.family_name,
            lastname: user.given_name,
            email: user.email,
            username: user.email,
            password: user.email,
        };
        const res = await fetch(`${process.env.REACT_APP_BACK_END_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.status === 200) {
            data = {
                username: user.email,
                password: user.email,
            };
            fetch(`${process.env.REACT_APP_BACK_END_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }).then((re) => {
                return re.json();
            }).then((resObj) => {
                const cookies = new Cookies();
                cookies.set('token', resObj.jwt, { path: '/' });
                navigate('/', { replace: true });
            });
        }
    };

    useEffect(() => {
        const cookies = new Cookies();
        if (cookies.get('token') !== undefined) {
            navigate('/', { replace: true });
        }
    });

    return (
        <div className="flex justify-start items-center flex-col h-screen">
            <div className=" relative w-full h-full">
                <video
                    src={shareVideo}
                    type="video/mp4"
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className="w-full h-full object-cover"
                />

                <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
                    <div className="p-5">
                        <img src={logo} width="130px" />
                    </div>

                    <div className="shadow-2xl">
                        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
                            <GoogleLogin
                                onSuccess={responseGoogle}
                            />
                        </GoogleOAuthProvider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
