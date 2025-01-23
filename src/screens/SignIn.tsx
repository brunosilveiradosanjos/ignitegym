import {
  VStack,
  Image,
  Center,
  Text,
  Heading,
  ScrollView,
  useToast,
} from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import * as yup from 'yup'

import { Input } from '@components/Input'

import BackgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { Button } from '@components/Button'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// Context
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'
import { useState } from 'react'

type FormDataProps = {
  email: string
  password: string
}

const signInSchema = yup.object({
  email: yup.string().required('E-mail is required').email('Invalid e-mail'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'The password must have at least 6 digits'),
})

export function SignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const toast = useToast()
  const { signIn } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  })

  const navigator = useNavigation<AuthNavigatorRoutesProps>()

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true)
      await signIn(email, password)
      return toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            description={'Successfully logged in'}
            onClose={() => toast.close(id)}
          />
        ),
      })
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      const isAppError = error instanceof AppError
      const description = isAppError
        ? error?.message
        : 'Login failed. Try again later'
      return toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title="Error"
            description={description}
            onClose={() => toast.close(id)}
          />
        ),
      })
    }
  }

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
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors?.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Password"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors?.password?.message}
                  onSubmitEditing={handleSubmit(handleSignIn)}
                  returnKeyType="send"
                  secureTextEntry
                />
              )}
            />

            <Button
              title="Sign In"
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
            />
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
