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

import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';

import BoardService from '../../../../../Services/Api/BoardService';
import {
	ModalContents,
	ModalContentsState,
} from '../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../State/TeamState';
import Team from '../../../../../Types/Team';
import { RecoilObserver } from '../../../../../Utils/RecoilObserver';

import ArchiveRetroConfirmation from './ArchiveRetroConfirmation';

jest.mock('../../../../../Services/Api/BoardService');

describe('ArchiveRetroConfirmation', () => {
	let modalContent: ModalContents | null;
	const team: Team = {
		name: 'My Team',
		id: 'fake-team-id',
	};

	beforeEach(() => {
		jest.clearAllMocks();

		modalContent = null;

		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(TeamState, team);
					set(ModalContentsState, {
						title: 'Archive Retro',
						component: <ArchiveRetroConfirmation />,
					});
				}}
			>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<ArchiveRetroConfirmation />
			</RecoilRoot>
		);
	});

	it('should archive retro and close modal', async () => {
		userEvent.click(screen.getByText('Yes!'));

		await act(async () =>
			expect(BoardService.archiveRetro).toHaveBeenCalledWith(team.id)
		);
		expect(modalContent).toBe(null);
	});

	it('should cancel archiving retro', () => {
		userEvent.click(screen.getByText('Nope'));

		expect(BoardService.archiveRetro).not.toHaveBeenCalled();
		expect(modalContent).toBe(null);
	});
});
