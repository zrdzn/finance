import {Input} from "@chakra-ui/react";
import React, {useRef} from "react";

export const FileUpload = ({handleFile, children}: {
    handleFile: (file: File) => void
    children: React.ReactElement<{ onClick: (event: React.MouseEvent<HTMLElement>) => void }>
}) => {
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);

    const handleFileInput = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()

        hiddenFileInput.current?.click();
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileUploaded = event.target.files?.item(0) ?? null;
        if (fileUploaded != null) {
            handleFile(fileUploaded);
        }
    };

    return (
        <>
            {React.cloneElement(children, {onClick: handleFileInput})}
            <Input
                type={'file'}
                accept={'image/* .csv'}
                onChange={handleFileInputChange}
                ref={hiddenFileInput}
                style={{display: 'none'}}
            />
        </>
    )
}