const electron = require("electron");
const fs = require("fs");
const path = require("path");
const { dialog } = require("electron").remote;
const { shell } = window.require("electron");

const drawableBtn = document.getElementById("button_drawable");
const uploadBtn = document.getElementById("upload_button");
const xmlBtn = document.getElementById("button_xml");

const documentDir = (electron.app || electron.remote.app).getPath("documents");
let defualtDir = path.join(__dirname, "../assets/");

let imageNameArray, sortedName, sortedDrawable;

uploadBtn.addEventListener("click", () => {
  imageNameArray = [];
  if (process.platform !== "darwin") {
    dialog
      .showOpenDialog({
        title: "Select Images",
        defaultPath: defualtDir,
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
          document.getElementById("input_box").value = file.filePaths[0];
          defualtDir = file.filePaths[0];
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
  let drawableSaveLocation = dialog.showSaveDialogSync({
    title: "AdaptGen",
    defaultPath: `${documentDir}\\drawable.xml`,
    filters: [
      {
        name: "Xml",
        extensions: ["xml"],
      },
    ],
  });
  if (drawableSaveLocation) {
    fs.writeFileSync(drawableSaveLocation, sortedDrawable);
  }
});

xmlBtn.addEventListener("click", (event) => {
  dialog
    .showOpenDialog({
      title: "Select folder to save generated files",
      defaultPath: documentDir,
      properties: ["openDirectory"],
    })
    .then((folder) => {
      if (!folder.canceled) {
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

          fs.writeFileSync(`${folder.filePaths}\\${sortedName[j]}.xml`, bgfg);
        }
      }
    });
});

// Open social media links
const openTwitter = () => {
  shell.openExternal("https://twitter.com/allstargauravs");
};

const openGithub = () => {
  shell.openExternal("https://github.com/allstargaurav/AdaptGen");
};
