import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/system';

import register from "../../services/portal/register";
import './register.css'

const StyledTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#CBCCD2',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#CBCCD2',
    },
    '& .MuiInputLabel-root': {
        color: '#CBCCD2',
    },
    '& .MuiOutlinedInput-input': {
        color: '#CBCCD2',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#CBCCD2',
        },
        '&:hover fieldset': {
            borderColor: '#CBCCD2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#CBCCD2',
        },
        '&.Mui-error fieldset': {
            borderColor: 'red',
        },
    },
});

const CheckTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#CBCCD2',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#CBCCD2',
    },
    '& .MuiInputLabel-root': {
        color: '#CBCCD2',
    },
    '& .MuiOutlinedInput-input': {
        color: '#CBCCD2',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'green',
        },
        '&:hover fieldset': {
            borderColor: 'green',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'green',
        },
        '&.Mui-error fieldset': {
            borderColor: 'red',
        },
    },
});

const StyledFormControl = styled(FormControl)({
    '& label.Mui-focused': {
        color: '#CBCCD2',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#CBCCD2',
    },
    '& .MuiInputLabel-root': {
        color: '#CBCCD2',
    },
    '& .MuiOutlinedInput-input': {
        color: '#CBCCD2',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#CBCCD2',
        },
        '&:hover fieldset': {
            borderColor: '#CBCCD2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#CBCCD2',
        },
    },
});

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);
    
    const [psn, setPsn] = useState('');
    // const [lastName, setLastName] = useState('');

    // const [email, setEmail] = useState('');
    // const [validEmail, setValidEmail] = useState(false);
    // const [emailFocus, setEmailFocus] = useState(false);
    
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [showMatch, setShowMatch] = useState(false);
    const handleClickShowMatch = () => setShowMatch((show) => !show);
    const handleMouseDownMatch = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username])
    
    // useEffect(() => {
    //     setValidEmail(EMAIL_REGEX.test(email));
    // }, [email])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword])

    useEffect(() => {
        setErrorMessage('');
    }, [username, password, matchPassword])
    // }, [email, password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const testUsername = USERNAME_REGEX.test(username);
        // const testEmail = EMAIL_REGEX.test(email);
        const testPass = PWD_REGEX.test(password);
        if (!testUsername || !testPass) {
            setErrorMessage("Invalid Entry");
            return;
        }
        try {
            const response = await register(psn, username, password);
            setSuccess(true);
            //clear state and controlled inputs
            setUsername('');
            setPsn('');
            // setEmail('');
            setPassword('');
            setMatchPassword(' ');
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 409) {
                setErrorMessage('Username Already Used');
            } else {
                setErrorMessage('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <Box sx={{ width: '400px', ml:'auto', mr:'auto' }} className='registerPage'>
            {success ? (
                <section>
                    <Typography className='registerTitle'>
                        User Created
                    </Typography>
                    <Link to="/login" className="signInText">Login</Link>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errorMessage ? "errormessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
                    <Typography className='registerTitle'>
                        Register
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12}>
                            <StyledTextField
                                id="psn"
                                name="psn"
                                label="PSN Name"
                                fullWidth
                                autoComplete="off"
                                onChange={(e) => setPsn(e.target.value)}
                                value={psn}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <CheckTextField
                            /* <TextField */
                                id="username"
                                name="username"
                                label="Username"
                                ref={userRef}
                                error={validUsername ? false : true}
                                fullWidth
                                autoComplete="off"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                required
                                aria-invalid={validUsername ? "false" : "true"}
                                aria-describedby="usernameNote"
                                onFocus={() => setUsernameFocus(true)}
                                onBlur={() => setUsernameFocus(false)}
                            />
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validUsername || !username ? "hide" : "invalid"} />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <StyledFormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            sx={{ color:'#CBCCD2' }}
                                            edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label='Password'
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    sx={{ color:'#CBCCD2' }}
                                    required
                                    aria-invalid={validPassword ? "false" : "true"}
                                    aria-describedby="passwordnote"
                                    onFocus={() => setPasswordFocus(true)}
                                    onBlur={() => setPasswordFocus(false)}
                                />
                            </StyledFormControl>
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                        </Grid>
                    
                        <Grid item xs={12} sm={12}>
                            <StyledFormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-confirm">Confirm Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-confirm"
                                    type={showMatch ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowMatch}
                                            onMouseDown={handleMouseDownMatch}
                                            sx={{ color:'#CBCCD2' }}
                                            edge="end"
                                            >
                                                {showMatch ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label='Confirm Password'
                                    onChange={(e) => setMatchPassword(e.target.value)}
                                    value={matchPassword}
                                    sx={{ color:'#CBCCD2' }}
                                    required
                                    aria-invalid={validMatch ? "false" : "true"}
                                    aria-describedby="confirmNote"
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={() => setMatchFocus(false)}
                                />
                            </StyledFormControl>
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <FontAwesomeIcon icon={faCheck} className={validMatch && (matchPassword.length > 0) ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPassword ? "hide" : "invalid"} />
                        </Grid>
                    
                        <Grid item xs={12}>
                            <Button 
                                disabled={!psn || !validUsername || !validPassword || !validMatch ? true : false}
                                className='registerBtn'
                                onClick={handleSubmit}
                                fullWidth
                                color='inherit'
                                sx={{ color: 'black', backgroundColor: '#8C7CF0'}}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>








                    {/* <form onSubmit={handleSubmit}> */}
                        {/* <label htmlFor="username">
                            Username:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                            </label>
                            <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p> */}

                        {/* <label htmlFor="email">
                            Email:
                            </label>
                        <input
                        type="text"
                        id="email"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        /> */}
                        {/* <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        <p id="emailNote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                            Must Be a Valid Email
                        </p> */}


                        {/* <label htmlFor="password">
                            Password:
                            </label>
                            <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="passwordnote"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        /> */}
                        {/* <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} /> */}
                        {/* <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} /> */}
                        {/* <p id="pwdNote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p> */}


                        {/* <label htmlFor="confirm_pwd">
                            Confirm Password:
                            </label>
                            <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPassword(e.target.value)}
                            value={matchPassword}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            />
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPassword ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPassword ? "hide" : "invalid"} />
                            <p id="confirmNote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p> */}

                        {/* <button disabled={!validEmail || !validPassword || !validMatch ? true : false}>Sign Up</button> */}
                        {/* <button disabled={!validPassword || !validMatch ? true : false}>Sign Up</button> */}
                    {/* </form> */}

                    <p id="usernameNote" className={usernameFocus && username && !validUsername ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must Be a Valid Username
                    </p>
                    <p id="passwordNote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>
                    <p id="confirmNote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password
                    </p>


                    <Divider variant='middle' sx={{ bgcolor:'#CBCCD2', mt:'25px', mb:'15px' }} />
                    <Typography className='signInTextParent'>
                        Already Registered? <Link to="/login" className="signInText">Login</Link>
                    </Typography>
                </section>
            )}
        </Box>
    )
}