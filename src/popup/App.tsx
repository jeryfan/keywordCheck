


import './App.css'
import { ChakraProvider } from "@chakra-ui/react"
import Layout from '@/popup/conponents/layout'

function App() {

    return (
        <>
            <ChakraProvider>
                <Layout />
            </ChakraProvider>

        </>
    )
}

export default App
