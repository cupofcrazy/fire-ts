import { createContext, useContext, useState } from 'react';

interface ToastProps {
  show: ({ message }: ToastMessageProps) => void
}

type ToastMessageProps = {
  id: string;
  message: string
}

const ToastContext = createContext({} as ToastProps)

export const ToastProvider: React.FC = ({ children }) => {
  const [toastList, setToastList] = useState<ToastMessageProps[]>([])
  
  const show = async ({ message, id }: ToastMessageProps) => {
    console.log('Adding toast')
    setToastList([...toastList, { message, id }])
    await wait(3000)
    console.log('Toast added')
    setToastList(toastList.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{
      show: show
    }}>
      <div style={{
        position: 'fixed',
        right: '10px',
        bottom: '10px',
        zIndex: '1000',
      }}>
        {toastList.map((toast) => (
          <div key={toast.id} id={toast.id}>
            <p>{toast.message}</p>
          </div>
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)!

const wait = (duration: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, duration)
  })
}