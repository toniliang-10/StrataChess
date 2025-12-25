"use client"
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Cloudinary components with no SSR to avoid prerender issues
const CldUploadWidget = dynamic(
    () => import('next-cloudinary').then(mod => mod.CldUploadWidget),
    { ssr: false }
)
const CldImage = dynamic(
    () => import('next-cloudinary').then(mod => mod.CldImage),
    { ssr: false }
)

interface CloudinaryResult {
    public_id: string;
}

const UploadPage = () => {
    const [publicId, setPublicId] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div>Loading...</div>;
    }
    
    return (
        <>
            { publicId && 
                <CldImage src={publicId} width={270} height={180} alt="uploaded image" />
            }
            <CldUploadWidget 
                uploadPreset="tlcdnr30"
                onSuccess={ (result) => {
                    const info = result.info as CloudinaryResult;
                    setPublicId(info.public_id);
                }}>
                { ({open}) => 
                    <button 
                        className='btn btn-primary'
                        onClick={() => { open() }}>Upload
                    </button>
                }
            </CldUploadWidget>
        </>
    )
}

export default UploadPage