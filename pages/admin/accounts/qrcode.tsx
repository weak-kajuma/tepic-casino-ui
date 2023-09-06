'use client'
// import downloadQRCode from "../../../components/downloadQRCode"
import dynamic from 'next/dynamic'

const DownloadQRCode = dynamic(() => import("../../../components/downloadQRCode"), {ssr: false})

const Page = () => {
    return (
    <DownloadQRCode/>
    )
}

export default Page