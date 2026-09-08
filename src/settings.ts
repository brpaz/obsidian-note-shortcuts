import { App, PluginSettingTab, Setting, AbstractInputSuggest, TFile } from 'obsidian';
import NoteShortcutsPlugin from './main';

export interface Shortcut {
	id: string;
	name: string;
	path: string;
}

export interface NoteShortcutsSettings {
	shortcuts: Shortcut[];
}

export const DEFAULT_SETTINGS: NoteShortcutsSettings = {
	shortcuts: [],
};

class NoteFileSuggest extends AbstractInputSuggest<TFile> {
	constructor(
		app: App,
		private inputEl: HTMLInputElement,
		private onSelectFile: (path: string) => void,
	) {
		super(app, inputEl);
	}

	getSuggestions(query: string): TFile[] {
		const lower = query.toLowerCase();
		return this.app.vault
			.getMarkdownFiles()
			.filter((file) => file.path.toLowerCase().includes(lower));
	}

	renderSuggestion(file: TFile, el: HTMLElement): void {
		el.setText(file.path);
	}

	selectSuggestion(file: TFile): void {
		this.inputEl.value = file.path;
		this.inputEl.trigger('input');
		this.onSelectFile(file.path);
		this.close();
	}
}

export class NoteShortcutsSettingTab extends PluginSettingTab {
	plugin: NoteShortcutsPlugin;

	constructor(app: App, plugin: NoteShortcutsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('p', {
			text: 'After adding or renaming a shortcut, bind its hotkey in settings → hotkeys (search by the command name below).',
		});

		this.plugin.settings.shortcuts.forEach((shortcut, index) => {
			new Setting(containerEl)
				.setName(shortcut.name)
				.addText((text) =>
					text
						.setPlaceholder('Command name')
						.setValue(shortcut.name)
						.onChange(async (value) => {
							shortcut.name = value.trim() || shortcut.name;
							await this.plugin.saveSettings();
						}),
				)
				.addText((text) => {
					text
						.setPlaceholder('Vault-relative path to note')
						.setValue(shortcut.path)
						.onChange(async (value) => {
							shortcut.path = value.trim();
							await this.plugin.saveSettings();
						});
					new NoteFileSuggest(this.app, text.inputEl, (path) => {
						shortcut.path = path;
						void this.plugin.saveSettings();
					});
				})
				.addExtraButton((button) =>
					button
						.setIcon('trash')
						.setTooltip('Remove shortcut')
						.onClick(async () => {
							this.plugin.unregisterShortcutCommand(shortcut);
							this.plugin.settings.shortcuts.splice(index, 1);
							await this.plugin.saveSettings();
							this.display();
						}),
				);
		});

		new Setting(containerEl).addButton((button) =>
			button
				.setButtonText('Add shortcut')
				.setCta()
				.onClick(async () => {
					const shortcut: Shortcut = {
						id: `note-${Date.now()}`,
						name: 'Open note',
						path: '',
					};
					this.plugin.settings.shortcuts.push(shortcut);
					this.plugin.registerShortcutCommand(shortcut);
					await this.plugin.saveSettings();
					this.display();
				}),
		);
	}
}
