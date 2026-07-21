const { Plugin, Notice, PluginSettingTab, Setting } = require("obsidian");
const { execFile } = require("child_process");
const { promisify } = require("util");
const path = require("path");
const fs = require("fs");

const execFileAsync = promisify(execFile);

const DEFAULT_SETTINGS = {
  remoteUrl: "https://github.com/169068671/Summary-of-Supplementary-Materials-for-Educational-Research.git",
  branch: "main",
  runValidation: true,
};

class ResearchGitHubSyncPlugin extends Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.syncing = false;

    this.statusBar = this.addStatusBarItem();
    this.statusBar.addClass("research-github-sync-status");
    this.statusBar.setText("教科研 GitHub：待同步");

    this.addRibbonIcon("cloud-upload", "一键上传教科研补件到 GitHub", () => this.runSync(false));

    this.addCommand({
      id: "upload-research-supplements-to-github",
      name: "一键上传整个教科研补件仓库到 GitHub",
      callback: () => this.runSync(false),
    });

    this.addCommand({
      id: "check-research-supplements-git-status",
      name: "检查教科研补件 GitHub 同步状态",
      callback: () => this.runSync(true),
    });

    this.addSettingTab(new ResearchGitHubSyncSettingTab(this.app, this));
  }

  vaultPath() {
    const adapter = this.app.vault.adapter;
    if (!adapter || typeof adapter.getBasePath !== "function") {
      throw new Error("此插件只支持 Obsidian 桌面端的本地仓库。");
    }
    return adapter.getBasePath();
  }

  scriptPath(vaultPath) {
    return path.join(vaultPath, "plugins", "github-vault-sync", "scripts", "sync_vault.py");
  }

  parsePayload(stdout, fallback) {
    try {
      return JSON.parse((stdout || "").trim());
    } catch (_) {
      return { ok: false, message: fallback || "同步脚本未返回有效结果。" };
    }
  }

  async runSync(statusOnly) {
    if (this.syncing) {
      new Notice("同步任务正在运行，请勿重复点击。");
      return;
    }

    this.syncing = true;
    const notice = new Notice(statusOnly ? "正在检查 Git 状态…" : "正在核验并上传到 GitHub…", 0);
    this.statusBar.setText(statusOnly ? "教科研 GitHub：检查中" : "教科研 GitHub：上传中");

    try {
      const vaultPath = this.vaultPath();
      const scriptPath = this.scriptPath(vaultPath);
      if (!fs.existsSync(scriptPath)) {
        throw new Error(`缺少安全同步脚本：${scriptPath}`);
      }

      const args = [
        scriptPath,
        "--vault",
        vaultPath,
        "--remote-url",
        this.settings.remoteUrl,
        "--branch",
        this.settings.branch,
        "--json",
      ];
      if (statusOnly) args.push("--status");
      if (!statusOnly && this.settings.runValidation) args.push("--validate");

      const { stdout } = await execFileAsync("python3", args, {
        cwd: vaultPath,
        timeout: 180000,
        maxBuffer: 8 * 1024 * 1024,
        env: Object.assign({}, process.env, { GIT_TERMINAL_PROMPT: "0" }),
      });

      const payload = this.parsePayload(stdout);
      if (!payload.ok) throw new Error(payload.message);

      notice.setMessage(payload.message);
      if (statusOnly) {
        this.statusBar.setText(`教科研 GitHub：${payload.changes || 0} 项待同步`);
      } else {
        this.statusBar.setText(`教科研 GitHub：已上传 ${payload.commit}`);
      }
      window.setTimeout(() => notice.hide(), 6000);
    } catch (error) {
      const stdout = error && error.stdout ? String(error.stdout) : "";
      const payload = this.parsePayload(stdout, error && error.message ? error.message : String(error));
      const message = payload.message || (error && error.message) || String(error);
      console.error("Research GitHub Sync failed", error);
      notice.setMessage(`GitHub 上传失败：${message}`);
      this.statusBar.setText("教科研 GitHub：上传失败");
      window.setTimeout(() => notice.hide(), 15000);
    } finally {
      this.syncing = false;
    }
  }
}

class ResearchGitHubSyncSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "教科研补件 GitHub Sync" });
    containerEl.createEl("p", {
      text: "插件不保存 Token，使用电脑现有的 Git/SSH 凭据；上传前自动核验，不强推、不改写远程历史。",
    });

    new Setting(containerEl)
      .setName("GitHub 仓库地址")
      .setDesc("如果本地已有不同远程地址，插件会停止，不会擅自替换。")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.remoteUrl)
          .setValue(this.plugin.settings.remoteUrl)
          .onChange(async (value) => {
            this.plugin.settings.remoteUrl = value.trim();
            await this.plugin.saveData(this.plugin.settings);
          })
      );

    new Setting(containerEl)
      .setName("分支")
      .setDesc("默认使用 main。")
      .addText((text) =>
        text.setValue(this.plugin.settings.branch).onChange(async (value) => {
          this.plugin.settings.branch = value.trim() || "main";
          await this.plugin.saveData(this.plugin.settings);
        })
      );

    new Setting(containerEl)
      .setName("上传前核验仓库")
      .setDesc("建议保持开启；核验失败时不会提交或推送。")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.runValidation).onChange(async (value) => {
          this.plugin.settings.runValidation = value;
          await this.plugin.saveData(this.plugin.settings);
        })
      );

    new Setting(containerEl)
      .setName("检查当前状态")
      .setDesc("只读检查，不初始化、不提交、不上传。")
      .addButton((button) => button.setButtonText("检查").onClick(() => this.plugin.runSync(true)));

    containerEl.createEl("h3", { text: "首次使用前的 GitHub 认证" });
    containerEl.createEl("p", {
      text: "如果提示认证失败，请在终端执行 gh auth login -h github.com，然后执行 gh auth setup-git。插件不会读取或保存密码、Token。",
    });
  }
}

module.exports = ResearchGitHubSyncPlugin;
