import { useEffect } from "react"
import downloadQRCode from "../../../utils/downloadQRCode"
import { useSearchParams } from 'next/navigation'

const Page = () => {
    const searchParams = useSearchParams()

    useEffect(() => {
        downloadQRCode(searchParams.get("id")!, searchParams.get("token")!)
    },[searchParams])

    return (<>
        <p className="ubuntu">AA</p>
        <style jsx>{`
            .ubuntu {
                font-family: 'Ubuntu', sans-serif;
            }
        `}    
        </style>
    </>
    )
}

export default Page