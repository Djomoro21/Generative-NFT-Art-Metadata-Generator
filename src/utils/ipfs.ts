export async function pinFileToIPFS(formData: FormData, jwt: string) {
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to upload to IPFS");
    }

    return await res.json();
}

export function createIPFSFormData(files: File[], folderName: string, pinataMetadataName: string) {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("file", file, `${folderName}/${file.name}`);
    });
    formData.append("pinataMetadata", JSON.stringify({ name: pinataMetadataName }));
    return formData;
}
