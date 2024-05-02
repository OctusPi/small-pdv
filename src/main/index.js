import { app, shell, BrowserWindow, dialog } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";

import path, { join } from "path";
import icon from "../../resources/icon.png?asset";
import fs from "fs";
import migrations from "./migrations";
import token from "./security/token";
import utils from "./utils/utils";
import Ipc from "./ipc";
import Controller from "./controller";

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
            sandbox: false,
        },
    });

    const ipc = new Ipc(mainWindow.webContents);
    const controller = new Controller();

    migrations.createTables();

    ipc.request("setup_conf", async (data) => {
        async function check_setup(data) {
            const exec = await controller.exec_query(data);
            ipc.response(data.action, exec);
        }

        async function save_setup(data) {
            data.data.token = token.encode(data.data.adminpass);
            const { filePath } = await dialog.showSaveDialog({
                defaultPath: "token-recover.txt",
            });

            if (!filePath) return;

            fs.writeFile(filePath, data.data.token, (err) => {
                if (err) {
                    console.log(err.message);
					dialog.showMessageBox(
						mainWindow,
						{ message: "Falha ao salvar token" },
						() => null,
					);
                }
            });

            const exec = await controller.exec_query(data);
            ipc.response(data.action, exec);
        }

        async function update_setup(data) {
            const exec = await controller.exec_query(data);
            ipc.response(data.action, exec);
        }

        async function destroy_setup(data) {
            const exec = await controller.exec_query(data);
            ipc.response(data.action, !exec);
        }

        switch (data.action) {
            case "Setting.one":
                await check_setup(data);
                break;

            case "Setting.save":
                await save_setup(data);
                break;
            
            case "Setting.update":
                await update_setup(data);
                break;

            case "Setting.destroy":
                await destroy_setup(data);
                break;
        }
    });

    ipc.request("query_db", async (data) => {
        const exec = await controller.exec_query(data);
        ipc.response(data.action, exec);
    });

    mainWindow.on("ready-to-show", () => {
        // mainWindow.maximize();
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
