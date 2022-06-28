import byteSize from "byte-size";

export const fileName = (file, number = 10) => {
  const name =
    file.name?.split(".")[0].length > number ? (
      <>{file.name.split(".")[0].slice(0, number)}...</>
    ) : (
      file.name?.split(".")[0]
    );

  return name;
};

export const path = (currentFolder) => {
  let paths = "";
  currentFolder.path.forEach((item) => {
    paths += `${item.name}/`;
  });
  paths += currentFolder.name;
  console.log({ paths });
  return paths;
};

export const memory = (type, sizes) => {
  let size = 0;
  let total = 0;
  sizes.forEach((item) => {
    if (item._id?.includes(type)) {
      size += item.total;
      total += item.totalFiles;
    }
  });

  return { size, total };
};
