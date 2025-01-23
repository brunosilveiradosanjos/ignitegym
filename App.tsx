// Native
import { StatusBar } from 'react-native'
// Components
import { Loading } from '@components/Loading'
// Configs
import { GluestackUIProvider } from '@gluestack-ui/themed'
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { config } from './config/gluestack-ui.config'
// Routes
import { Routes } from '@routes/index'
// Contexts
import { AuthContextProvider } from '@contexts/AuthContext'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular })
  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </GluestackUIProvider>
  )
}
