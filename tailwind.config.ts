import type { Config } from "tailwindcss";

/* Colors are declared as rgb(var(--token) / <alpha-value>).
   That <alpha-value> placeholder is what makes opacity modifiers work
   (bg-navy/90, text-white/70, via-teal/60, ...).

   The previous config used bare `var(--clr-x)` strings. Tailwind cannot
   inject an alpha channel into those, so it silently emitted NO rule at all
   for every class carrying a /opacity suffix — roughly 48 of them across the
   site, including the sticky nav's background. Keep the rgb(... / <alpha-value>)
   form for any color that might ever be used with an opacity modifier. */
const c = (token: string) => `rgb(var(${token}) / <alpha-value>)`;

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem'
			},
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				/* ---- shadcn/ui surface tokens (HSL, defined in index.css) ---- */
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},

				/* ---- Alcan brand canon ---- */
				navy: {
					DEFAULT: c('--c-navy'),
					deep: c('--c-navy-deep'),
					panel: c('--c-panel'),
				},
				blue: c('--c-blue'),
				teal: {
					DEFAULT: c('--c-teal'),
					bright: c('--c-teal-bright'),
				},
				rule: c('--c-gray'),

				/* neutrals ramp */
				n01: c('--c-n01'),
				n02: c('--c-n02'),
				n03: c('--c-n03'),
				n04: c('--c-n04'),
				n05: c('--c-n05'),
				n06: c('--c-n06'),
				tint01: c('--c-tint01'),
				tint02: c('--c-tint02'),

				/* semantic aliases */
				ink: {
					DEFAULT: c('--c-n06'),
					soft: c('--c-n05'),
				},
				surface: c('--c-n01'),

				/* primary keeps pointing at navy so existing bg-primary works */
				primary: {
					DEFAULT: c('--c-navy'),
					deep: c('--c-navy-deep'),
					foreground: c('--c-white'),
				},

				white: c('--c-white'),
			},
			fontFamily: {
				/* Biondi Sans is display-only per the brand guide — never body copy. */
				'biondi': ['Biondi Sans', 'Public Sans', 'system-ui', 'sans-serif'],
				'display': ['Biondi Sans', 'Public Sans', 'system-ui', 'sans-serif'],
				'sans': ['Public Sans', 'system-ui', '-apple-system', 'sans-serif'],
				'mono': ['IBM Plex Mono', 'ui-monospace', 'monospace'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'xl': '12px'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.3s ease-out',
				'accordion-up': 'accordion-up 0.3s ease-out',
				'fade-in': 'fade-in 0.6s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
