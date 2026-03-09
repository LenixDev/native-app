import { createContext, useContext, useState } from 'react'
import { Snackbar } from 'react-native-paper'

const SnackbarContext = createContext<(message: string) => void>(() => {})

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('')

  return (
    <SnackbarContext.Provider value={setMessage}>
      {children}
      <Snackbar visible={!!message} duration={2000}
        onDismiss={() => setMessage('')} 
        action={{
          label: 'Ok',
          onPress: () => { setMessage('') },
        }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => useContext(SnackbarContext)