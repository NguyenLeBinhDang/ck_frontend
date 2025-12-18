import '../login/login.css'

import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getSocket, sendData} from "../../services/socket";

export default function Register() {
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        const socket = getSocket();

        if (!socket) {
            return;
        }

        socket.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                if (response.event === 'REGISTER') {
                    if (response.statud === 'success') {
                        alert("Tạo tài khoản thành công!");
                    } else {
                        setError(response.message || "Đăng kí thất bại");
                    }
                }
            } catch (e) {
                console.log(e);
            }

        }
        return () => {
            if (socket) socket.onmessage = null;
        }

    }, [])


    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const payload = {
            action: "onchat",
            data: {
                event: "REGISTER",
                data: {
                    "user": user,
                    "pass": pass
                }
            }
        };

        sendData(payload);
    }

    return (


        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white">
                            <div className="card-body p-5 text-center">
                                <div className="mb-md-5 mt-md-4 pb-5">
                                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                    <p className="text-white-50 mb-5">Please enter your username and password!</p>

                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <form onSubmit={handleRegister}>
                                        <div data-mdb-input-init className="form-outline form-white mb-4">
                                            <label className="form-label" htmlFor="typeUsernameX">Username</label>
                                            <input type="text"
                                                   id="typeUsernameX"
                                                   className="form-control form-control-lg"
                                                   value={user}
                                                   onChange={(e) => setUser(e.target.value)}
                                                   required
                                            />

                                        </div>
                                        <div data-mdb-input-init className="form-outline form-white mb-4">
                                            <label className="form-label" htmlFor="typePasswordX">Password</label>
                                            <input type="password"
                                                   id="typePasswordX"
                                                   className="form-control form-control-lg"
                                                   value={pass}
                                                   onChange={(e) => setPass(e.target.value)}
                                                   required
                                            />
                                        </div>
                                        <button data-mdb-button-init data-mdb-ripple-init
                                                className="btn btn-outline-light btn-lg px-5" type="submit">Register
                                        </button>
                                        <p className="small mb-5 pb-lg-2"><a className="text-white-50"
                                                                             href="/login">Login?</a></p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
