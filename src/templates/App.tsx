import {
  ChakraProvider,
  Container,
  Grid,
  Heading,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { FirebaseOptions } from 'firebase/app';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Firebase } from '../components/Firebase';
import { Link } from '../components/Link';
import { pages } from '../router';
import { readEnvironmentVariable } from '../util/readEnvironmentVariable';

const firebaseConfig = readEnvironmentVariable<FirebaseOptions>(
  'FIREBASE_CONFIGURATION'
);

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode !== 'dark') {
      toggleColorMode();
    }
  }, [colorMode]);

  return (
    <Grid templateColumns="auto 1fr" alignItems="baseline" marginBottom={8}>
      <Heading as="h1">Noburu</Heading>
      <Grid
        as="nav"
        justifyContent="center"
        templateColumns="repeat(3, auto)"
        gap={['var(--chakra-space-2)', 'var(--chakra-space-8)']}
      >
        {pages.map((x) => (
          // "to" is a property of RouterLink (embeded in Link)
          // Chakra knows that but for some reason typescript complains
          // @ts-ignore see above
          <Link key={x.path} to={x.path}>
            <Text textAlign="center">{x.title}</Text>
          </Link>
        ))}
      </Grid>
    </Grid>
  );
}

export function App() {
  return (
    <Firebase config={firebaseConfig}>
      <ChakraProvider resetCSS>
        <Header />
        <Container paddingBottom="var(--chakra-space-16)" maxW="45rem">
          <VStack gap="var(--chakra-space-2)" align="stretch">
            <Outlet />
          </VStack>
        </Container>
      </ChakraProvider>
    </Firebase>
  );
}
