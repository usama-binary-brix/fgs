'use client';

import { useParams } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useGetQRCodeInventoryByIdQuery } from '@/store/services/api';

const SECRET_KEY = 'my_secret_key_123';

const Page = () => {
  const { id } = useParams();
  const [decryptedId, setDecryptedId] = useState('');
const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof id === 'string') {
      try {
        
        const decodedURI = decodeURIComponent(id);
        const bytes = CryptoJS.AES.decrypt(decodedURI, SECRET_KEY);
        const originalId = bytes.toString(CryptoJS.enc.Utf8);
        setDecryptedId(originalId);
        setLoading(false)
      } catch (error) {
        setLoading(false)

        console.error('Decryption failed:', error);
        setDecryptedId('Invalid or corrupted ID');
      }
    }
  }, [id]);

  const {
    data: inventoryData,
    error,
    isLoading,
    refetch,
  } = useGetQRCodeInventoryByIdQuery(decryptedId!, {
    skip: !decryptedId,
  });

  
  const getFileTypeIcon = (fileUrl: string): string => {
    if (!fileUrl) return '/images/filesicon/docss.png';
    const lowerCaseFileUrl = fileUrl.toLowerCase();

    if (lowerCaseFileUrl.endsWith('.pdf')) {
      return '/images/filesicon/pdff.png';
    }
    if (lowerCaseFileUrl.endsWith('.doc') || lowerCaseFileUrl.endsWith('.docx')) {
      return '/images/filesicon/docss.png';
    }
    if (lowerCaseFileUrl.endsWith('.xls') || lowerCaseFileUrl.endsWith('.xlsx')) {
      return '/images/filesicon/xlsx.png';
    }
    if (lowerCaseFileUrl.match(/\.(jpg|jpeg|png|gif|svg|webp|JPG|jfif)$/)) {
      return fileUrl;
    }
    return '/images/filesicon/docss.png';
  };

  const getFileNameFromUrl = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split('/');
      return pathParts[pathParts.length - 1];
    } catch {
      return url.split('/').pop() || 'file';
    }
  };

  if (isLoading || loading) return <>
    <div className="py-6 flex items-center justify-center h-[80vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  </>;


  return (
    <div className="min-h-screen bg-white text-center text-sm">
      {/* Logo Header */}
      <div className="bg-black py-4 mb-6">
        {/* <img src="/logo.png" alt="FGS Logo" className="mx-auto h-10" /> */}
        <Image src="/images/logo/logo.svg" alt="Logo" width={200} height={200} className='mx-auto' />

      </div>

      {/* Inventory ID */}
      <div className='px-4'>
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-primary text-2xl font-bold">{inventoryData?.inventory?.listing_number}</h2>
          <p className="text-gray-500 mt-1">Inventory Details</p>
        </div>
        {/* Details */}
        <div className="bg-white shadow rounded-lg p-4 mb-4 text-left">
          <h3 className="font-semibold text-gray-700 mb-2">Details</h3>
          <div className="grid grid-cols-2 gap-y-2 text-gray-600">
            <div>Category: {inventoryData?.inventory?.category?.name ?? 'N/A'}</div>
            <div>Subcategory: {inventoryData?.inventory?.subcategory?.name ?? 'N/A'}</div>
            <div>Year: {inventoryData?.inventory?.year ?? 'N/A'}</div>
            <div>Make: {inventoryData?.inventory?.make ?? 'N/A'}</div>
            <div>Model: {inventoryData?.inventory?.model ?? 'N/A'}</div>
            <div>Serial No.: {inventoryData?.inventory?.serial_no ?? 'N/A'}</div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white shadow rounded-lg p-4 mb-4 text-left">
          <h3 className="font-semibold text-gray-700 mb-2">Specifications</h3>
          <div className="grid grid-cols-2 gap-y-2 text-gray-600">
            <div>Length: {inventoryData?.inventory?.length ?? 'N/A'}</div>
            <div>Height: {inventoryData?.inventory?.height ?? 'N/A'}</div>
            <div>Width: {inventoryData?.inventory?.width ?? 'N/A'}</div>
            <div>Weight: {inventoryData?.inventory?.weight ?? 'N/A'}</div>
            <div>Hours: {inventoryData?.inventory?.hours ?? 'N/A'}</div>
          </div>
        </div>

     
<div className="bg-white shadow rounded-lg p-4 mb-8 text-left">
  <h3 className="font-semibold text-gray-700 mb-4">Attached Files</h3>
  <div className="grid grid-cols-3 gap-2">
    {inventoryData?.inventory?.files?.length > 0 ? (
      inventoryData.inventory.files.map((file: any, i: number) => {
        const fileUrl = file.file;
        const iconUrl = getFileTypeIcon(fileUrl);
        const fileName = getFileNameFromUrl(fileUrl);

        return (
          <div key={file.id} className="text-center">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              title={fileName}
            >
              <img
                src={iconUrl}
                alt={fileName}
                className="w-full h-24 object-contain rounded-md border"
              />
              <p className="mt-2 text-xs truncate text-gray-600">{fileName}</p>
            </a>
          </div>
        );
      })
    ) : (
      <p className="col-span-3 text-gray-400">No files uploaded.</p>
    )}
  </div>
</div>


        {/* Footer */}
        <div className="text-gray-400 text-xs">
          <a href="https://firstgroupservices.com" className="text-primary hover:underline">
            firstgroupservices.com
          </a>
          <p className="mt-1">&copy; 2025 First Group Services Inc. | All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};

export default Page;
