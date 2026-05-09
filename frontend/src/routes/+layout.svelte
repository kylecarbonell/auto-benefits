<script lang="ts">
	import './layout.css';
	import type { Snippet } from 'svelte';
	import { ClerkProvider } from 'svelte-clerk';

	const { children }: { children: Snippet } = $props();
</script>

<ClerkProvider>
	{@render children()}
</ClerkProvider>
