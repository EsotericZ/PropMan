import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import login from '../../services/portal/login';
import useToggle from '../../hooks/useToggle';
// Use this is you want to save form data
import useInput from '../../hooks/useInput';
import './login.css';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
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

export const Login = () => {
    const { setAuth } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    // Use this is you want to save form data
    // const [email, resetEmail, emailAttributes] = useInput('email', '');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [check, toggleCheck] = useToggle('persist', false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrorMessage('');
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await login(username, password);
            const accessToken = response?.data?.accessToken;
            setAuth({ username, accessToken });
            setUsername('');
            // Use this is you want to save form data
            // resetEmail();
            setPassword('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 400) {
                setErrorMessage('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrorMessage('Unauthorized');
            } else {
                setErrorMessage('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <Box sx={{ width: '400px', ml:'auto', mr:'auto' }} className='loginPage'>
            <Typography className='signInTitle'>
                Sign In
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <StyledTextField
                        // required
                        id="username"
                        name="username"
                        label="Username"
                        ref={userRef}
                        fullWidth
                        autoComplete="given-name"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        // {...emailAttributes}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    {/* <FormControl variant="outlined" fullWidth> */}
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
                            label="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            sx={{ color:'#CBCCD2' }}
                            required
                        />
                    {/* </FormControl> */}
                    </StyledFormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        className='signInBtn'
                        onClick={handleSubmit}
                        color='inherit'
                        label="Remember Me"
                    >
                        Sign In
                    </Button>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <FormControlLabel
                        control={<Checkbox color="secondary" name="rememberMe" value="yes" />}
                        label="Remember Me"
                        id='persist'
                        onChange={toggleCheck}
                        checked={check}
                    />
                </Grid>
            </Grid>
            <Divider variant='middle' sx={{ bgcolor:'#CBCCD2', mt:'25px', mb:'15px' }} />
            <Typography className='signInTextParent'>
                <Link to="/register" className="signInText">Forgot Password</Link>
                <Link to="/register" className="signInText">Create Account</Link>
            </Typography>
            <p ref={errRef} className={errorMessage ? "errmsg" : "offscreen"} aria-live="assertive">{errorMessage}</p>
        </Box> 
    )
}



                                        {/* <h1>Sign In</h1>
                                        <form onSubmit={handleSubmit}>
                                            <label htmlFor="email">Email:</label>
                                            <input
                                                type="text"
                                                id="email"
                                                ref={userRef}
                                                autoComplete="off"
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                                // Use this is you want to save form data
                                                {...emailAttributes}
                                                required
                                            /> */}
                            
                                            {/* <label htmlFor="password">Password:</label>
                                            <input
                                                type="password"
                                                id="password"
                                                onChange={(e) => setPassword(e.target.value)}
                                                value={password}
                                                required
                                            /> */}
                                            {/* <button>Sign In</button>
                                            <div className="persistCheck">
                                                <input 
                                                    type='checkbox'
                                                    id='persist'
                                                    onChange={toggleCheck}
                                                    checked={check}
                                                />
                                                <label htmlFor="persist">Trust This Device</label>
                                            </div>
                                        </form> */}
                                        {/* <p>
                                            Need an Account?<br />
                                            <span className="line">
                                                <Link to="/register">Sign Up</Link>
                                            </span>
                                        </p> */}