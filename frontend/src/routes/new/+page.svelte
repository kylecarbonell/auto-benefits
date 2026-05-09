<script lang="ts">
	import StateQuestion from '$lib/components/StateQuestion.svelte';
	import HouseholdSizeQuestion from '$lib/components/HouseholdSize.svelte';
	import IncomeQuestion from '$lib/components/IncomeQuestion.svelte';
	import EmploymentQuestion from '$lib/components/EmploymentQuestion.svelte';

	type QuestionnaireData = {
		state: string;
		householdSize: string;
		monthlyIncome: string;
		employmentStatus: string;
	};

	let activeStep = $state(0);
	let isComplete = $state(false);

	let formData: QuestionnaireData = $state({
		state: '',
		householdSize: '',
		monthlyIncome: '',
		employmentStatus: ''
	});

	const steps = [
		{ label: 'Location', emoji: '📍' },
		{ label: 'Household', emoji: '👥' },
		{ label: 'Income', emoji: '💰' },
		{ label: 'Employment', emoji: '💼' }
	];

	function handleNext() {
		if (activeStep === steps.length - 1) {
			isComplete = true;
		} else {
			activeStep += 1;
		}
	}

	function handleBack() {
		if (activeStep > 0) {
			activeStep -= 1;
		}
	}

	function handleChange(field: keyof QuestionnaireData, value: string) {
		formData = { ...formData, [field]: value };
	}

	function isStepValid() {
		switch (activeStep) {
			case 0:
				return formData.state !== '';
			case 1:
				return formData.householdSize !== '';
			case 2:
				return formData.monthlyIncome !== '';
			case 3:
				return formData.employmentStatus !== '';
			default:
				return false;
		}
	}

	function resetForm() {
		isComplete = false;
		activeStep = 0;
		formData = {
			state: '',
			householdSize: '',
			monthlyIncome: '',
			employmentStatus: ''
		};
	}
</script>

