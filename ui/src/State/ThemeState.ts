/*
 * Copyright (c) 2022 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { atom } from 'recoil';

import Theme from '../Types/Theme';

const ITEM_KEY = 'theme';

export const ThemeState = atom<Theme>({
	key: 'themeState',
	default: getThemeUserSettings(),
	effects_UNSTABLE: [
		({ onSet }) => {
			onSet((newTheme) => {
				const isDarkMode = newTheme === Theme.DARK;
				if (isDarkMode) {
					localStorage.setItem(ITEM_KEY, Theme.DARK);
				} else {
					localStorage.setItem(ITEM_KEY, Theme.LIGHT);
				}
			});
		},
	],
});

export function getThemeUserSettings() {
	const activeTheme = localStorage.getItem(ITEM_KEY) as Theme;
	const clientPrefersDark = window.matchMedia(
		'(prefers-color-scheme:dark)'
	).matches;
	return activeTheme || (clientPrefersDark ? Theme.DARK : Theme.LIGHT);
}
