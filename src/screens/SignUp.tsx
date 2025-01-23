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
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Input } from '@components/Input'

import BackgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { Button } from '@components/Button'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'
import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'

type FormDataProps = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

const signUpSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(10, 'The name must have at least 10 digits'),
  email: yup.string().required('E-mail is required').email('Invalid e-mail'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'The password must have at least 6 digits'),
  passwordConfirm: yup
    .string()
    .required('Password is required')
    .min(6, 'The password must have at least 6 digits')
    .oneOf([yup.ref('password'), ''], 'Passwords are not the same'),
})

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const toast = useToast()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  })

  const navigator = useNavigation<AuthNavigatorRoutesProps>()

  function handleSignIn() {
    navigator.navigate('signIn')
  }

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true)
      await api.post('/users', { name, email, password })
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            description="User has been successfully created"
            onClose={() => toast.close(id)}
          />
        ),
      })
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError
      const description = isAppError
        ? error?.message
        : 'Account creation failed. Try again later'
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
    } finally {
      setIsLoading(false)
    }
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

          <Center gap="$2" flex={1} justifyContent="flex-start">
            <Heading color="$gray100">Create Your Account</Heading>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Name"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors?.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
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
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors?.password?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="passwordConfirm"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Password Confirm"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors?.passwordConfirm?.message}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  returnKeyType="send"
                />
              )}
            />
            <Button
              title="Sign Up"
              onPress={handleSubmit(handleSignUp)}
              isLoading={isLoading}
            />
          </Center>
          <Button title="Sign In" variant="outline" onPress={handleSignIn} />
        </VStack>
      </VStack>
    </ScrollView>
  )
}
