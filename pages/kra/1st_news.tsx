import { PDFViewer } from "@react-pdf/renderer";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";

const PDFPage: NextPage = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            {isClient && (
                <Document file="/1st_news.pdf">
                    <Page pageNumber={1} />
                </Document>
            )}
        </>
    );
};

export default PDFPage;
