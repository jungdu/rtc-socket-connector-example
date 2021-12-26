interface UploadFile {
	type: "UploadFile";
	fileName: string;
}

interface StartDownloadFile {
	type: "StartDownloadFile";
	fileName: string;
}

export type DataChannelMessages =
	| UploadFile
	| StartDownloadFile;
