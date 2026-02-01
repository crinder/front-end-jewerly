import { React, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onFileSelected }) => {
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            onFileSelected(acceptedFiles); // Pasar el array completo de archivos
        }
    }, [onFileSelected]);

    const getClassNames = () => {
        const classes = ['dropzone'];
        const { isFocused, isDragAccept, isDragReject } = useDropzone();
        if (isFocused) classes.push('dropzone-focused');
        if (isDragAccept) classes.push('dropzone-accept');
        if (isDragReject) classes.push('dropzone-reject');
        return classes.join(' ');
    };

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/gif': [],
            'image/webp': [],
        },
        multiple: true
    });

    const getDropzoneText = () => {
        if (isDragAccept) {
            return <p className="dropzone-feedback">¡Suelta las imágenes aquí!</p>;
        }
        if (isDragReject) {
            return <p className="dropzone-feedback">Tipo de archivo no soportado</p>;
        }
        if (acceptedFiles.length > 0) {
            return <p>Archivos seleccionados: {acceptedFiles.length}</p>;
        }
        return <p>Arrastra imágenes aquí, o haz clic para seleccionarlas</p>;
    }

    return (
        <div className="category__dropzone">
            <div {...getRootProps({ className: getClassNames() })}>
                <input {...getInputProps()} />
                {getDropzoneText()}
            </div>
        </div>
    )
}

export default Dropzone;