{#if isComplete}
	<div
		class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4"
	>
		<div class="absolute inset-0 overflow-hidden">
			<div
				class="absolute -top-20 -left-20 h-96 w-96 animate-pulse rounded-full bg-yellow-300 opacity-30 blur-3xl"
			></div>
			<div
				class="absolute -right-20 -bottom-20 h-96 w-96 animate-pulse rounded-full bg-blue-300 opacity-30 blur-3xl"
				style="animation-delay: 1s"
			></div>
		</div>

		<div class="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl md:p-12">
			<div class="mb-6 flex justify-center">
				<div
					class="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-5xl text-green-500"
				>
					✓
				</div>
			</div>

			<h1
				class="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-center text-4xl text-transparent md:text-5xl"
			>
				You're All Set! 🎉
			</h1>
			<p class="mb-8 text-center text-lg text-gray-600">
				Thank you! We'll use this info to find the best benefits for you.
			</p>

			<div class="mb-8 space-y-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6">
				<h2 class="mb-4 flex items-center gap-2 text-xl">
					<span class="text-purple-500">✨</span>
					Your Responses
				</h2>

				<div class="space-y-3">
					<div class="rounded-xl bg-white p-4">
						<p class="text-sm text-gray-500">State</p>
						<p class="text-lg">{formData.state}</p>
					</div>

					<div class="rounded-xl bg-white p-4">
						<p class="text-sm text-gray-500">Household Size</p>
						<p class="text-lg">
							{formData.householdSize}
							{#if Number.parseInt(formData.householdSize) === 1}
								person
							{:else}
								people
							{/if}
						</p>
					</div>

					<div class="rounded-xl bg-white p-4">
						<p class="text-sm text-gray-500">Monthly Income</p>
						<p class="text-lg">{formData.monthlyIncome}</p>
					</div>

					<div class="rounded-xl bg-white p-4">
						<p class="text-sm text-gray-500">Employment</p>
						<p class="text-lg">{formData.employmentStatus}</p>
					</div>
				</div>
			</div>

			<button
				onclick={resetForm}
				class="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
			>
				Start Over
			</button>
		</div>
	</div>
{:else}
	<div
		class="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 py-8"
	>
		<div class="absolute inset-0 overflow-hidden">
			<div
				class="absolute top-10 left-10 h-96 w-96 animate-pulse rounded-full bg-yellow-300 opacity-20 blur-3xl"
			></div>
			<div
				class="absolute right-10 bottom-10 h-96 w-96 animate-pulse rounded-full bg-blue-300 opacity-20 blur-3xl"
				style="animation-delay: 1.5s"
			></div>
			<div
				class="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-pink-300 opacity-20 blur-3xl"
				style="animation-delay: 0.75s"
			></div>
		</div>

		<div class="relative mx-auto max-w-3xl">
			<div class="mb-8 text-center">
				<h1 class="mb-4 text-5xl text-white drop-shadow-lg md:text-6xl">Let's Get Started! ✨</h1>
				<p class="text-xl text-white/90 drop-shadow">
					Answer a few quick questions to check your eligibility
				</p>
			</div>

			<div class="mb-8 flex justify-center gap-2">
				{#each steps as step, index}
					<div class="relative">
						<div
							class={`flex h-12 w-12 items-center justify-center rounded-full text-2xl transition-all duration-300 ${
								index === activeStep
									? 'scale-110 bg-white shadow-lg'
									: index < activeStep
										? 'bg-green-400'
										: 'bg-white/30'
							}`}
						>
							{#if index < activeStep}
								✓
							{:else}
								{step.emoji}
							{/if}
						</div>

						{#if index < steps.length - 1}
							<div
								class={`absolute top-1/2 left-full h-1 w-8 ${
									index < activeStep ? 'bg-green-400' : 'bg-white/30'
								}`}
							></div>
						{/if}
					</div>
				{/each}
			</div>

			<div class="rounded-3xl bg-white p-8 shadow-2xl md:p-12">
				<div class="mb-6">
					<p class="mb-1 text-sm text-purple-600">
						Question {activeStep + 1} of {steps.length}
					</p>
					<div class="h-2 w-full rounded-full bg-gray-200">
						<div
							class="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
							style={`width: ${((activeStep + 1) / steps.length) * 100}%`}
						></div>
					</div>
				</div>

				<div class="min-h-[350px]">
					{#if activeStep === 0}
						<StateQuestion
							value={formData.state}
							onChange={(value) => handleChange('state', value)}
						/>
					{:else if activeStep === 1}
						<HouseholdSizeQuestion
							value={formData.householdSize}
							onChange={(value) => handleChange('householdSize', value)}
						/>
					{:else if activeStep === 2}
						<IncomeQuestion
							value={formData.monthlyIncome}
							onChange={(value) => handleChange('monthlyIncome', value)}
						/>
					{:else if activeStep === 3}
						<EmploymentQuestion
							value={formData.employmentStatus}
							onChange={(value) => handleChange('employmentStatus', value)}
						/>
					{/if}
				</div>

				<div class="mt-8 flex justify-between gap-4">
					<button
						disabled={activeStep === 0}
						onclick={handleBack}
						class={`flex items-center gap-2 rounded-full px-6 py-3 transition-all duration-300 ${
							activeStep === 0
								? 'cursor-not-allowed bg-gray-200 text-gray-400'
								: 'bg-gray-200 text-gray-700 hover:scale-105 hover:bg-gray-300'
						}`}
					>
						Back
					</button>

					<button
						onclick={handleNext}
						disabled={!isStepValid()}
						class={`flex items-center gap-2 rounded-full px-8 py-3 transition-all duration-300 ${
							isStepValid()
								? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 hover:shadow-lg'
								: 'cursor-not-allowed bg-gray-200 text-gray-400'
						}`}
					>
						{#if activeStep === steps.length - 1}
							Submit
						{:else}
							Next
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
