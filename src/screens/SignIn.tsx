import {
  VStack,
  Image,
  Center,
  Text,
  Heading,
  ScrollView,
} from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'

import { Input } from '@components/Input'

import BackgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { Button } from '@components/Button'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

export function SignIn() {
  const navigator = useNavigation<AuthNavigatorRoutesProps>()
  function handleSignUp() {
    navigator.navigate('signUp')
  }
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          w="$full"
          h={624}
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="People Traning"
          position="absolute"
        />
        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />
            <Text color="$gray100" fontSize="$sm">
              Train your mind and your body.
            </Text>
          </Center>
          <Center gap="$2">
            <Heading color="$gray100">Access your account</Heading>
            <Input
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input placeholder="Password" secureTextEntry />
            <Button title="Sign In" />
          </Center>
          <Center flex={1} justifyContent="flex-end" gap="$2">
            <Text color="$gray100" fontSize="$sm" fontFamily="$body">
              Don't you have access yet?
            </Text>
            <Button title="Sign Up" variant="outline" onPress={handleSignUp} />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  )
}
