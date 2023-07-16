import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody } from "@chakra-ui/react"
import { useRef, ReactNode } from "react"
import { GiHamburgerMenu } from "react-icons/gi"

const DrawerMenu = ({children}: {children: ReactNode}) => {
    // useDisclosureで閉じ・開きの管理
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null)
  
    return (
      <>
        {/* ハンバーガーアイコン部分 */}
        <Button ref={btnRef} onClick={onOpen}>
          <GiHamburgerMenu/>
        </Button>
        {/* Drawer部分 */}
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          placement="left"
          finalFocusRef={btnRef}
          size="xs"
        >
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader fontSize="32px">Menu</DrawerHeader>
              <DrawerBody>
                {children} {/*　先程作ったNavigatorを利用 */}
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </>
    )
}

export default DrawerMenu