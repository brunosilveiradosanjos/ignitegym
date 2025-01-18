import { ScrollView, TouchableOpacity } from 'react-native'

import { ScreenHeader } from '@components/ScheenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Input } from '@components/Input'
import { Button } from '@components/Button'

import { Center, Heading, Text, VStack } from '@gluestack-ui/themed'

export function Profile() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: 'https://github.com/brunosilveiradosanjos.png' }}
            size="xl"
            alt="Imagem do usuário"
          />

          <TouchableOpacity>
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
