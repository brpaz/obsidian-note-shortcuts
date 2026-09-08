import { App, Notice, Plugin, TFile } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	NoteShortcutsSettings,
	NoteShortcutsSettingTab,
	Shortcut,
} from './settings';

export default class NoteShortcutsPlugin extends Plugin {
	settings!: NoteShortcutsSettings;

	async onload() {
		await this.loadSettings();

		for (const shortcut of this.settings.shortcuts) {
			this.registerShortcutCommand(shortcut);
		}

		this.addSettingTab(new NoteShortcutsSettingTab(this.app, this));
	}

	registerShortcutCommand(shortcut: Shortcut) {
		this.addCommand({
			id: `open-${shortcut.id}`,
			name: shortcut.name,
			callback: () => {
				void this.openShortcut(shortcut);
			},
		});
	}

	private async openShortcut(shortcut: Shortcut) {
		const file = this.app.vault.getAbstractFileByPath(shortcut.path);
		if (!(file instanceof TFile)) {
			new Notice(`Note not found at ${shortcut.path}`);
			return;
		}
		await this.app.workspace.getLeaf(false).openFile(file);
	}

	unregisterShortcutCommand(shortcut: Shortcut) {
		(this.app as AppWithCommands).commands.removeCommand(
			`${this.manifest.id}:open-${shortcut.id}`,
		);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<NoteShortcutsSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// removeCommand exists on Obsidian's internal CommandManager but isn't part of the public App API.
interface AppWithCommands extends App {
	commands: { removeCommand: (id: string) => void };
}
