import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		rollupOptions: {
			input: {
				popup: resolve(__dirname, 'popup.html'),
				background: resolve(__dirname, 'src/extension/background.ts'),
				content: resolve(__dirname, 'src/extension/content.ts')
			},
			output: {
				entryFileNames: (chunkInfo) => {
					if (chunkInfo.name === 'background') return 'background.js';
					if (chunkInfo.name === 'content') return 'content.js';
					return 'assets/[name]-[hash].js';
				}
			}
		}
	}
});
