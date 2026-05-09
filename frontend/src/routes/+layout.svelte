<script lang="ts">
	import './layout.css';
	import type { Snippet } from 'svelte';
	import { ClerkProvider, SignUp, Show } from 'svelte-clerk';

	const { children }: { children: Snippet } = $props();
</script>

<ClerkProvider>
	<Show when="signed-out">
		<div class="flex min-h-screen items-center justify-center bg-gray-50 p-6">
			<div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
				<h1 class="mb-4 text-center text-2xl font-bold">Sign in to continue</h1>
				<SignUp forceRedirectUrl="/new"></SignUp>
			</div>
		</div>
	</Show>

	<Show when="signed-in">
		{@render children()}
	</Show>
</ClerkProvider>
