<script lang="ts">
	let {
		value,
		onChange
	}: {
		value: string;
		onChange: (value: string) => void;
	} = $props();

	const HOUSEHOLD_OPTIONS = [
		{ value: '1', label: '1 person', icon: '👤', color: 'from-blue-400 to-cyan-400' },
		{ value: '2', label: '2 people', icon: '👥', color: 'from-purple-400 to-pink-400' },
		{ value: '3', label: '3 people', icon: '🏠', color: 'from-pink-400 to-rose-400' },
		{ value: '4', label: '4 people', icon: '🏡', color: 'from-orange-400 to-amber-400' },
		{ value: '5', label: '5 people', icon: '👨‍👩‍👧', color: 'from-green-400 to-emerald-400' },
		{ value: '6+', label: '6 or more', icon: '👨‍👩‍👧‍👦', color: 'from-indigo-400 to-purple-400' }
	];
</script>

<div>
	<h2
		class="mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl text-transparent md:text-4xl"
	>
		How many people are in your household? 👥
	</h2>
	<p class="mb-6 text-lg text-gray-600">
		Include yourself and everyone who lives with you and shares expenses.
	</p>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#each HOUSEHOLD_OPTIONS as option, index}
			<button
				type="button"
				onclick={() => onChange(option.value)}
				class={`relative rounded-2xl border-2 p-5 transition-all duration-300 ${
					value === option.value
						? `border-purple-500 bg-gradient-to-r ${option.color} scale-105 text-white shadow-lg`
						: 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
				}`}
				style={`animation-delay: ${index * 0.05}s`}
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div
							class={`flex h-12 w-12 items-center justify-center rounded-xl ${
								value === option.value ? 'bg-white/20' : 'bg-purple-50'
							}`}
						>
							<span class={`text-2xl ${value === option.value ? 'text-white' : 'text-purple-500'}`}>
								{option.icon}
							</span>
						</div>

						<p class={`text-lg ${value === option.value ? 'text-white' : 'text-gray-900'}`}>
							{option.label}
						</p>
					</div>

					{#if value === option.value}
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-white">
							<span class="font-bold text-purple-500">✓</span>
						</div>
					{/if}
				</div>
			</button>
		{/each}
	</div>
</div>
