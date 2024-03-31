import React from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography
} from '@mui/material';
import appLogo2 from '/appLogo2.svg';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import '../App.css';
import { login } from '../services/LoginService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import config from '../config.json';
import { getUserId } from '../services/profileService.ts';
import Loader from '../components/Loader.tsx';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

interface State extends SnackbarOrigin {
  openModal: boolean;
}

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('preferredLanguage') || 'en'
  );
  const [language, setLanguage] = useState(selectedLanguage);
  const navigate = useNavigate();
  const theme = useTheme<any>();
  const [state, setState] = React.useState<State>({
    openModal: false,
    vertical: 'top',
    horizontal: 'center'
  });
  const { vertical, horizontal, openModal } = state;

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const trimmedValue = value.trim();
    setUsername(trimmedValue);
    if (trimmedValue.includes(' ')) {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!usernameError && !passwordError) {
      // loginButtonClick(event);
      setLoading(true);
      event.preventDefault();
      try {
        const response = await login({ username: username, password: password });
        console.log(response);
        if (response) {
          const token = response?.access_token;

          localStorage.setItem('token', token);
          const userResponse = await getUserId();
          localStorage.setItem('userId', userResponse?.userId);
        }
        setLoading(false);
        navigate('/dashboard');
      } catch (error: any) {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          handleClick({ vertical: 'top', horizontal: 'center' })();
        } else {
          console.error('Error:', error);
        }
      }
    }
  };

  const isButtonDisabled = !username || !password || usernameError || passwordError;

  // const loginButtonClick = async (event: React.FormEvent) => {};
  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
    i18n.changeLanguage(event.target.value);
  };

  const handleClick = (newState: SnackbarOrigin) => () => {
    console.log('c');
    setState({ ...newState, openModal: true });
  };

  const handleClose = () => {
    setState({ ...state, openModal: false });
  };
  const action = (
    <React.Fragment>
      <Typography>The username or password you enterred is incorrect</Typography>

      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  return (
    <form onSubmit={handleFormSubmit}>
      <Box display="flex" flexDirection="column" bgcolor={'black'} minHeight={'100vh'}>
        {loading && <Loader showBackdrop={true} loadingText={t('LOADING')} />}
        <Box
          display={'flex'}
          // flexGrow={1}
          bgcolor="black"
          overflow="auto"
          alignItems={'center'}
          justifyContent={'center'}
          zIndex={99}
          sx={{ margin: '32px 0' }}>
          <img src={appLogo2} />
        </Box>
        <Box
          flexGrow={1}
          display={'flex'}
          bgcolor="white"
          overflow="auto"
          height="auto"
          borderRadius={'2rem 2rem 0 0'}
          zIndex={99}
          justifyContent={'center'}
          p={'2rem'}>
          <Box position={'relative'}>
            <Box mt={'0.5rem'}>
              <FormControl sx={{ m: '2rem 0 1rem' }}>
                <Select
                  className="SelectLanguages"
                  value={language}
                  onChange={handleChange}
                  displayEmpty
                  style={{
                    borderRadius: '0.5rem',
                    color: theme.palette.warning['200'],
                    width: 'auto',
                    marginBottom: '0rem'
                  }}>
                  {config?.languages.map((lang) => (
                    <MenuItem value={lang.code} key={lang.code}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box marginY={'1rem'}>
              <FormControl variant="outlined" fullWidth={true} className="CssTextField">
                <InputLabel htmlFor="outlined-adornment-username">
                  {t('LOGIN_PAGE.USERNAME')}
                </InputLabel>
                <OutlinedInput
                  type={'text'}
                  label={t('LOGIN_PAGE.USERNAME')}
                  placeholder={t('LOGIN_PAGE.USERNAME_PLACEHOLDER')}
                  value={username}
                  onChange={handleUsernameChange}
                  error={usernameError}
                />
              </FormControl>
            </Box>
            <Box marginY={'1rem'}>
              <FormControl variant="outlined" className="CssTextField">
                <InputLabel htmlFor="outlined-adornment-password">
                  {t('LOGIN_PAGE.PASSWORD')}
                </InputLabel>
                <OutlinedInput
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label={t('LOGIN_PAGE.PASSWORD')}
                  placeholder={t('LOGIN_PAGE.PASSWORD_PLACEHOLDER')}
                  value={password}
                  onChange={handlePasswordChange}
                  error={passwordError}
                />
              </FormControl>
            </Box>

            <Box
              alignContent={'center'}
              textAlign={'center'}
              marginTop={'1rem'}
              bottom={'1rem'}
              width={'100%'}>
              <Button
                variant="contained"
                type="submit"
                fullWidth={true}
                // onClick={(event) => loginButtonClick(event)}
                disabled={isButtonDisabled}>
                {t('LOGIN_PAGE.LOGIN')}
              </Button>
            </Box>
          </Box>
        </Box>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openModal}
          onClose={handleClose}
          className="alert"
          autoHideDuration={5000}
          key={vertical + horizontal}
          action={action}
        />
      </Box>
    </form>
  );
};

export default LoginPage;
