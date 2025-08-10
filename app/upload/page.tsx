"use client"
import React from 'react'
import { CldUploadWidget, CldImage } from 'next-cloudinary'
import { useState } from 'react'

interface CloudinaryResult {
    public_id: string;
}

const UploadPage = () => {

    const [publicId, setPublicId] = useState('');
    
  return (
    <>
        { publicId && 
            <CldImage src={publicId}  width={270} height={180} alt = "uploaded image" />
        }
        <CldUploadWidget 
            uploadPreset="tlcdnr30"     // required
            onSuccess={ (result, widget) => {
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