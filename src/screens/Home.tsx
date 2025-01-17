import { useState } from 'react'
import { FlatList } from 'react-native'
import { Heading, HStack, VStack, Text } from '@gluestack-ui/themed'

import { HomeHeader } from '@components/HomeHeader'
import { Group } from '@components/Group'
import { ExerciseCard } from '@components/ExerciseCard'

export function Home() {
  const [exercises, setExercises] = useState([
    'Lat pulldown',
    'Bent-over row:',
    'One-arm dumbbell row',
    'Deadlift',
  ])
  const [groups, setGroups] = useState([
    'Back',
    'Shoulders',
    'Chest',
    'Biceps',
    'Triceps',
    'Legs',
  ])
  const [groupSelected, setGroupSelected] = useState('Back')
  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={
              groupSelected.toLocaleLowerCase === item.toLocaleLowerCase
            }
            onPress={() => {
              setGroupSelected(item)
            }}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 44, maxHeight: 44, minHeight: 44 }}
      />
      <VStack px="$8" flex={1}>
        <HStack justifyContent="space-between" mb="$5" alignItems="center">
          <Heading color="$gray200" fontSize="$md">
            Exercises
          </Heading>
          <Text color="$gray200" fontSize="$sm" fontFamily="$body">
            {exercises.length}
          </Text>
        </HStack>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <ExerciseCard />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  )
}
