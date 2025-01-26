import { useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { ScreenHeader } from '@components/ScheenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { ToastMessage } from '@components/ToastMessage'

import { Center, Heading, Text, useToast, VStack } from '@gluestack-ui/themed'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

type FormDataProps = {
  name: string
  email: string
  password: string
  old_password: string
  confirm_password: string
}
const profileSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(10, 'The name must have at least 10 characters'), // Adjusted from 'digits' to 'characters'
  password: yup
    .string()
    .min(6, 'The password must have at least 6 characters')
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref('password'), null], 'Passwords are not the same')
    .when('password', {
      is: (password: any) => !!password,
      then: (schema) =>
        schema
          .nullable()
          .required('Provide password confirmation')
          .transform((value) => (!!value ? value : null)),
    }),
})
export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [userPhoto, setUserPhoto] = useState()
  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  })

  async function handleUserPhotoselect() {
    try {
      const dataPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        // base64: true,
      })

      if (dataPhoto.canceled) return
      const selectedPhoto = dataPhoto.assets[0]
      if (selectedPhoto.uri) {
        const selectedPhotoInfo = (await FileSystem.getInfoAsync(
          selectedPhoto.uri
        )) as {
          size: number
        }

        if (
          selectedPhotoInfo.size &&
          selectedPhotoInfo.size / 1024 / 1024 > 5
        ) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Error"
                description="This image is too large. Please select one up to 5MB in size."
                onClose={() => toast.close(id)}
              />
            ),
          })
        }

        const fileExtension = selectedPhoto.uri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`
            .toLocaleLowerCase()
            .replaceAll(' ', ''),
          uri: selectedPhoto.uri,
          type: `${selectedPhoto.type}/${fileExtension}`,
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdateResponse = await api.patch(
          '/users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        const updatedUser = user
        updatedUser.avatar = avatarUpdateResponse.data.avatar
        updateUserProfile(updatedUser)

        return toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              description={'Avatar successfully updated'}
              onClose={() => toast.close(id)}
            />
          ),
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      return toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            description={'Profile successfully updated'}
            onClose={() => toast.close(id)}
          />
        ),
      })
    } catch (error) {
      console.log(error)
      const isAppError = error instanceof AppError
      const description = isAppError
        ? error?.message
        : 'Update profile failed. Try again later'
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
      setIsUpdating(false)
    }
  }
  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={
              user.avatar
                ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                : defaultUserPhotoImg
            }
            size="xl"
            alt="Imagem do usuário"
          />

          <TouchableOpacity onPress={handleUserPhotoselect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Change Photo
            </Text>
          </TouchableOpacity>
          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Name"
                  bg="$gray600"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="E-mail"
                  bg="$gray600"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                  isReadOnly
                />
              )}
            />
          </Center>
          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Change Password
          </Heading>
          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Old Password"
                  bg="$gray600"
                  onChangeText={onChange}
                  errorMessage={errors.old_password?.message}
                  secureTextEntry
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="New Password"
                  bg="$gray600"
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                  secureTextEntry
                />
              )}
            />
            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirm new password"
                  bg="$gray600"
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                  secureTextEntry
                />
              )}
            />
            <Button
              title="Update"
              onPress={handleSubmit(handleProfileUpdate)}
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}
