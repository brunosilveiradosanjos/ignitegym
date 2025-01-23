import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { Box } from '@gluestack-ui/themed'
import { AppRoutes } from '@routes/app.routes'
import { AuthRoutes } from '@routes/auth.routes'

import { gluestackUIConfig } from '../../config/gluestack-ui.config'
// Contexts
import { useAuth } from '@hooks/useAuth'
import { Loading } from '@components/Loading'

export function Routes() {
  const { user, isLoadingUserStorageData } = useAuth()
  const theme = DefaultTheme
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700

  if (isLoadingUserStorageData) return <Loading />

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
