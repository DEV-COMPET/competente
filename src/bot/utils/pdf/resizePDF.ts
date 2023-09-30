import { PDFDocument, ParseSpeeds } from "pdf-lib";

const pageSizes = {
    a4: {
        width: 594.96,
        height: 841.92,
    },
    letter: {
        width: 612,
        height: 792,
    },
    certificado: {
        width: 291,
        height: 210
    }
};

export async function resizeToPageFormat (snapshot: Uint8Array): Promise<Uint8Array> {
    // Load the original PDF file
    const pdfDoc = await PDFDocument.load(snapshot, {
        parseSpeed: ParseSpeeds.Fastest,
    });

    const new_size = pageSizes['certificado'];
    const new_size_ratio = Math.round((new_size.width / new_size.height) * 100);

    // Get the first page in the PDF
    const pages = pdfDoc.getPages();

    pages.forEach(page => {
        const { width, height } = page.getMediaBox();
        const size_ratio = Math.round((width / height) * 100);
        // If ratio of original and new format are too different we can not simply scale (more that 1%)
        if (Math.abs(new_size_ratio - size_ratio) > 1) {
            // Change page size
            page.setSize(new_size.width, new_size.height);
            const scale_content = Math.min(new_size.width / width, new_size.height / height);
            // Scale content
            page.scaleContent(scale_content, scale_content);
            const scaled_diff = {
                width: Math.round(new_size.width - scale_content * width),
                height: Math.round(new_size.height - scale_content * height),
            };
            // Center content in new page format
            page.translateContent(Math.round(scaled_diff.width / 2), Math.round(scaled_diff.height / 2));
        } else {
            page.scale(new_size.width / width, new_size.height / height);
        }
    });

    // Serialize the modified document
    return pdfDoc.save();
}