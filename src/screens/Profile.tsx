import { useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { ScreenHeader } from '@components/ScheenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { ToastMessage } from '@components/ToastMessage'

import { Center, Heading, Text, useToast, VStack } from '@gluestack-ui/themed'

export function Profile() {
  const [userPhoto, setUserPhoto] = useState(
    'https://github.com/brunosilveiradosanjos.png'
  )

  const toast = useToast()

  async function handleUserPhotoselect() {
    try {
      const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        aspect: [4, 4],
        // base64: true,
      })

      if (selectedPhoto.canceled) return
      const photoURI = selectedPhoto.assets[0].uri
      if (photoURI) {
        const selectedPhotoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number
        }

        if (
          selectedPhotoInfo.size &&
          selectedPhotoInfo.size / 1024 / 1024 > 1
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
        setUserPhoto(selectedPhoto.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: userPhoto }}
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
            <Input placeholder="Name" bg="$gray600" />
            <Input value="bruno@email.com" bg="$gray600" isReadOnly />
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
            <Input placeholder="Old Password" bg="$gray600" secureTextEntry />
            <Input placeholder="New Password" bg="$gray600" secureTextEntry />
            <Input
              placeholder="Confirm new password"
              bg="$gray600"
              secureTextEntry
            />
            <Button title="Update" />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}
