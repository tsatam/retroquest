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
import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthTemplate from '../../Common/AuthTemplate/AuthTemplate';
import Form from '../../Common/AuthTemplate/Form/Form';
import InputPassword from '../../Common/AuthTemplate/InputPassword/InputPassword';
import InputTeamName from '../../Common/AuthTemplate/InputTeamName/InputTeamName';
import Input from '../../Common/Input/Input';
import useAuth from '../../Hooks/useAuth';
import { LOGIN_PAGE_PATH } from '../../RouteConstants';
import TeamService from '../../Services/Api/TeamService';
import {
	validateConfirmationPassword,
	validatePassword,
	validateTeamName,
} from '../../Utils/StringUtils';

export default function CreatePage(): JSX.Element {
	const { login } = useAuth();
	const [teamName, setTeamName] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmationPassword, setConfirmationPassword] = useState<string>('');

	const [isValidated, setIsValidated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	const teamNameErrorMessage = validateTeamName(teamName);
	const passwordErrorMessage = validatePassword(password);
	const confirmPasswordErrorMessage = validateConfirmationPassword(
		password,
		confirmationPassword
	);

	const captureErrors = () => {
		const errors = [];
		if (teamNameErrorMessage) errors.push(teamNameErrorMessage);
		if (passwordErrorMessage) errors.push(passwordErrorMessage);
		if (confirmPasswordErrorMessage) errors.push(confirmPasswordErrorMessage);
		setErrorMessages(errors);
	};

	function createTeam() {
		setIsLoading(true);
		TeamService.create(teamName, password)
			.then(login)
			.catch((error) => {
				let errorMsg = 'Incorrect team name or password. Please try again.';
				const { response } = error;
				if (response.status === 409) {
					errorMsg =
						typeof response !== 'undefined'
							? response.data.message
							: error.message;
				}
				setErrorMessages([errorMsg]);
			})
			.finally(() => setIsLoading(false));
	}

	function onSubmit() {
		setIsValidated(true);
		setErrorMessages([]);

		if (
			teamNameErrorMessage ||
			passwordErrorMessage ||
			confirmPasswordErrorMessage
		) {
			captureErrors();
		} else {
			createTeam();
		}
	}

	return (
		<AuthTemplate
			header="Create a new Team!"
			subHeader={
				<Link to={LOGIN_PAGE_PATH} data-testid="goToLoginPageLink">
					or sign in to your existing team
				</Link>
			}
		>
			<Form
				onSubmit={onSubmit}
				errorMessages={errorMessages}
				submitButtonText="Create Team"
				isLoading={isLoading}
			>
				<InputTeamName
					teamName={teamName}
					onTeamNameInputChange={(updatedTeamName: string) => {
						setTeamName(updatedTeamName);
						setErrorMessages([]);
					}}
					invalid={isValidated && !!teamNameErrorMessage}
					readOnly={isLoading}
				/>
				<InputPassword
					password={password}
					onPasswordInputChange={(updatedPassword: string) => {
						setPassword(updatedPassword);
						setErrorMessages([]);
					}}
					invalid={isValidated && !!passwordErrorMessage}
					readOnly={isLoading}
				/>
				<Input
					id="confirmPasswordInput"
					label="Confirm Password"
					type="password"
					value={confirmationPassword}
					onChange={(event) => {
						setConfirmationPassword(event.target.value);
						setErrorMessages([]);
					}}
					invalid={isValidated && !!confirmPasswordErrorMessage}
					readOnly={isLoading}
				/>
			</Form>
		</AuthTemplate>
	);
}
