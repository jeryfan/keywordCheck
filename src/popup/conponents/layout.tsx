

import { Button, Flex, Box, Textarea } from '@chakra-ui/react'
import { useRef, useState } from "react"

export default function Layout() {
    const inpRef = useRef<HTMLTextAreaElement>(null)
    const [result, setResult] = useState<string | undefined>("")
    const clickHandle = () => {
        setResult(inpRef?.current?.value)
    }
    return (
        <Flex w="400px" h="350px">
            <Box h="100%" w="40%" ml={0} boxSizing="border-box" border="1px solid black">
                <Textarea placeholder='请输入文本' w="100%" h="100%" overflow={"auto"} ref={inpRef} />
            </Box>
            <Button m="auto" onClick={clickHandle}>转换</Button>
            <Box h="100%" w="40%" mr={0} boxSizing="border-box" border="1px solid black">
                <Textarea w="100%" h="100%" overflow={"auto"} value={result} />
            </Box>
        </Flex>
    )

}