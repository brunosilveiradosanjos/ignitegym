import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import {
  Heading,
  HStack,
  Image,
  Text,
  VStack,
  Icon,
} from '@gluestack-ui/themed'

type Props = TouchableOpacityProps & {}

export function ExerciseCard({ ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="$gray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{
            uri: 'https://www.dmoose.com/cdn/shop/articles/feature-image_5640325e-b598-4308-a2e5-cd92450120c7.jpg?v=1676996563',
          }}
          alt="Exercise image"
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />
        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            Front lat pulldown{' '}
          </Heading>
          <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>
            3 sets of 12 reps
          </Text>
        </VStack>
        <Icon as={ChevronRight} color="$gray300" />
      </HStack>
    </TouchableOpacity>
  )
}
