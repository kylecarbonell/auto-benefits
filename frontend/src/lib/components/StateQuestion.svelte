<script lang="ts">
	import { onMount } from 'svelte';

	let {
		value,
		onChange
	}: {
		value: string;
		onChange: (value: string) => void;
	} = $props();

	let searchTerm = $state('');
	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement | undefined;

	const US_STATES = [
		'Alabama',
		'Alaska',
		'Arizona',
		'Arkansas',
		'California',
		'Colorado',
		'Connecticut',
		'Delaware',
		'Florida',
		'Georgia',
		'Hawaii',
		'Idaho',
		'Illinois',
		'Indiana',
		'Iowa',
		'Kansas',
		'Kentucky',
		'Louisiana',
		'Maine',
		'Maryland',
		'Massachusetts',
		'Michigan',
		'Minnesota',
		'Mississippi',
		'Missouri',
		'Montana',
		'Nebraska',
		'Nevada',
		'New Hampshire',
		'New Jersey',
		'New Mexico',
		'New York',
		'North Carolina',
		'North Dakota',
		'Ohio',
		'Oklahoma',
		'Oregon',
		'Pennsylvania',
		'Rhode Island',
		'South Carolina',
		'South Dakota',
		'Tennessee',
		'Texas',
		'Utah',
		'Vermont',
		'Virginia',
		'Washington',
		'West Virginia',
		'Wisconsin',
		'Wyoming'
	];

	const filteredStates = $derived(
		US_STATES.filter((state) => state.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
				isOpen = false;
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});
</script>

<div>
	<h2
		class="mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl text-transparent md:text-4xl"
	>
		What state do you live in? 📍
	</h2>
	<p class="mb-6 text-lg text-gray-600">
		Benefits eligibility varies by state, so this helps us find the right programs for you!
	</p>

	<div class="relative" bind:this={dropdownRef}>
		<div class="relative">
			<span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">🔍</span>
			<input
				type="text"
				bind:value={searchTerm}
				oninput={(e) => {
					isOpen = true;
				}}
				onfocus={() => {
					isOpen = true;
				}}
				placeholder="Start typing your state..."
				class="w-full rounded-2xl border-2 border-purple-200 py-4 pr-4 pl-12 text-lg transition-all focus:border-purple-500 focus:outline-none"
			/>
		</div>

		{#if isOpen && filteredStates.length > 0}
			<div
				class="absolute z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border-2 border-purple-200 bg-white shadow-xl"
			>
				{#each filteredStates as state}
					<button
						type="button"
						onclick={() => {
							onChange(state);
							searchTerm = '';
							isOpen = false;
						}}
						class={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-purple-50 ${
							value === state ? 'bg-purple-100' : ''
						}`}
					>
						<span class="text-purple-500">📍</span>
						<span class="text-lg">{state}</span>
					</button>
				{/each}
			</div>
		{/if}

		{#if value && !isOpen}
			<div
				class="mt-4 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-4"
			>
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500">
					<span class="text-white">📍</span>
				</div>
				<div>
					<p class="text-sm text-gray-600">Selected State</p>
					<p class="text-lg">{value}</p>
				</div>
			</div>
		{/if}
	</div>
</div>
