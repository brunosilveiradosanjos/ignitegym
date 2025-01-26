import { Heading, HStack, Icon, Text, VStack } from '@gluestack-ui/themed'
import { LogOut } from 'lucide-react-native'

import { UserPhoto } from '@components/UserPhoto'
import { useAuth } from '@hooks/useAuth'

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'
import { TouchableOpacity } from 'react-native'
import { api } from '@services/api'

export function HomeHeader() {
  const { user, signOut } = useAuth()

  function handleSignOut() {
    signOut()
  }
  return (
    <HStack
      bgColor="$gray600"
      pt="$16"
      pb="$5"
      px="$8"
      alignItems="center"
      gap="$4"
    >
      <UserPhoto
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : defaultUserPhotoImg
        }
        alt="User image"
        w="$16"
        h="$16"
      />
      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">
          Hello,
        </Text>
        <Heading color="$gray100" fontSize="$md">
          {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={handleSignOut}>
        <Icon as={LogOut} color="$gray200" size="xl" />
      </TouchableOpacity>
    </HStack>
  )
}
