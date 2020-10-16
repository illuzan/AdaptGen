const electron = require("electron");
const fs = require("fs");
const path = require("path");
const { dialog } = require("electron").remote;
const { shell } = window.require("electron");

const drawableBtn = document.getElementById("button_drawable");
const uploadBtn = document.getElementById("upload_button");
const xmlBtn = document.getElementById("button_xml");

const documentDir = (electron.app || electron.remote.app).getPath("documents");
const adaptFolder = `${documentDir}\\AdaptGen`;
const xmlFolder = `${documentDir}\\AdaptGen\\XML`;

let imageNameArray, sortedName, sortedDrawable;

const checkFolder = (folder1, folder2) => {
  try {
    if (!fs.existsSync(folder1)) {
      fs.mkdirSync(folder1);
      fs.mkdirSync(folder2);
    } else if (!fs.existsSync(folder2)) {
      fs.mkdirSync(folder2);
    }
  } catch (err) {
    console.error(err);
  }
};

checkFolder(adaptFolder, xmlFolder);

uploadBtn.addEventListener("click", () => {
  imageNameArray = [];
  if (process.platform !== "darwin") {
    dialog
      .showOpenDialog({
        title: "Select Images",
        defaultPath: path.join(__dirname, "../assets/"),
        buttonLabel: "Select",
        filters: [
          {
            name: "Images",
            extensions: ["png", "jpg"],
          },
        ],
        properties: ["multiSelections"],
      })
      .then((file) => {
        if (!file.canceled) {
          for (let i = 0; i < file.filePaths.length; i++) {
            global.filepath = file.filePaths[i]
              .toString()
              .replace(/^.*[\\\/]/, "")
              .split("_");
            var fileName = global.filepath
              .slice(0, global.filepath.length - 1)
              .join("_");
            imageNameArray.push(fileName);
          }
          let imageNameSet = new Set(imageNameArray);
          sortedName = [...imageNameSet];
          console.log(sortedName);
          // sortDrawable();
          console.log(sortedDrawable);
          document.getElementById("input_box").value = file.filePaths[0];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

drawableBtn.addEventListener("click", (event) => {
  sortedDrawable = "";
  for (let i = 0; i < sortedName.length; i++) {
    sortedDrawable += `  <item drawable="${sortedName[i]}" />\n`;
  }
  fs.writeFileSync(`${adaptFolder}\\Drawable.xml`, sortedDrawable);

  dialog.showMessageBox({
    type: "none",
    title: "AdaptGen",
    message: "Drawable Saved in Documents",
  });
});

xmlBtn.addEventListener("click", (event) => {
  for (let j = 0; j < sortedName.length; j++) {
    let bgfg = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/${sortedName[j]}_${
      document.getElementById("bgText").value
    }"/>
    <foreground android:drawable="@drawable/${sortedName[j]}_${
      document.getElementById("fgText").value
    }"/>
</adaptive-icon>`;
    console.log(bgfg);
    fs.writeFileSync(`${xmlFolder}\\${sortedName[j]}.xml`, bgfg);
  }

  dialog.showMessageBox({
    type: "none",
    title: "AdaptGen",
    message: "XML Saved in Documents",
  });
});

const openTwitter = () => {
  shell.openExternal("https://twitter.com/allstargauravs");
};

const openGithub = () => {
  shell.openExternal("https://github.com/allstargaurav/AdaptGen");
};
