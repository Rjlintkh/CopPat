class CopPat {
    constructor() {
        this.pageElements = {
            base: document.querySelector(`#app`),
            bottomPanel: document.querySelector(`.leaderboard`),
            bottomPanelContainer: document.querySelector(`.leaderboard main`),
            bottomPanelContentLeaderboard: document.querySelector(`.leaderboard .main-wrap`),
            bottomBar: document.querySelector(`.bar`),
            bottomBarTitle: document.querySelector(`.leaderboard .preview h2`),
            twitter: document.querySelector(`[data-v-84111686]`),
            share: document.querySelector(`[data-v-22b901cb]`),
            catImage: document.querySelector(`.cat-img`),
            popCounter: document.querySelector(`.cat-img .counter`),
        };
        this.settings = {
        };
        this.settingsOpen = false;
        if (document.readyState === "complete") {
            this.init();
        } else {
            window.onload = () => {
                this.init();
            };
        }
    }

    addSettings() {
        this.pageElements.bottomBar.addEventListener("pointerdown", e => {
            if (e.path[0].innerHTML === "⚙️") {
                if (this.settingsOpen) {
                    this.closeSettingsPanel();
                } else {
                    this.openSettingsPanel();
                }
                e.stopImmediatePropagation();
            } else {
                this.closeSettingsPanel(false);
            }
        }, true);
    
        this.pageElements.settingsButton = document.createElement("h1");
        this.pageElements.settingsButton.setAttribute("data-v-0a2cb64d", "");
        this.pageElements.settingsButton.className = "show";
        this.pageElements.settingsButton.innerHTML = "⚙️";
        this.pageElements.bottomBar.insertBefore(this.pageElements.settingsButton, this.pageElements.bottomBar.firstChild);

        this.pageElements.bottomPanelContentSettings = document.createElement("div");
        this.pageElements.bottomPanelContentSettings.setAttribute("data-v-0a2cb64d", "");
        this.pageElements.bottomPanelContentSettings.className = "main-wrap";
        this.pageElements.bottomPanelContentSettings.style = "--max-height:272px;";
        this.pageElements.bottomPanelContentSettings.style.height = "272px";
        this.pageElements.bottomPanelContentSettings.style.width = "800px";
        this.pageElements.bottomPanelContentSettings.style.display = "none";

        this.pageElements.bottomPanelContentSettingsList = document.createElement("ol");
        this.pageElements.bottomPanelContentSettingsList.setAttribute("data-v-0a2cb64d", "");
        this.pageElements.bottomPanelContentSettings.appendChild(this.pageElements.bottomPanelContentSettingsList);
        this.pageElements.settingsButton.className = "list";

        this.addSettingsItem("Hide Share Icon", v => this.hideShareIcon(v), 0);
        this.addSettingsItem("Hide Twitter Icon", v => this.hideTwitterIcon(v), 0);
        this.addSettingsItem("Always Sit On Leaderboard", v => this.alwaysSitOnLeaderBoard(v), 0);

        this.pageElements.bottomPanelContainer.appendChild(this.pageElements.bottomPanelContentSettings);
    }

    /**
     * @param {string} displayName
     * @param {Function} callback
     * @param {number} type - 0: checkbox; 1: textbox;
     */
    addSettingsItem(displayName, callback, type) {
        const item = document.createElement("li");
        item.setAttribute("data-v-0a2cb64d", "");
        const left = document.createElement("span");
        left.setAttribute("data-v-0a2cb64d", "");
        left.className = "country";
        left.style.textAlign = "left";
        left.innerHTML = displayName;
        item.appendChild(left);
        const right = document.createElement("span");
        right.setAttribute("data-v-0a2cb64d", "");
        right.className = "count";
        right.style.textAlign = "right";
        switch (type) {
        case 0:
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("data-v-0a2cb64d", "");
            checkbox.defaultChecked = this.settings[displayName] ?? false;
            checkbox.addEventListener("change", e => {
                callback(e.target.checked);
                this.settings[displayName] = e.target.checked;
                localStorage.setItem("settings", JSON.stringify(this.settings));
            });
            right.appendChild(checkbox);
            break;
        case 1:
            const textbox = document.createElement("input");
            textbox.setAttribute("type", "text");
            textbox.setAttribute("data-v-0a2cb64d", "");
            checkbox.defaultValue = this.settings[displayName] ?? false;
            textbox.addEventListener("change", e => {
                callback(e.target.value);
                this.settings[displayName] = e.target.value;
                localStorage.setItem("settings", JSON.stringify(this.settings));
            });
            right.appendChild(textbox);
            break;
        }
        if (this.settings[displayName]) {
            callback(this.settings[displayName]);
        }
        item.appendChild(right);
        this.pageElements.bottomPanelContentSettingsList.appendChild(item);
    }

    openSettingsPanel() {
        this.openBottomPanel();
        this.pageElements.bottomPanelContentLeaderboard.style.display = "none";
        this.pageElements.bottomPanelContentSettings.style.display = "";
        try {
            this.pageElements.bottomBarTitle.innerHTML = "Settings";
        } catch { }
        this.settingsOpen = true;
        console.log("settings", this.settingsOpen);
    }

    closeSettingsPanel(closePanel = true) {
        this.pageElements.bottomPanelContentLeaderboard.style.display = "";
        this.pageElements.bottomPanelContentSettings.style.display = "none";
        try {
            this.pageElements.bottomBarTitle.innerHTML = "Leaderboard";
        } catch { }
        if (closePanel) this.closeBottomPanel();
        this.settingsOpen = false;
        console.log("settings", this.settingsOpen);
    }

    openBottomPanel() {
        this.pageElements.bottomPanel.classList.add("open");
    }

    closeBottomPanel() {
        this.pageElements.bottomPanel.classList.remove("open");
    }

    /**
     * @param {boolean} value
     */
    alwaysSitOnLeaderBoard(value = true) {
        this.pageElements.bottomPanel.style.position = value ? "static" : "absolute";
    }

    /**
     * @param {boolean} value
     */
    hideShareIcon(value = true) {
        this.pageElements.share.style.display = value ? "none" : "";
    }

    /**
     * @param {boolean} value
     */
    hideTwitterIcon(value = true) {
        this.pageElements.twitter.style.display = value ? "none" : "";
    }

    setUpPPSCounter() {
        this.pageElements.ppsCounter = document.createElement("div");
        this.pageElements.ppsCounter.style.position = "absolute";
        this.pageElements.ppsCounter.style.top = "150px";
        this.pageElements.ppsCounter.style.width = "800px";
        this.pageElements.ppsCounter.style.textAlign = "center";
        this.pageElements.catImage.appendChild(this.pageElements.ppsCounter);

        const leftClicks = [];
        const rightClicks = [];
        document.addEventListener("mousedown", e => {
            if (e.button === 0) {
                leftClicks.push(new Date().getTime());
            } else if (e.button === 2) {
                rightClicks.push(new Date().getTime());
            }
        });
        
        setInterval(() => {
            const currentTime = new Date().getTime();
            for (const [i, e] of leftClicks.entries()) {
                if ((currentTime - e) / 1000 >= 1) {
                    leftClicks.splice(i, 1);
                }
            }
            for (const [i, e] of rightClicks.entries()) {
                if ((currentTime - e) / 1000 >= 1) {
                    rightClicks.splice(i, 1);
                }
            }
            this.pageElements.ppsCounter.className = this.pageElements.popCounter.className;
            this.pageElements.ppsCounter.innerHTML = "PPS: " + leftClicks.length + " | " + rightClicks.length;
        }, 1);
    }

    
    init() {
        document.addEventListener("contextmenu", e => e.preventDefault());
        if (localStorage.getItem("settings") !== null) {
            this.settings = JSON.parse(localStorage.getItem("settings"));
        }
        this.setUpPPSCounter();
        this.addSettings();
    }
}

const CP = new CopPat();
