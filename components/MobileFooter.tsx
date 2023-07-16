import { AddIcon, RepeatClockIcon } from "@chakra-ui/icons"
import {SimpleGrid, chakra} from "@chakra-ui/react"

export const MobileFooter = () => {
    return (
        <chakra.footer py={4} bgColor={"blue.600"} bottom={0} pos={"absolute"}>
            <SimpleGrid column={[1,2]} spacing="10px" margin="10px">
                <RepeatClockIcon />
                <AddIcon />
            </SimpleGrid>
        </chakra.footer>
    )
}