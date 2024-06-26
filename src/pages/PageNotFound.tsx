import { Box, Container } from '@mui/material';
import PageNotFoundIcon from '/error-404.png';
import Header from '../components/Header';

function PageNotFound() {
  return (
    <Box minHeight={'100vh'}>
      <Header />
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} minHeight={'85px'}>
        <img alt="Page Not Found" width={'350px'} height={'350px'} src={PageNotFoundIcon} />
      </Box>
    </Box>
  );
}

export default PageNotFound;
