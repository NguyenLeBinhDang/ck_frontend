import './login.css';
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {sendData} from "../../services/socket";
import {loginRequest} from "../../redux/userSlice";

export default function Login() {
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')
    const dispatch = useAppDispatch();


    //send login request
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        dispatch(loginRequest(user))

        const payload = {
            action: "onchat",
            data: {
                event: "LOGIN",
                data: {
                    "user": user,
                    "pass": pass
                }
            }
        };

        sendData(payload);
    };

    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white">
                            <div className="card-body p-5 text-center">
                                <div className="mb-md-5 mt-md-4 pb-5">
                                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>

                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <p className="text-white-50 mb-5">Please enter your username and password!</p>
                                    <form onSubmit={handleLogin}>
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
                                                // required
                                            />
                                        </div>
                                        <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="#!">Forgot
                                            password?</a></p>

                                        <button data-mdb-button-init data-mdb-ripple-init
                                                className="btn btn-outline-light btn-lg px-5" type="submit">Login
                                        </button>

                                        <p className="small mb-5 pb-lg-2"><Link className='text-white-50'
                                                                                to='/register'>Register?</Link></p>
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

