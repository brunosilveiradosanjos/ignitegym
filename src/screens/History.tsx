import { useState } from 'react'
import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScheenHeader'
import { Heading, VStack, Text } from '@gluestack-ui/themed'
import { SectionList } from 'react-native'

export function History() {
  // const [exercises, setExercises] = useState([])
  const [exercises, setExercises] = useState([
    {
      title: new Date().toDateString(),
      data: ['Lat pulldown', 'One-arm dumbbell row'],
    },
    {
      title: new Date().toDateString(),
      data: ['Lat pulldown', 'One-arm dumbbell row'],
    },
    {
      title: new Date().toDateString(),
      data: ['Lat pulldown', 'One-arm dumbbell row'],
    },
    {
      title: new Date().toDateString(),
      data: ['Lat pulldown'],
    },
    {
      title: new Date().toDateString(),
      data: ['Lat pulldown'],
    },
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Exercise History" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading color="$gray200" fontSize="$md" mt="$10" mb="$3">
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Text color="$gray200" textAlign="center">
            No exercises have been recorded yet. {'\n'}
            Shall we do some exercises today?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
