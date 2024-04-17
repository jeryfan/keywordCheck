


import './App.css'
import { ChakraProvider } from "@chakra-ui/react"
import KeysTable from './conponents/Table'



function App() {

    return (
        <>
            <ChakraProvider>
                <KeysTable />
            </ChakraProvider>

        </>
    )
}

export default App
