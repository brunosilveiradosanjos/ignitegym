import { useCallback, useState } from 'react'
import { SectionList } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScheenHeader'
import { ToastMessage } from '@components/ToastMessage'
import { Loading } from '@components/Loading'
import { Heading, VStack, Text, useToast } from '@gluestack-ui/themed'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO'

export function History() {
  const [exercises, setExercises] = useState<Array<HistoryByDayDTO>>([])
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()

  async function fetchExerciseHistory() {
    try {
      setIsLoading(true)
      const response = await api.get('/history')
      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const description = isAppError ? error.message : "Couldn't load history"
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

  useFocusEffect(
    useCallback(() => {
      fetchExerciseHistory()
    }, [])
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Exercise History" />
      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
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
      )}
    </VStack>
  )
}
