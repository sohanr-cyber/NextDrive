const dumyData = [
  {
    _id: "62b710a5294ae0d8a6ff12d1",
    name: "drive clone.png",
    slug: "drive clone.png0.8737077839523537",
    url: "https://firebasestorage.googleapis.com/v0/b/nextjs-drive.appspot.com/o/another%2Fdrive%20clone.png0.8737077839523537?alt=media&token=83ced035-e14e-4680-ba46-84b6460ea221",
    size: 382263,
    type: "image/png",
    createdBy: "62a00a2d62b3ebaa28f1dae0",
    parentFolder: "62b505a6d019310e73b757b4",
    stared: false,
    trashed: false,
    createdAt: "2022-06-25T13:41:57.422Z",
    updatedAt: "2022-06-25T13:41:57.422Z",
    __v: 0,
  },
  {
    _id: "62b71095294ae0d8a6ff12c8",
    name: "PH 203-Mathematical Physics-20220618T043413Z-001.zip",
    slug: "PH 203-Mathematical Physics-20220618T043413Z-001.zip0.40552833334163085",
    url: "https://firebasestorage.googleapis.com/v0/b/nextjs-drive.appspot.com/o/another%2FPH%20203-Mathematical%20Physics-20220618T043413Z-001.zip0.40552833334163085?alt=media&token=d05d8442-3284-4c2f-a595-37eec6c50b92",
    size: 26226641,
    type: "application/x-zip-compressed",
    createdBy: "62a00a2d62b3ebaa28f1dae0",
    parentFolder: "62b505a6d019310e73b757b4",
    stared: false,
    trashed: false,
    createdAt: "2022-06-25T13:41:41.729Z",
    updatedAt: "2022-06-25T13:41:41.729Z",
    __v: 0,
  },
  {
    _id: "62b71073294ae0d8a6ff12c4",
    name: "Salatullah Selamullah - The Most Beautiful Islamic Bosnian Nasheed-[onlinevideoconverter.com].mp3",
    slug: "Salatullah Selamullah - The Most Beautiful Islamic Bosnian Nasheed-[onlinevideoconverter.com].mp30.33615480952756505",
    url: "https://firebasestorage.googleapis.com/v0/b/nextjs-drive.appspot.com/o/another%2FSalatullah%20Selamullah%20-%20The%20Most%20Beautiful%20Islamic%20Bosnian%20Nasheed-%5Bonlinevideoconverter.com%5D.mp30.33615480952756505?alt=media&token=0c7fac4b-b805-4528-bff1-fd2c8a73adfb",
    size: 3497420,
    type: "audio/mpeg",
    createdBy: "62a00a2d62b3ebaa28f1dae0",
    parentFolder: "62b505a6d019310e73b757b4",
    stared: false,
    trashed: false,
    createdAt: "2022-06-25T13:41:07.964Z",
    updatedAt: "2022-06-25T13:41:07.964Z",
    __v: 0,
  },
  {
    _id: "62b71064294ae0d8a6ff12c0",
    name: "Salatullah Selamullah - The Most Beautiful Islamic Bosnian Nasheed-[onlinevideoconverter.com].mp3",
    slug: "Salatullah Selamullah - The Most Beautiful Islamic Bosnian Nasheed-[onlinevideoconverter.com].mp30.036994537539855044",
    url: "https://firebasestorage.googleapis.com/v0/b/nextjs-drive.appspot.com/o/another%2FSalatullah%20Selamullah%20-%20The%20Most%20Beautiful%20Islamic%20Bosnian%20Nasheed-%5Bonlinevideoconverter.com%5D.mp30.036994537539855044?alt=media&token=106b8f0e-a8e2-4c24-a30c-b636315dab5e",
    size: 3497420,
    type: "audio/mpeg",
    createdBy: "62a00a2d62b3ebaa28f1dae0",
    parentFolder: "62b505a6d019310e73b757b4",
    stared: false,
    trashed: false,
    createdAt: "2022-06-25T13:40:52.400Z",
    updatedAt: "2022-06-25T13:40:52.400Z",
    __v: 0,
  },
  {
    _id: "62b70f5a294ae0d8a6ff129c",
    name: "Lec 01(Online)-One dimensional wave.pdf",
    slug: "Lec 01(Online)-One dimensional wave.pdf0.0454065441709377",
    url: "https://firebasestorage.googleapis.com/v0/b/nextjs-drive.appspot.com/o/another%2FLec%2001(Online)-One%20dimensional%20wave.pdf0.0454065441709377?alt=media&token=de11c27b-002b-482f-8f39-8421799f26c2",
    size: 4379361,
    type: "application/pdf",
    createdBy: "62a00a2d62b3ebaa28f1dae0",
    parentFolder: "62b505a6d019310e73b757b4",
    stared: false,
    trashed: false,
    createdAt: "2022-06-25T13:36:26.904Z",
    updatedAt: "2022-06-25T13:36:26.904Z",
    __v: 0,
  },
];
let recentFiles = [];
const maxFiles = 3;

const addToRecent = (file) => {
  if (recentFiles.length > maxFiles) {
    recentFiles.pop();
  }
  recentFiles = [file, ...recentFiles];
  return recentFiles;
};

addToRecent(dumyData[0]);
addToRecent(dumyData[1]);
addToRecent(dumyData[1]);
addToRecent(dumyData[3]);

console.log(addToRecent(dumyData[3]).length);
